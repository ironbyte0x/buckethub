import { UserRole } from '@buckethub/core';
import {
  BucketTagMapping,
  ConnectionTagMapping,
  DeleteTagRequest,
  RemoveTagFromBucketRequest,
  RemoveTagFromConnectionRequest,
  Tag
} from '@buckethub/rpc-contract';
import { ConnectionRepository } from '../connections';
import { PermissionService } from '../permissions';
import { TagRepository } from './tag.repository';

export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly connectionRepository: ConnectionRepository,
    private readonly permissionService: PermissionService
  ) {}

  public async getAll() {
    return this.tagRepository.getAll();
  }

  public async create(data: Tag) {
    return this.tagRepository.create(data);
  }

  public async delete({ id }: DeleteTagRequest) {
    return this.tagRepository.delete(id);
  }

  public async getTagsForBuckets(userId: string, role: UserRole) {
    if (role === UserRole.Admin) {
      return this.tagRepository.getTagsForBuckets();
    }

    const permissions = await this.permissionService.getByUser(userId);
    const bucketIds = [...new Set(permissions.map((permission) => permission.bucketId))];

    return this.tagRepository.getTagsForBucketsByBucketIds(bucketIds);
  }

  public async addTagToBucket(data: BucketTagMapping) {
    return this.tagRepository.addTagToBucket(data);
  }

  public async getBucketTagMapping(id: RemoveTagFromBucketRequest['id']) {
    return this.tagRepository.getBucketTagMapping(id);
  }

  public async removeTagFromBucket({ id }: RemoveTagFromBucketRequest) {
    return this.tagRepository.removeTagFromBucket(id);
  }

  public async getTagsForConnections(userId: string, role: UserRole) {
    const connections = await this.connectionRepository.getAllForUser(userId, role);

    return this.tagRepository.getTagsForConnectionsByConnectionIds(
      connections.map((connection) => connection.id)
    );
  }

  public async addTagToConnection(data: ConnectionTagMapping) {
    return this.tagRepository.addTagToConnection(data);
  }

  public async getConnectionTagMapping(id: RemoveTagFromConnectionRequest['id']) {
    return this.tagRepository.getConnectionTagMapping(id);
  }

  public async removeTagFromConnection({ id }: RemoveTagFromConnectionRequest) {
    return this.tagRepository.removeTagFromConnection(id);
  }
}
