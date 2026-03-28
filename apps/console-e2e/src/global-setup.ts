import { randomBytes } from 'node:crypto';
import { type ChildProcess, execSync, spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';

const BACKEND_PORT = 3000;
const FRONTEND_PORT = 3001;
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'AdminPassword123!';
const ADMIN_NAME = 'Admin';

function killByPort(port: number): void {
  try {
    const pids = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();

    if (pids) {
      execSync(`kill -9 ${pids}`, { stdio: 'ignore' });
    }
  } catch {
    // no process on port
  }
}

declare global {
  var __S3_MOCK_CONTAINER__: StartedTestContainer;
  var __MAILPIT_CONTAINER__: StartedTestContainer;
  var __APP_CONTAINER__: StartedTestContainer;
  var __BACKEND_PROCESS__: ChildProcess;
  var __FRONTEND_PROCESS__: ChildProcess;
}

async function waitForReady(url: string, timeout = 120000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await fetch(url);

      return;
    } catch {
      // not ready yet
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${url} to be ready`);
}

// eslint-disable-next-line import/no-default-export
export default async function globalSetup() {
  if (isDockerMode()) {
    await setupDockerMode();
  } else {
    await setupDevelopmentMode();
  }
}

function isDockerMode(): boolean {
  return process.env['E2E_MODE'] === 'docker';
}

async function setupDockerMode(): Promise<void> {
  const workspaceRoot = path.resolve(__dirname, '..', '..', '..');
  const endToEndDirectory = path.resolve(workspaceRoot, 'apps', 'console-e2e');

  killByPort(BACKEND_PORT);

  const prebuiltImage = process.env['E2E_DOCKER_IMAGE'];

  let appContainer: GenericContainer;

  if (prebuiltImage) {
    console.log(`[docker] Using pre-built Docker image: ${prebuiltImage}`);
    appContainer = new GenericContainer(prebuiltImage);
  } else {
    console.log('[docker] Building production Docker image...');

    appContainer = await GenericContainer.fromDockerfile(workspaceRoot).build('buckethub:e2e', {
      deleteOnExit: false
    });

    console.log('[docker] Docker image built successfully');
  }

  console.log('[docker] Starting containers...');

  const s3MockContainer = await new GenericContainer('adobe/s3mock')
    .withExposedPorts(9090)
    .withEnvironment({ initialBuckets: 'test-bucket-1,test-bucket-2' })
    .start();

  const s3MockPort = s3MockContainer.getMappedPort(9090);
  const s3MockHost = s3MockContainer.getHost();
  const s3MockEndpoint = `http://${s3MockHost}:${s3MockPort}`;

  const mailpitContainer = await new GenericContainer('axllent/mailpit')
    .withExposedPorts(1025, 8025)
    .start();

  const mailpitHost = mailpitContainer.getHost();
  const mailpitSmtpPort = mailpitContainer.getMappedPort(1025);
  const mailpitApiPort = mailpitContainer.getMappedPort(8025);
  const mailpitApiUrl = `http://${mailpitHost}:${mailpitApiPort}`;

  const databaseDirectory = path.resolve(os.tmpdir(), `buckethub-e2e-${Date.now()}`);

  fs.mkdirSync(databaseDirectory, { recursive: true });

  const databaseFileName = 'db.db';
  const databaseHostPath = path.resolve(databaseDirectory, databaseFileName);

  const encryptionKey = randomBytes(32).toString('base64');

  const appBaseUrl = `http://localhost:${BACKEND_PORT}`;

  const startedAppContainer = await appContainer
    .withNetworkMode('host')
    .withUser(`${String(process.getuid?.())}:${String(process.getgid?.())}`)
    .withBindMounts([{ source: databaseDirectory, target: '/app/data', mode: 'rw' }])
    .withEnvironment({
      DB_CONNECTION_STRING: `data/${databaseFileName}`,
      SECRET_ENCRYPTION_KEY: encryptionKey,
      AUTH_SECRET: 'e2e-test-auth-secret-that-is-at-least-32-characters-long',
      BASE_URL: appBaseUrl,
      PORT: String(BACKEND_PORT),
      SMTP_HOST: mailpitHost,
      SMTP_PORT: String(mailpitSmtpPort),
      SMTP_USER: 'test',
      SMTP_PASS: 'test',
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_NAME,
      AUTH_RATE_LIMIT: '1000',
      RPC_RATE_LIMIT: '1000'
    })
    .withWaitStrategy(Wait.forHealthCheck())
    .withStartupTimeout(120_000)
    .start();

  console.log(`[docker] App container ready at ${appBaseUrl}`);

  process.env['BASE_URL'] = appBaseUrl;

  const state = {
    s3MockEndpoint,
    mailpitApiUrl,
    dbPath: databaseHostPath,
    adminEmail: ADMIN_EMAIL,
    adminPassword: ADMIN_PASSWORD,
    encryptionKey
  };

  fs.writeFileSync(
    path.resolve(endToEndDirectory, '.e2e-state.json'),
    JSON.stringify(state, null, 2)
  );

  globalThis.__S3_MOCK_CONTAINER__ = s3MockContainer;
  globalThis.__MAILPIT_CONTAINER__ = mailpitContainer;
  globalThis.__APP_CONTAINER__ = startedAppContainer;
}

async function setupDevelopmentMode(): Promise<void> {
  const workspaceRoot = path.resolve(__dirname, '..', '..', '..');
  const backendDirectory = path.resolve(workspaceRoot, 'apps', 'backend');
  const consoleDirectory = path.resolve(workspaceRoot, 'apps', 'console');
  const endToEndDirectory = path.resolve(workspaceRoot, 'apps', 'console-e2e');

  killByPort(BACKEND_PORT);
  killByPort(FRONTEND_PORT);

  const s3MockContainer = await new GenericContainer('adobe/s3mock')
    .withExposedPorts(9090)
    .withEnvironment({ initialBuckets: 'test-bucket-1,test-bucket-2' })
    .start();

  const s3MockPort = s3MockContainer.getMappedPort(9090);
  const s3MockHost = s3MockContainer.getHost();
  const s3MockEndpoint = `http://${s3MockHost}:${s3MockPort}`;

  const mailpitContainer = await new GenericContainer('axllent/mailpit')
    .withExposedPorts(1025, 8025)
    .start();

  const mailpitHost = mailpitContainer.getHost();
  const smtpPort = mailpitContainer.getMappedPort(1025);
  const mailpitApiPort = mailpitContainer.getMappedPort(8025);
  const mailpitApiUrl = `http://${mailpitHost}:${mailpitApiPort}`;

  const databaseDirectory = path.resolve(backendDirectory, 'data', 'e2e-test');

  if (fs.existsSync(databaseDirectory)) {
    fs.rmSync(databaseDirectory, { recursive: true });
  }

  fs.mkdirSync(databaseDirectory, { recursive: true });

  const databasePath = path.resolve(databaseDirectory, 'db.db');

  const encryptionKey = randomBytes(32).toString('base64');

  const backendProcess = spawn('bun', ['nx', 'serve', 'backend'], {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      DB_CONNECTION_STRING: databasePath,
      SECRET_ENCRYPTION_KEY: encryptionKey,
      AUTH_SECRET: 'e2e-test-auth-secret-that-is-at-least-32-characters-long',
      BASE_URL: `http://localhost:${BACKEND_PORT}`,
      PORT: String(BACKEND_PORT),
      SMTP_HOST: mailpitHost,
      SMTP_PORT: String(smtpPort),
      SMTP_USER: 'test',
      SMTP_PASS: 'test',
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_NAME,
      AUTH_RATE_LIMIT: '1000',
      RPC_RATE_LIMIT: '1000'
    },
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: true
  });

  backendProcess.stdout?.on('data', (data: Buffer) => {
    process.stdout.write(`[backend] ${data}`);
  });

  backendProcess.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(`[backend] ${data}`);
  });

  await waitForReady(`http://localhost:${BACKEND_PORT}/api/auth/session`);

  const frontendProcess = spawn('bunx', ['vite', '--port', String(FRONTEND_PORT), '--strictPort'], {
    cwd: consoleDirectory,
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: true
  });

  frontendProcess.stdout?.on('data', (data: Buffer) => {
    process.stdout.write(`[frontend] ${data}`);
  });

  frontendProcess.stderr?.on('data', (data: Buffer) => {
    process.stderr.write(`[frontend] ${data}`);
  });

  await waitForReady(`http://localhost:${FRONTEND_PORT}`);

  const state = {
    s3MockEndpoint,
    mailpitApiUrl,
    dbPath: databasePath,
    adminEmail: ADMIN_EMAIL,
    adminPassword: ADMIN_PASSWORD,
    encryptionKey
  };

  fs.writeFileSync(
    path.resolve(endToEndDirectory, '.e2e-state.json'),
    JSON.stringify(state, null, 2)
  );

  globalThis.__S3_MOCK_CONTAINER__ = s3MockContainer;
  globalThis.__MAILPIT_CONTAINER__ = mailpitContainer;
  globalThis.__BACKEND_PROCESS__ = backendProcess;
  globalThis.__FRONTEND_PROCESS__ = frontendProcess;
}
