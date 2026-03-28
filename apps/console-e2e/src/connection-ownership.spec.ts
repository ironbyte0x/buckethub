import { expect, test } from './fixture';
import { SignInPage } from './pages';
import { getAdminCredentials } from './utils';

const CONNECTIONS_URL = '/connections';

test.describe('Connection Ownership', () => {
  test.describe('Non-admin User Connections', () => {
    test('non-admin user can only see their own connections', async ({
      page,
      testUser,
      testDatabase
    }) => {
      const signInPage = new SignInPage(page);
      const { email: adminEmail } = getAdminCredentials();

      const userConnectionLabel = `user-connection-${Date.now()}`;
      const adminConnectionLabel = `admin-connection-${Date.now()}`;

      const userConnectionId = await testDatabase.createTestConnection(
        userConnectionLabel,
        testUser.email
      );
      const adminConnectionId = await testDatabase.createTestConnection(
        adminConnectionLabel,
        adminEmail
      );

      try {
        await signInPage.goto();

        await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

        await page.goto(CONNECTIONS_URL);
        await page.waitForURL(CONNECTIONS_URL);

        await expect(page.getByText(userConnectionLabel)).toBeVisible();
        await expect(page.getByText(adminConnectionLabel)).toBeHidden();
      } finally {
        await testDatabase.deleteTestConnection(userConnectionId);
        await testDatabase.deleteTestConnection(adminConnectionId);
      }
    });
  });

  test.describe('Admin Connections', () => {
    test('admin can see all admin-created connections', async ({ page, testDatabase }) => {
      const signInPage = new SignInPage(page);
      const { email: adminEmail, password: adminPassword } = getAdminCredentials();

      const adminConnectionLabel = `admin-connection-${Date.now()}`;
      const adminConnectionId = await testDatabase.createTestConnection(
        adminConnectionLabel,
        adminEmail
      );

      try {
        await signInPage.goto();
        await signInPage.signInAndWaitForNavigation(adminEmail, adminPassword);

        await page.goto(CONNECTIONS_URL);
        await page.waitForURL(CONNECTIONS_URL);

        await expect(page.getByText(adminConnectionLabel)).toBeVisible();
      } finally {
        await testDatabase.deleteTestConnection(adminConnectionId);
      }
    });

    test('admin cannot see non-admin user connections', async ({
      page,
      testUser,
      testDatabase
    }) => {
      const signInPage = new SignInPage(page);
      const { email: adminEmail, password: adminPassword } = getAdminCredentials();

      const userConnectionLabel = `user-connection-${Date.now()}`;
      const userConnectionId = await testDatabase.createTestConnection(
        userConnectionLabel,
        testUser.email
      );

      try {
        await signInPage.goto();
        await signInPage.signInAndWaitForNavigation(adminEmail, adminPassword);

        await page.goto(CONNECTIONS_URL);
        await page.waitForURL(CONNECTIONS_URL);

        await expect(
          page.getByText('No connections yet').or(page.getByTestId('connections-list'))
        ).toBeVisible();

        await expect(page.getByText(userConnectionLabel)).toBeHidden();
      } finally {
        await testDatabase.deleteTestConnection(userConnectionId);
      }
    });
  });

  test.describe('Connection Isolation Between Non-admin Users', () => {
    test('non-admin users cannot see each other connections', async ({
      page,
      testUser,
      testDatabase
    }) => {
      const signInPage = new SignInPage(page);
      const { email: adminEmail, password: adminPassword } = getAdminCredentials();

      const userConnectionLabel = `user-connection-${Date.now()}`;
      const userConnectionId = await testDatabase.createTestConnection(
        userConnectionLabel,
        testUser.email
      );

      try {
        await signInPage.goto();

        await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

        await page.goto(CONNECTIONS_URL);
        await page.waitForURL(CONNECTIONS_URL);

        await expect(page.getByText(userConnectionLabel)).toBeVisible();

        await page.context().clearCookies();

        await signInPage.goto();
        await signInPage.signInAndWaitForNavigation(adminEmail, adminPassword);

        await page.goto(CONNECTIONS_URL);
        await page.waitForURL(CONNECTIONS_URL);

        await expect(
          page.getByText('No connections yet').or(page.getByTestId('connections-list'))
        ).toBeVisible();

        await expect(page.getByText(userConnectionLabel)).toBeHidden();
      } finally {
        await testDatabase.deleteTestConnection(userConnectionId);
      }
    });
  });
});
