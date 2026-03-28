import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProviderType, UserRole } from '@buckethub/core';
import {
  ConnectionId,
  CreateConnectionRequest,
  InvalidUrlError,
  ListBucketsAccessDeniedError
} from '@buckethub/rpc-contract';
import { createMockClass } from '@buckethub/test';
import { S3Storage } from '../../shared/storage';
import { ConnectionRepository } from './connection.repository';
import { ConnectionService } from './connection.service';

function createMockConnectionRepository() {
  return createMockClass<ConnectionRepository>();
}

function createMockS3Storage() {
  return createMockClass<S3Storage>();
}

describe('ConnectionService', () => {
  let connectionService: ConnectionService;
  let connectionRepository: ReturnType<typeof createMockConnectionRepository>;
  let s3: ReturnType<typeof createMockS3Storage>;

  beforeEach(() => {
    connectionRepository = createMockConnectionRepository();
    s3 = createMockS3Storage();
    connectionService = new ConnectionService(s3, connectionRepository);
  });

  describe('getProviderEndpoint', () => {
    async function getEndpoint(overrides: Partial<CreateConnectionRequest> = {}): Promise<string> {
      s3.listBuckets.mockResolvedValue({ $metadata: {} });

      connectionRepository.create.mockResolvedValue({
        id: 'test-id' as ConnectionId,
        label: 'Test',
        providerType: ProviderType.AmazonS3,
        endpoint: overrides.endpoint ?? 'https://custom.endpoint.com'
      });

      connectionRepository.getCountByProviderType.mockResolvedValue(0);

      const data: CreateConnectionRequest = {
        id: 'test-id' as ConnectionId,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://custom.endpoint.com',
        ...overrides
      };

      await connectionService.create(data, 'user-1');

      return connectionRepository.create.mock.calls[0][0].endpoint;
    }

    it('stores AWS S3 endpoint for AmazonS3', async () => {
      const endpoint = await getEndpoint({
        endpoint: 'https://s3.amazonaws.com'
      });

      expect(endpoint).toBe('https://s3.amazonaws.com');
    });

    it('stores Cloudflare R2 endpoint with account ID', async () => {
      const endpoint = await getEndpoint({
        endpoint: 'https://myaccount.r2.cloudflarestorage.com'
      });

      expect(endpoint).toBe('https://myaccount.r2.cloudflarestorage.com');
    });

    it('stores custom endpoint for MinIO', async () => {
      const endpoint = await getEndpoint({
        endpoint: 'https://minio.local:9000'
      });

      expect(endpoint).toBe('https://minio.local:9000');
    });

    it('stores Backblaze B2 endpoint with region', async () => {
      const endpoint = await getEndpoint({
        endpoint: 'https://s3.us-west-002.backblazeb2.com'
      });

      expect(endpoint).toBe('https://s3.us-west-002.backblazeb2.com');
    });

    it('stores Wasabi endpoint with region', async () => {
      const endpoint = await getEndpoint({
        endpoint: 'https://s3.eu-central-1.wasabisys.com'
      });

      expect(endpoint).toBe('https://s3.eu-central-1.wasabisys.com');
    });

    it('stores custom endpoint for Other provider', async () => {
      const endpoint = await getEndpoint({
        endpoint: 'https://my-s3.example.com'
      });

      expect(endpoint).toBe('https://my-s3.example.com');
    });
  });

  describe('getAll', () => {
    it('delegates to repository with userId and role', async () => {
      const connections = [
        {
          id: '1' as ConnectionId,
          label: 'Test',
          providerType: ProviderType.AmazonS3,
          endpoint: 'https://s3.amazonaws.com',
          createdBy: 'user-1'
        }
      ];

      connectionRepository.getAllForUser.mockResolvedValue(connections);

      const result = await connectionService.getAll('user-1', UserRole.Admin);

      expect(connectionRepository.getAllForUser).toHaveBeenCalledWith('user-1', UserRole.Admin);
      expect(result).toEqual(connections);
    });
  });

  describe('create', () => {
    it('detects provider type from endpoint and creates connection', async () => {
      const createdConnection = {
        id: 'conn-1' as ConnectionId,
        label: 'Test',
        providerType: ProviderType.AmazonS3,
        endpoint: 'https://s3.amazonaws.com'
      };

      s3.listBuckets.mockResolvedValue({ $metadata: {} });
      connectionRepository.create.mockResolvedValue(createdConnection);

      const result = await connectionService.create(
        {
          id: 'conn-1' as ConnectionId,
          label: 'Test',
          accessKeyId: 'key',
          secretAccessKey: 'secret',
          endpoint: 'https://s3.amazonaws.com'
        },
        'user-1'
      );

      expect(connectionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ providerType: ProviderType.AmazonS3 })
      );

      expect(result).toEqual(createdConnection);
    });

    it('detects MinIO from server header after connection succeeds', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(null, { headers: { server: 'MinIO' } }));

      s3.listBuckets.mockResolvedValue({ $metadata: {} });

      connectionRepository.create.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        label: 'Test',
        providerType: ProviderType.MinIO,
        endpoint: 'https://minio.example.com'
      });

      try {
        await connectionService.create(
          {
            id: 'conn-1' as ConnectionId,
            label: 'Test',
            accessKeyId: 'key',
            secretAccessKey: 'secret',
            endpoint: 'https://minio.example.com'
          },
          'user-1'
        );

        expect(connectionRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({ providerType: ProviderType.MinIO })
        );
      } finally {
        fetchSpy.mockRestore();
      }
    });

    it('treats ListBucketsAccessDeniedError as successful connection test', async () => {
      s3.listBuckets.mockRejectedValue(new ListBucketsAccessDeniedError());

      connectionRepository.create.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        label: '',
        providerType: ProviderType.AmazonS3,
        endpoint: ''
      });

      await expect(
        connectionService.create(
          {
            id: 'conn-1' as ConnectionId,
            label: 'Test',
            accessKeyId: 'key',
            secretAccessKey: 'secret',
            endpoint: 'https://s3.amazonaws.com'
          },
          'user-1'
        )
      ).resolves.toBeDefined();

      expect(connectionRepository.create).toHaveBeenCalledOnce();
    });

    it('rejects invalid production endpoints before outbound requests', async () => {
      const originalNodeEnvironment = process.env.NODE_ENV;
      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      process.env.NODE_ENV = 'production';

      try {
        await expect(
          connectionService.create(
            {
              id: 'conn-1' as ConnectionId,
              label: 'Test',
              accessKeyId: 'key',
              secretAccessKey: 'secret',
              endpoint: 'http://127.0.0.1'
            },
            'user-1'
          )
        ).rejects.toBeInstanceOf(InvalidUrlError);

        expect(fetchSpy).not.toHaveBeenCalled();
        expect(s3.listBuckets).not.toHaveBeenCalled();
        expect(connectionRepository.create).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalNodeEnvironment;
        fetchSpy.mockRestore();
      }
    });
  });

  describe('deleteConnection', () => {
    it('deletes and invalidates S3 client cache', async () => {
      const connection = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.amazonaws.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };

      connectionRepository.getById.mockResolvedValue(connection);

      await connectionService.deleteConnection('conn-1' as ConnectionId);

      expect(connectionRepository.deleteConnection).toHaveBeenCalledWith('conn-1');

      expect(s3.invalidateClientCache).toHaveBeenCalledWith({
        accessKeyId: 'key',
        endpoint: 'https://s3.amazonaws.com'
      });
    });
  });

  describe('update', () => {
    it('merges partial updates with original connection', async () => {
      const original = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'original-key',
        secretAccessKey: 'original-secret',
        endpoint: 'https://s3.amazonaws.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };
      const updated = {
        id: 'conn-1' as ConnectionId,
        label: 'Updated',
        providerType: ProviderType.AmazonS3,
        endpoint: 'https://s3.amazonaws.com'
      };

      connectionRepository.getById.mockResolvedValue(original);
      s3.listBuckets.mockResolvedValue({ $metadata: {} });
      connectionRepository.update.mockResolvedValue(updated);

      const result = await connectionService.update({
        id: 'conn-1' as ConnectionId,
        label: 'Updated'
      });

      expect(connectionRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          accessKeyId: 'original-key',
          secretAccessKey: 'original-secret',
          endpoint: 'https://s3.amazonaws.com'
        })
      );

      expect(result).toEqual(updated);
    });

    it('re-detects provider type when endpoint changes', async () => {
      const original = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.amazonaws.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };

      connectionRepository.getById.mockResolvedValue(original);
      s3.listBuckets.mockResolvedValue({ $metadata: {} });

      connectionRepository.update.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        label: 'Test',
        providerType: ProviderType.CloudflareR2,
        endpoint: 'https://myaccount.r2.cloudflarestorage.com'
      });

      await connectionService.update({
        id: 'conn-1' as ConnectionId,
        label: 'Test',
        endpoint: 'https://myaccount.r2.cloudflarestorage.com'
      });

      expect(connectionRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ providerType: ProviderType.CloudflareR2 })
      );
    });

    it('preserves original provider type when endpoint is unchanged', async () => {
      const original = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.amazonaws.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };

      connectionRepository.getById.mockResolvedValue(original);
      s3.listBuckets.mockResolvedValue({ $metadata: {} });

      connectionRepository.update.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        label: 'Renamed',
        providerType: ProviderType.AmazonS3,
        endpoint: 'https://s3.amazonaws.com'
      });

      await connectionService.update({
        id: 'conn-1' as ConnectionId,
        label: 'Renamed'
      });

      expect(connectionRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ providerType: ProviderType.AmazonS3 })
      );
    });

    it('invalidates old connection cache', async () => {
      const original = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'old-key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.amazonaws.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };

      connectionRepository.getById.mockResolvedValue(original);
      s3.listBuckets.mockResolvedValue({ $metadata: {} });

      connectionRepository.update.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        label: 'Test',
        providerType: ProviderType.AmazonS3,
        endpoint: 'https://s3.amazonaws.com'
      });

      await connectionService.update({ id: 'conn-1' as ConnectionId, label: 'Test' });

      expect(s3.invalidateClientCache).toHaveBeenCalledWith({
        accessKeyId: 'old-key',
        endpoint: 'https://s3.amazonaws.com'
      });
    });
  });
});
