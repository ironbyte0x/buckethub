import { createCipheriv, randomBytes } from 'node:crypto';
import { type Client, createClient } from '@libsql/client';
import { getE2EConfig } from './e2e-config';

interface Invitation {
  id: string;
  email: string;
  token: string;
  invited_by_id: string;
  expires_at: number;
  created_at: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: number | null;
  created_at: number;
}

const algorithm = 'aes-256-gcm';
const initializationVectorLength = 12;

function encryptSecret(plainText: string, encodedEncryptionKey: string): string {
  const encryptionKey = Buffer.from(encodedEncryptionKey, 'base64');

  if (encryptionKey.length !== 32) {
    throw new Error('E2E encryption key must be a base64-encoded 32-byte key');
  }

  const initializationVector = randomBytes(initializationVectorLength);
  const cipher = createCipheriv(algorithm, encryptionKey, initializationVector);
  const encryptedPayload = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authenticationTag = cipher.getAuthTag();

  return [
    'v1',
    initializationVector.toString('base64url'),
    authenticationTag.toString('base64url'),
    encryptedPayload.toString('base64url')
  ].join('.');
}

export class TestDatabase {
  private db: Client;
  private createdBuckets: string[] = [];
  private createdTags: string[] = [];

  public constructor() {
    let connectionString: string;

    try {
      connectionString = getE2EConfig().dbPath;
    } catch {
      const environmentConnectionString = process.env['DB_CONNECTION_STRING'];

      if (!environmentConnectionString) {
        throw new Error(
          'Database connection not available. Ensure global-setup ran or set DB_CONNECTION_STRING env var.'
        );
      }

      connectionString = environmentConnectionString;
    }

    this.db = createClient({ url: `file:${connectionString}` });
  }

  public async init(): Promise<void> {
    await this.db.execute('PRAGMA journal_mode = WAL;');
    await this.db.execute('PRAGMA busy_timeout = 5000;');
  }

  public async getInvitationByEmail(email: string): Promise<Invitation | null> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM invitation WHERE email = ? LIMIT 1',
      args: [email]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as unknown as Invitation;
  }

  public async getInvitationToken(email: string): Promise<string | null> {
    const invitation = await this.getInvitationByEmail(email);

    return invitation?.token ?? null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM user WHERE email = ? LIMIT 1',
      args: [email]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as unknown as User;
  }

  public async getUserRole(email: string): Promise<string | null> {
    const user = await this.getUserByEmail(email);

    return user?.role ?? null;
  }

  public async isUserBanned(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);

    return user?.banned === 1;
  }

  public async deleteInvitationByEmail(email: string): Promise<void> {
    await this.db.execute({
      sql: 'DELETE FROM invitation WHERE email = ?',
      args: [email]
    });
  }

  public async deleteUserByEmail(email: string): Promise<void> {
    await this.db.execute({
      sql: 'DELETE FROM user WHERE email = ?',
      args: [email]
    });
  }

  public async cleanup(testEmail: string): Promise<void> {
    await this.deleteInvitationByEmail(testEmail);
    await this.deleteUserByEmail(testEmail);
  }

  public async getUserPermissions(userEmail: string, bucketName: string): Promise<string[]> {
    const result = await this.db.execute({
      sql: `
        SELECT bp.permission
        FROM bucket_permission bp
        INNER JOIN user u ON bp.user_id = u.id
        INNER JOIN bucket b ON bp.bucket_id = b.id
        WHERE u.email = ? AND b.name = ?
      `,
      args: [userEmail, bucketName]
    });

    return result.rows.map((row) => row.permission as string);
  }

  public async setUserPermission(
    userEmail: string,
    bucketName: string,
    permission: string
  ): Promise<void> {
    await this.db.execute({
      sql: `
        INSERT INTO bucket_permission (bucket_id, user_id, permission)
        SELECT b.id, u.id, ?
        FROM bucket b, user u
        WHERE b.name = ? AND u.email = ?
      `,
      args: [permission, bucketName, userEmail]
    });
  }

  public async removeUserPermissions(userEmail: string, bucketName: string): Promise<void> {
    await this.db.execute({
      sql: `
        DELETE FROM bucket_permission
        WHERE user_id = (SELECT id FROM user WHERE email = ?)
        AND bucket_id = (SELECT id FROM bucket WHERE name = ?)
      `,
      args: [userEmail, bucketName]
    });
  }

  public async createTestBucket(name: string, connectionId: string): Promise<string> {
    const id = crypto.randomUUID();

    await this.db.execute({
      sql: 'INSERT INTO bucket (id, connection_id, name) VALUES (?, ?, ?)',
      args: [id, connectionId, name]
    });

    this.createdBuckets.push(name);

    return id;
  }

  public async deleteTestBucket(name: string): Promise<void> {
    await this.db.execute({
      sql: 'DELETE FROM bucket WHERE name = ?',
      args: [name]
    });
  }

  public async deleteCreatedTestBuckets(): Promise<void> {
    for (const name of this.createdBuckets) {
      await this.db.execute({
        sql: 'DELETE FROM bucket_tag WHERE bucket_id = (SELECT id FROM bucket WHERE name = ?)',
        args: [name]
      });

      await this.db.execute({
        sql: 'DELETE FROM bucket_permission WHERE bucket_id = (SELECT id FROM bucket WHERE name = ?)',
        args: [name]
      });

      await this.db.execute({
        sql: 'DELETE FROM bucket WHERE name = ?',
        args: [name]
      });
    }

    this.createdBuckets = [];
  }

  public async getFirstConnectionId(): Promise<string | null> {
    const adminResult = await this.db.execute({
      sql: 'SELECT id FROM user WHERE role = ? LIMIT 1',
      args: ['admin']
    });

    if (adminResult.rows.length === 0) {
      return null;
    }

    const adminId = adminResult.rows[0].id as string;

    const connectionResult = await this.db.execute({
      sql: 'SELECT id, created_by FROM connection LIMIT 1',
      args: []
    });

    if (connectionResult.rows.length === 0) {
      return null;
    }

    const connectionId = connectionResult.rows[0].id as string;
    const createdBy = connectionResult.rows[0].created_by as string | null;

    if (!createdBy) {
      await this.db.execute({
        sql: 'UPDATE connection SET created_by = ? WHERE id = ?',
        args: [adminId, connectionId]
      });
    }

    return connectionId;
  }

  public async createTestConnection(
    label: string,
    createdByEmail: string,
    endpoint?: string
  ): Promise<string> {
    const id = crypto.randomUUID();
    const user = await this.getUserByEmail(createdByEmail);

    if (!user) {
      throw new Error(`User with email ${createdByEmail} not found`);
    }

    const config = getE2EConfig();
    const encryptedAccessKey = encryptSecret('test-key', config.encryptionKey);
    const encryptedSecretKey = encryptSecret('test-secret', config.encryptionKey);

    await this.db.execute({
      sql: `INSERT INTO connection (id, provider_type, label, endpoint, access_key_id, secret_access_key, created_by)
            VALUES (?, 'minio', ?, ?, ?, ?, ?)`,
      args: [
        id,
        label,
        endpoint ?? config.s3MockEndpoint,
        encryptedAccessKey,
        encryptedSecretKey,
        user.id
      ]
    });

    return id;
  }

  public async deleteTestConnection(connectionId: string): Promise<void> {
    await this.db.execute({
      sql: 'DELETE FROM connection_tag WHERE connection_id = ?',
      args: [connectionId]
    });

    await this.db.execute({
      sql: 'DELETE FROM bucket_tag WHERE bucket_id IN (SELECT id FROM bucket WHERE connection_id = ?)',
      args: [connectionId]
    });

    await this.db.execute({
      sql: 'DELETE FROM bucket_permission WHERE bucket_id IN (SELECT id FROM bucket WHERE connection_id = ?)',
      args: [connectionId]
    });

    await this.db.execute({
      sql: 'DELETE FROM bucket WHERE connection_id = ?',
      args: [connectionId]
    });

    await this.db.execute({
      sql: 'DELETE FROM connection WHERE id = ?',
      args: [connectionId]
    });
  }

  public async getConnectionsByUserEmail(email: string): Promise<string[]> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      return [];
    }

    const result = await this.db.execute({
      sql: 'SELECT label FROM connection WHERE created_by = ?',
      args: [user.id]
    });

    return result.rows.map((row) => row.label as string);
  }

  public async getConnectionByLabel(
    label: string
  ): Promise<{ id: string; label: string; endpoint: string } | null> {
    const result = await this.db.execute({
      sql: 'SELECT id, label, endpoint FROM connection WHERE label = ? LIMIT 1',
      args: [label]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as unknown as { id: string; label: string; endpoint: string };
  }

  public async deleteTestConnectionByLabel(label: string): Promise<void> {
    const connection = await this.getConnectionByLabel(label);

    if (connection) {
      await this.deleteTestConnection(connection.id);
    }
  }

  public async createTestTag(name: string): Promise<string> {
    const id = crypto.randomUUID();

    await this.db.execute({
      sql: 'INSERT INTO tag (id, name) VALUES (?, ?)',
      args: [id, name]
    });

    this.createdTags.push(name);

    return id;
  }

  public async deleteTestTag(name: string): Promise<void> {
    await this.db.execute({
      sql: 'DELETE FROM bucket_tag WHERE tag_id = (SELECT id FROM tag WHERE name = ?)',
      args: [name]
    });

    await this.db.execute({
      sql: 'DELETE FROM connection_tag WHERE tag_id = (SELECT id FROM tag WHERE name = ?)',
      args: [name]
    });

    await this.db.execute({
      sql: 'DELETE FROM tag WHERE name = ?',
      args: [name]
    });
  }

  public async deleteCreatedTestTags(): Promise<void> {
    for (const name of this.createdTags) {
      await this.deleteTestTag(name);
    }

    this.createdTags = [];
  }

  public async getTagByName(name: string): Promise<{ id: string; name: string } | null> {
    const result = await this.db.execute({
      sql: 'SELECT id, name FROM tag WHERE name = ? LIMIT 1',
      args: [name]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as unknown as { id: string; name: string };
  }

  public async assignTagToBucket(tagName: string, bucketName: string): Promise<void> {
    const id = crypto.randomUUID();

    await this.db.execute({
      sql: `INSERT INTO bucket_tag (id, bucket_id, tag_id)
            SELECT ?, b.id, t.id
            FROM bucket b, tag t
            WHERE b.name = ? AND t.name = ?`,
      args: [id, bucketName, tagName]
    });
  }

  public async assignTagToConnection(tagName: string, connectionLabel: string): Promise<void> {
    const id = crypto.randomUUID();

    await this.db.execute({
      sql: `INSERT INTO connection_tag (id, connection_id, tag_id)
            SELECT ?, c.id, t.id
            FROM connection c, tag t
            WHERE c.label = ? AND t.name = ?`,
      args: [id, connectionLabel, tagName]
    });
  }

  public async getBucketByName(
    name: string
  ): Promise<{ id: string; name: string; connectionId: string } | null> {
    const result = await this.db.execute({
      sql: 'SELECT id, name, connection_id as connectionId FROM bucket WHERE name = ? LIMIT 1',
      args: [name]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as unknown as { id: string; name: string; connectionId: string };
  }

  public close(): void {
    this.db.close();
  }
}
