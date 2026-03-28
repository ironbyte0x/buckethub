import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { customType } from 'drizzle-orm/sqlite-core';
import { environment } from '../../environment';

const algorithm = 'aes-256-gcm';
const initializationVectorLength = 12;
const encryptionKey = parseEncryptionKey(environment.SECRET_ENCRYPTION_KEY);

function parseEncryptionKey(encodedKey: string): Buffer {
  const decodedKey = Buffer.from(encodedKey, 'base64');

  if (decodedKey.length !== 32) {
    throw new Error('SECRET_ENCRYPTION_KEY must be a base64-encoded 32-byte key');
  }

  return decodedKey;
}

function encryptString(plainText: string): string {
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

function decryptString(serializedCipherText: string): string {
  const parts = serializedCipherText.split('.');

  if (parts.length !== 4 || parts[0] !== 'v1') {
    throw new Error('Invalid encrypted value format');
  }

  const initializationVector = Buffer.from(parts[1], 'base64url');
  const authenticationTag = Buffer.from(parts[2], 'base64url');
  const encryptedPayload = Buffer.from(parts[3], 'base64url');
  const decipher = createDecipheriv(algorithm, encryptionKey, initializationVector);

  decipher.setAuthTag(authenticationTag);

  return Buffer.concat([decipher.update(encryptedPayload), decipher.final()]).toString('utf8');
}

export const secret = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'text';
  },
  toDriver(value: string): string {
    return encryptString(value);
  },
  fromDriver(value: string): string {
    return decryptString(value);
  }
});
