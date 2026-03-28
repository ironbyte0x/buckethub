import { beforeEach, describe, expect, it } from 'vitest';
import { ProviderType, UserRole } from '@buckethub/core';
import {
  BucketId,
  BucketTagMappingId,
  ConnectionId,
  ConnectionTagMappingId,
  TagId
} from '@buckethub/rpc-contract';
import { createMockClass } from '@buckethub/test';
import { ConnectionRepository } from '../connections';
import { PermissionService } from '../permissions';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

function createMockTagRepository() {
  return createMockClass<TagRepository>();
}

function createMockConnectionRepository() {
  return createMockClass<ConnectionRepository>();
}

function createMockPermissionService() {
  return createMockClass<PermissionService>();
}

describe('TagService', () => {
  let tagService: TagService;
  let tagRepository: ReturnType<typeof createMockTagRepository>;
  let connectionRepository: ReturnType<typeof createMockConnectionRepository>;
  let permissionService: ReturnType<typeof createMockPermissionService>;

  beforeEach(() => {
    tagRepository = createMockTagRepository();
    connectionRepository = createMockConnectionRepository();
    permissionService = createMockPermissionService();

    tagService = new TagService(tagRepository, connectionRepository, permissionService);
  });

  describe('getTagsForBuckets', () => {
    it('admin gets all bucket tags', async () => {
      const tags = [
        {
          id: 'mapping-1' as BucketTagMappingId,
          bucketId: 'b1' as BucketId,
          tagId: 'tag-1' as TagId
        }
      ];

      tagRepository.getTagsForBuckets.mockResolvedValue(tags);

      const result = await tagService.getTagsForBuckets('user-1', UserRole.Admin);

      expect(result).toEqual(tags);
      expect(tagRepository.getTagsForBuckets).toHaveBeenCalledOnce();
      expect(permissionService.getByUser).not.toHaveBeenCalled();
    });

    it('non-admin gets tags filtered by permitted bucket IDs', async () => {
      const tags = [
        {
          id: 'mapping-1' as BucketTagMappingId,
          bucketId: 'b1' as BucketId,
          tagId: 'tag-1' as TagId
        }
      ];

      permissionService.getByUser.mockResolvedValue([
        {
          userId: 'user-1',
          userName: 'User',
          userEmail: 'user@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'b1',
          permissions: []
        },
        {
          userId: 'user-1',
          userName: 'User',
          userEmail: 'user@test.com',
          bucketId: 'b2' as BucketId,
          bucketName: 'b2',
          permissions: []
        },
        {
          userId: 'user-1',
          userName: 'User',
          userEmail: 'user@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'b1',
          permissions: []
        }
      ]);

      tagRepository.getTagsForBucketsByBucketIds.mockResolvedValue(tags);

      const result = await tagService.getTagsForBuckets('user-1', UserRole.User);

      expect(result).toEqual(tags);

      expect(tagRepository.getTagsForBucketsByBucketIds).toHaveBeenCalledWith(
        expect.arrayContaining(['b1', 'b2'])
      );

      const callArgument = tagRepository.getTagsForBucketsByBucketIds.mock.calls[0][0];

      expect(callArgument).toHaveLength(2);
    });
  });

  describe('getTagsForConnections', () => {
    it('admin gets tags for connections', async () => {
      const connections = [
        {
          id: 'c1' as ConnectionId,
          providerType: ProviderType.AmazonS3,
          label: '',
          endpoint: '',
          createdBy: 'user-1'
        },
        {
          id: 'c2' as ConnectionId,
          providerType: ProviderType.AmazonS3,
          label: '',
          endpoint: '',
          createdBy: 'user-1'
        }
      ];
      const tags = [
        {
          id: 'ctag-1' as ConnectionTagMappingId,
          connectionId: 'c1' as ConnectionId,
          tagId: 'tag-1' as TagId
        }
      ];

      connectionRepository.getAllForUser.mockResolvedValue(connections);
      tagRepository.getTagsForConnectionsByConnectionIds.mockResolvedValue(tags);

      const result = await tagService.getTagsForConnections('user-1', UserRole.Admin);

      expect(result).toEqual(tags);
      expect(connectionRepository.getAllForUser).toHaveBeenCalledWith('user-1', UserRole.Admin);
      expect(tagRepository.getTagsForConnectionsByConnectionIds).toHaveBeenCalledWith(['c1', 'c2']);
    });

    it('non-admin gets tags for accessible connections', async () => {
      const connections = [
        {
          id: 'c1' as ConnectionId,
          providerType: ProviderType.AmazonS3,
          label: '',
          endpoint: '',
          createdBy: 'user-1'
        },
        {
          id: 'c3' as ConnectionId,
          providerType: ProviderType.AmazonS3,
          label: '',
          endpoint: '',
          createdBy: 'user-1'
        }
      ];
      const tags = [
        {
          id: 'ctag-1' as ConnectionTagMappingId,
          connectionId: 'c1' as ConnectionId,
          tagId: 'tag-1' as TagId
        }
      ];

      connectionRepository.getAllForUser.mockResolvedValue(connections);
      tagRepository.getTagsForConnectionsByConnectionIds.mockResolvedValue(tags);

      const result = await tagService.getTagsForConnections('user-1', UserRole.User);

      expect(result).toEqual(tags);
      expect(connectionRepository.getAllForUser).toHaveBeenCalledWith('user-1', UserRole.User);
      expect(tagRepository.getTagsForConnectionsByConnectionIds).toHaveBeenCalledWith(['c1', 'c3']);
    });
  });
});
