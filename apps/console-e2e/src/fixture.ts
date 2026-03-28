import fs from 'fs';
import os from 'os';
import path from 'path';
import { test as base } from '@playwright/test';
import { MailpitClient } from './helpers/mailpit';
import { S3MockClient } from './helpers/s3-mock';
import { AcceptInvitationPage, InvitationsPage, SignInPage } from './pages';
import { generateTestEmail, getAdminCredentials, getE2EConfig, TestDatabase } from './utils';

interface TestUser {
  email: string;
  password: string;
  name: string;
}

interface TestConnection {
  id: string;
  label: string;
  endpoint: string;
}

interface TestBucketWithFiles {
  connection: TestConnection;
  bucketName: string;
  bucketId: string;
  files: string[];
}

interface TestFixtures {
  testDatabase: TestDatabase;
  testEmail: string;
  testUser: TestUser;
  mailpit: MailpitClient;
  s3MockEndpoint: string;
  s3Mock: S3MockClient;
  testConnection: TestConnection;
  testBucketWithFiles: TestBucketWithFiles;
  testFilePath: string;
}

/* eslint-disable no-empty-pattern -- Playwright requires object destructuring for fixture args */
export const test = base.extend<TestFixtures>({
  testDatabase: async ({}, use) => {
    const database = new TestDatabase();

    await database.init();
    await use(database);
    await database.deleteCreatedTestBuckets();
    await database.deleteCreatedTestTags();
    database.close();
  },

  testEmail: async ({ testDatabase }, use) => {
    const email = generateTestEmail();

    await use(email);
    await testDatabase.cleanup(email);
  },

  mailpit: async ({}, use) => {
    const config = getE2EConfig();
    const client = new MailpitClient(config.mailpitApiUrl);

    await use(client);
  },

  s3MockEndpoint: async ({}, use) => {
    const config = getE2EConfig();

    await use(config.s3MockEndpoint);
  },

  s3Mock: async ({ s3MockEndpoint }, use) => {
    const client = new S3MockClient(s3MockEndpoint);

    await use(client);
  },

  testConnection: async ({ testDatabase, s3MockEndpoint }, use) => {
    const label = `test-conn-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const { email } = getAdminCredentials();
    const connectionId = await testDatabase.createTestConnection(label, email, s3MockEndpoint);

    await use({
      id: connectionId,
      label,
      endpoint: s3MockEndpoint
    });

    await testDatabase.deleteTestConnection(connectionId);
  },

  testBucketWithFiles: async ({ testDatabase, testConnection, s3Mock }, use) => {
    const bucketName = `test-bucket-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    await s3Mock.createBucket(bucketName);

    const bucketId = await testDatabase.createTestBucket(bucketName, testConnection.id);

    const files = ['test-file-1.txt', 'test-file-2.txt', 'subfolder/nested-file.txt'];

    for (const file of files) {
      await s3Mock.putObject(bucketName, file, `Content of ${file}`);
    }

    await use({
      connection: testConnection,
      bucketName,
      bucketId,
      files
    });

    await s3Mock.deleteAllObjects(bucketName);
  },

  testFilePath: async ({}, use) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-upload-'));
    const filePath = path.join(directory, 'test-upload.txt');

    fs.writeFileSync(filePath, 'Hello from e2e test');

    await use(filePath);

    fs.rmSync(directory, { recursive: true, force: true });
  },

  testUser: async ({ page, testDatabase, mailpit }, use) => {
    const signInPage = new SignInPage(page);
    const invitationsPage = new InvitationsPage(page);
    const acceptPage = new AcceptInvitationPage(page);
    const { email: adminEmail, password: adminPassword } = getAdminCredentials();

    const testUserEmail = generateTestEmail();
    const testUserPassword = 'TestUser123!';
    const testUserName = 'Test User';

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(adminEmail, adminPassword);
    await invitationsPage.goto();
    await invitationsPage.sendInvitation(testUserEmail);
    await invitationsPage.waitForInvitationInList(testUserEmail);

    const token = await mailpit.getInvitationToken(testUserEmail);

    await page.context().clearCookies();
    await acceptPage.goto(token);

    await acceptPage.acceptInvitationAndWaitForRedirect(testUserName, testUserPassword);

    await page.context().clearCookies();

    await use({
      email: testUserEmail,
      password: testUserPassword,
      name: testUserName
    });

    await testDatabase.cleanup(testUserEmail);
  }
});

export { expect } from '@playwright/test';
