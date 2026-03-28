import { expect, test } from './fixture';
import { AddBucketPage, ConnectionsPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Connection Management', () => {
  test('admin can create a new connection via add bucket flow', async ({
    page,
    testDatabase,
    s3MockEndpoint
  }) => {
    const signInPage = new SignInPage(page);
    const addBucketPage = new AddBucketPage(page);
    const connectionsPage = new ConnectionsPage(page);
    const { email, password } = getAdminCredentials();

    const connectionLabel = `test-conn-create-${Date.now()}`;

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await addBucketPage.openDialog();
    await addBucketPage.selectNewConnection();

    await addBucketPage.fillConnection({
      label: connectionLabel,
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      endpoint: s3MockEndpoint
    });

    await addBucketPage.waitForBucketList();

    const firstCheckbox = page.getByRole('checkbox').first();

    await firstCheckbox.click();
    await addBucketPage.clickAdd();

    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible({ timeout: 15000 });

    await connectionsPage.goto();
    await page.waitForURL('/connections');

    await expect(page.getByText(connectionLabel)).toBeVisible();

    const connection = await testDatabase.getConnectionByLabel(connectionLabel);

    expect(connection).not.toBeNull();

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (connection) {
      await testDatabase.deleteTestConnection(connection.id);
    }
  });

  test('admin can edit a connection label', async ({ page, testDatabase, testConnection }) => {
    const signInPage = new SignInPage(page);
    const connectionsPage = new ConnectionsPage(page);
    const { email, password } = getAdminCredentials();

    const bucketName = `test-bucket-edit-${Date.now()}`;

    await testDatabase.createTestBucket(bucketName, testConnection.id);

    const newLabel = `edited-conn-${Date.now()}`;

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await connectionsPage.goto();
    await page.waitForURL('/connections');

    await expect(page.getByText(testConnection.label)).toBeVisible();

    const updateResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/rpc/connections/update')
    );

    await connectionsPage.editConnectionLabel(testConnection.label, newLabel);

    await updateResponsePromise;

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(1000);

    await expect(page.getByText(newLabel)).toBeVisible();

    const updatedConnection = await testDatabase.getConnectionByLabel(newLabel);

    expect(updatedConnection).not.toBeNull();
    expect(updatedConnection?.label).toBe(newLabel);
  });

  test('admin can delete a connection', async ({ page, testDatabase, testConnection }) => {
    const signInPage = new SignInPage(page);
    const connectionsPage = new ConnectionsPage(page);
    const { email, password } = getAdminCredentials();

    const bucketName = `test-bucket-delete-${Date.now()}`;

    await testDatabase.createTestBucket(bucketName, testConnection.id);

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await connectionsPage.goto();
    await page.waitForURL('/connections');

    await expect(page.getByText(testConnection.label)).toBeVisible();

    await connectionsPage.deleteConnection(testConnection.label);

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(1000);

    await expect(page.getByText(testConnection.label)).toBeHidden();

    const deletedConnection = await testDatabase.getConnectionByLabel(testConnection.label);

    expect(deletedConnection).toBeNull();
  });

  test('connection with invalid endpoint shows error in add bucket flow', async ({
    page,
    testDatabase
  }) => {
    const signInPage = new SignInPage(page);
    const addBucketPage = new AddBucketPage(page);
    const { email, password } = getAdminCredentials();

    const connectionLabel = `test-invalid-endpoint-${Date.now()}`;

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await addBucketPage.openDialog();
    await addBucketPage.selectNewConnection();

    await addBucketPage.fillConnection({
      label: connectionLabel,
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      endpoint: 'http://localhost:1'
    });

    const errorAlert = page.getByRole('alert');

    await expect(errorAlert).toBeVisible({ timeout: 30000 });

    await testDatabase.deleteTestConnectionByLabel(connectionLabel);
  });

  test('connection appears in sidebar management section', async ({ page }) => {
    const signInPage = new SignInPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    const connectionsLink = page.getByRole('link', { name: 'Connections' });

    await expect(connectionsLink).toBeVisible();
  });

  test('non-admin user can see their own connections', async ({ page, testUser, testDatabase }) => {
    const signInPage = new SignInPage(page);
    const connectionsPage = new ConnectionsPage(page);

    const userConnectionLabel = `user-conn-${Date.now()}`;
    const userConnectionId = await testDatabase.createTestConnection(
      userConnectionLabel,
      testUser.email
    );

    try {
      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await connectionsPage.goto();
      await page.waitForURL('/connections');

      await expect(page.getByText(userConnectionLabel)).toBeVisible();
    } finally {
      await testDatabase.deleteTestConnection(userConnectionId);
    }
  });
});
