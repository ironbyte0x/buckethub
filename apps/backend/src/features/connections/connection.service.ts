import { ProviderType } from '@buckethub/core';
import {
  ConnectionId,
  CreateConnectionRequest,
  ListBucketsAccessDeniedError,
  UpdateConnectionRequest
} from '@buckethub/rpc-contract';
import { ORPCError } from '@orpc/server';
import { S3Storage } from '../../shared/storage';
import { ConnectionRepository } from './connection.repository';
import { EndpointSSRFValidator } from './endpoint-ssrf-validator';

export class ConnectionService {
  constructor(
    private readonly s3Storage: S3Storage,
    private readonly connectionRepository: ConnectionRepository
  ) {}

  private async detectProviderType(endpoint: string): Promise<ProviderType> {
    if (endpoint.includes('amazonaws.com')) {
      return ProviderType.AmazonS3;
    }

    if (endpoint.includes('r2.cloudflarestorage.com')) {
      return ProviderType.CloudflareR2;
    }

    if (endpoint.includes('backblazeb2.com')) {
      return ProviderType.BackblazeB2;
    }

    if (endpoint.includes('wasabisys.com')) {
      return ProviderType.Wasabi;
    }

    if (endpoint.includes('digitaloceanspaces.com')) {
      return ProviderType.DigitalOceanSpaces;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      const server = response.headers.get('server');

      if (server?.toLowerCase().includes('minio')) {
        return ProviderType.MinIO;
      }
    } catch {
      // Endpoint may not respond to HEAD — fall through
    }

    return ProviderType.Other;
  }

  private async validateEndpoint(endpoint: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      await EndpointSSRFValidator.validate(endpoint);
    }
  }

  private async testConnection(
    endpoint: string,
    accessKeyId: string,
    secretAccessKey: string
  ): Promise<boolean> {
    try {
      await this.s3Storage.listBuckets({
        accessKeyId,
        secretAccessKey,
        endpoint,
        bucket: ''
      });

      return true;
    } catch (error) {
      if (error instanceof ListBucketsAccessDeniedError) {
        return true;
      }

      throw error;
    }
  }

  public async getAll(userId: string, role: string) {
    return this.connectionRepository.getAllForUser(userId, role);
  }

  public async create(data: CreateConnectionRequest, userId: string) {
    await this.validateEndpoint(data.endpoint);

    await this.testConnection(data.endpoint, data.accessKeyId, data.secretAccessKey);

    const providerType = await this.detectProviderType(data.endpoint);

    const connection = await this.connectionRepository.create({
      id: data.id,
      providerType,
      label: data.label,
      accessKeyId: data.accessKeyId,
      secretAccessKey: data.secretAccessKey,
      endpoint: data.endpoint,
      createdBy: userId
    });

    return connection;
  }

  public async deleteConnection(id: ConnectionId) {
    const connection = await this.connectionRepository.getById(id);

    if (!connection) {
      throw new ORPCError('NOT_FOUND', { message: 'Connection not found' });
    }

    await this.connectionRepository.deleteConnection(id);

    this.s3Storage.invalidateClientCache({
      accessKeyId: connection.accessKeyId,
      endpoint: connection.endpoint
    });
  }

  public async update(data: UpdateConnectionRequest) {
    const originalConnection = await this.connectionRepository.getById(data.id);

    if (!originalConnection) {
      throw new ORPCError('NOT_FOUND', { message: 'Connection not found' });
    }

    let endpoint = originalConnection.endpoint;
    let accessKeyId = originalConnection.accessKeyId;
    let secretAccessKey = originalConnection.secretAccessKey;

    if (data.endpoint !== undefined) {
      endpoint = data.endpoint;
    }

    if (data.accessKeyId !== undefined) {
      accessKeyId = data.accessKeyId;
    }

    if (data.secretAccessKey !== undefined) {
      secretAccessKey = data.secretAccessKey;
    }

    if (data.endpoint !== undefined) {
      await this.validateEndpoint(endpoint);
    }

    await this.testConnection(endpoint, accessKeyId, secretAccessKey);

    const providerType =
      data.endpoint === undefined
        ? originalConnection.providerType
        : await this.detectProviderType(endpoint);

    const connection = await this.connectionRepository.update({
      id: data.id,
      label: data.label,
      providerType,
      accessKeyId,
      secretAccessKey,
      endpoint
    });

    this.s3Storage.invalidateClientCache({
      accessKeyId: originalConnection.accessKeyId,
      endpoint: originalConnection.endpoint
    });

    return connection;
  }
}
