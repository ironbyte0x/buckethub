import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import type { StartedTestContainer } from 'testcontainers';

function killProcessTree(pid: number): void {
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // process already exited
    }
  }
}

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
  var __BACKEND_PROCESS__: import('child_process').ChildProcess;
  var __FRONTEND_PROCESS__: import('child_process').ChildProcess;
}

// eslint-disable-next-line import/no-default-export
export default async function globalTeardown() {
  if (globalThis.__APP_CONTAINER__) {
    await globalThis.__APP_CONTAINER__.stop();
  }

  if (globalThis.__FRONTEND_PROCESS__?.pid) {
    killProcessTree(globalThis.__FRONTEND_PROCESS__.pid);
  }

  if (globalThis.__BACKEND_PROCESS__?.pid) {
    killProcessTree(globalThis.__BACKEND_PROCESS__.pid);
  }

  if (!globalThis.__APP_CONTAINER__) {
    killByPort(3000);
    killByPort(3001);
  }

  if (globalThis.__S3_MOCK_CONTAINER__) {
    await globalThis.__S3_MOCK_CONTAINER__.stop();
  }

  if (globalThis.__MAILPIT_CONTAINER__) {
    await globalThis.__MAILPIT_CONTAINER__.stop();
  }

  const stateFile = path.resolve(__dirname, '..', '.e2e-state.json');

  if (fs.existsSync(stateFile)) {
    fs.unlinkSync(stateFile);
  }
}
