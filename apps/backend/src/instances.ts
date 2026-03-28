import { createAuth } from './auth';
import { environment } from './environment';
import {
  BucketGuard,
  BucketRepository,
  BucketService,
  createBucketRPCHandlers
} from './features/buckets';
import {
  ConnectionGuard,
  ConnectionRepository,
  ConnectionService,
  createConnectionRPCHandlers
} from './features/connections';
import {
  createInvitationRPCHandlers,
  InvitationRepository,
  InvitationService
} from './features/invitations';
import { createObjectRPCHandlers, ObjectService } from './features/objects';
import {
  createPermissionRPCHandlers,
  PermissionRepository,
  PermissionService
} from './features/permissions';
import { createProfileRPCHandlers, ProfileRepository, ProfileService } from './features/profile';
import { createTagRPCHandlers, TagRepository, TagService } from './features/tags';
import { createUserRPCHandlers, UserRepository, UserService } from './features/users';
import { EmailService, LoggerEmailService, Mailer, SMTPEmailService } from './shared/email';
import { S3Storage } from './shared/storage';

function createEmailService(): EmailService {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = environment;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return new SMTPEmailService({
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      pass: SMTP_PASS,
      from: SMTP_FROM
    });
  }

  return new LoggerEmailService();
}

const emailService = createEmailService();
const mailer = new Mailer(emailService);

export const auth = createAuth(mailer);

const bucketRepository = new BucketRepository();
const s3Storage = new S3Storage();
const connectionRepository = new ConnectionRepository();
const connectionService = new ConnectionService(s3Storage, connectionRepository);
const permissionRepository = new PermissionRepository();
const permissionService = new PermissionService(permissionRepository);
const bucketService = new BucketService(
  bucketRepository,
  connectionRepository,
  s3Storage,
  permissionService
);
const objectService = new ObjectService(bucketRepository, s3Storage);
const tagRepository = new TagRepository();
const tagService = new TagService(tagRepository, connectionRepository, permissionService);

export const invitationRepository = new InvitationRepository();

const userRepository = new UserRepository();
const invitationService = new InvitationService(auth, userRepository, invitationRepository, mailer);
const userService = new UserService(auth, connectionRepository, s3Storage);
const profileRepository = new ProfileRepository();
const profileService = new ProfileService(auth, profileRepository, userRepository);
const bucketGuard = new BucketGuard(permissionService);
const connectionGuard = new ConnectionGuard(connectionRepository);

export const bucketsRPC = createBucketRPCHandlers(bucketService, bucketGuard, connectionGuard);
export const connectionsRPC = createConnectionRPCHandlers(connectionService, connectionGuard);
export const objectsRPC = createObjectRPCHandlers(objectService, bucketGuard);
export const tagsRPC = createTagRPCHandlers(tagService, bucketGuard, connectionGuard);
export const invitationsRPC = createInvitationRPCHandlers(invitationService);
export const usersRPC = createUserRPCHandlers(userService);
export const permissionsRPC = createPermissionRPCHandlers(permissionService);
export const profileRPC = createProfileRPCHandlers(profileService);
