import { beforeEach, describe, expect, it } from 'vitest';
import { createMockClass } from '@buckethub/test';
import type { Auth } from '../../auth';
import { S3Storage } from '../../shared/storage';
import { ConnectionRepository } from '../connections';
import { UserService } from './user.service';

function createMockAuth() {
  return {
    api: {
      removeUser: createMockClass<Auth['api']['removeUser']>()
    }
  } as unknown as Auth;
}

function createMockConnectionRepository() {
  return createMockClass<ConnectionRepository>();
}

function createMockS3Storage() {
  return createMockClass<S3Storage>();
}

describe('UserService', () => {
  let userService: UserService;
  let mockAuth: Auth;
  let connectionRepository: ReturnType<typeof createMockConnectionRepository>;
  let s3Storage: ReturnType<typeof createMockS3Storage>;

  beforeEach(() => {
    mockAuth = createMockAuth();
    connectionRepository = createMockConnectionRepository();
    s3Storage = createMockS3Storage();
    userService = new UserService(mockAuth, connectionRepository, s3Storage);
  });

  describe('removeUser', () => {
    it('fetches connections and invalidates S3 cache after deleting user', async () => {
      const connections = [
        { accessKeyId: 'key-1', endpoint: 'https://s3.amazonaws.com' },
        { accessKeyId: 'key-2', endpoint: 'https://minio.local:9000' }
      ];

      connectionRepository.getByOwnerWithCredentials.mockResolvedValue(connections);

      await userService.removeUser('user-1', new Headers());

      expect(connectionRepository.getByOwnerWithCredentials).toHaveBeenCalledWith('user-1');
      expect(s3Storage.invalidateClientCache).toHaveBeenCalledTimes(2);

      expect(s3Storage.invalidateClientCache).toHaveBeenCalledWith({
        accessKeyId: 'key-1',
        endpoint: 'https://s3.amazonaws.com'
      });

      expect(s3Storage.invalidateClientCache).toHaveBeenCalledWith({
        accessKeyId: 'key-2',
        endpoint: 'https://minio.local:9000'
      });
    });

    it('deletes user even when connection fetch fails', async () => {
      connectionRepository.getByOwnerWithCredentials.mockRejectedValue(new Error('DB error'));

      await expect(userService.removeUser('user-1', new Headers())).resolves.not.toThrow();
    });

    it('deletes user when they have no connections', async () => {
      connectionRepository.getByOwnerWithCredentials.mockResolvedValue([]);

      await expect(userService.removeUser('user-1', new Headers())).resolves.not.toThrow();

      expect(s3Storage.invalidateClientCache).not.toHaveBeenCalled();
    });
  });
});
