/* eslint-disable unicorn/prevent-abbreviations */
import fs from 'fs';
import path from 'path';

interface E2EConfig {
  s3MockEndpoint: string;
  mailpitApiUrl: string;
  dbPath: string;
  adminEmail: string;
  adminPassword: string;
  encryptionKey: string;
}

let cachedConfig: E2EConfig | null = null;

export function getE2EConfig(): E2EConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const statePath = path.resolve(__dirname, '..', '..', '.e2e-state.json');

  if (!fs.existsSync(statePath)) {
    throw new Error(
      `.e2e-state.json not found at ${statePath}. Did global-setup run successfully?`
    );
  }

  cachedConfig = JSON.parse(fs.readFileSync(statePath, 'utf-8')) as E2EConfig;

  return cachedConfig;
}
