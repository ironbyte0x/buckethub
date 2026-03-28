import { expect, test } from './fixture';
import { AddBucketPage, ConnectionsPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Bucket Management', () => {
  test('admin can add a bucket to existing connection', async ({ page, testConnection }) => {
    const signInPage = new SignInPage(page);
    const addBucketPage = new AddBucketPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await addBucketPage.openDialog();

    const dialog = page.getByLabel('Add New Bucket');

    await dialog.getByText('Use existing connection').click();
    await dialog.getByRole('button', { name: 'Next' }).click();

    await dialog.getByText(testConnection.label).click();
    await dialog.getByRole('button', { name: 'Next' }).click();

    await addBucketPage.waitForBucketList();

    const firstCheckbox = page.getByRole('checkbox').first();

    await firstCheckbox.click();
    await addBucketPage.clickAdd();

    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible({ timeout: 15000 });
  });

  test('bucket appears in sidebar after creation', async ({
    page,
    testDatabase,
    testConnection
  }) => {
    const signInPage = new SignInPage(page);
    const { email, password } = getAdminCredentials();

    const bucketName = `test-bucket-sidebar-${Date.now()}`;

    await testDatabase.createTestBucket(bucketName, testConnection.id);

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    const sidebarLink = page.getByTestId('sidebar').getByRole('link', { name: bucketName });

    await expect(sidebarLink).toBeVisible();
  });

  test('admin can delete a bucket from connections page', async ({
    page,
    testDatabase,
    testConnection
  }) => {
    const signInPage = new SignInPage(page);
    const connectionsPage = new ConnectionsPage(page);
    const { email, password } = getAdminCredentials();

    const bucketName = `test-bucket-delete-${Date.now()}`;

    await testDatabase.createTestBucket(bucketName, testConnection.id);

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await connectionsPage.goto();
    await page.waitForURL('/connections');

    await connectionsPage.getConnectionHeader(testConnection.label).click();

    await expect(connectionsPage.getBucketItem(bucketName)).toBeVisible();

    const deleteResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/rpc/buckets/delete')
    );

    await connectionsPage.deleteBucket(bucketName);

    await deleteResponsePromise;

    await expect(connectionsPage.getBucketItem(bucketName)).toBeHidden();

    const deletedBucket = await testDatabase.getBucketByName(bucketName);

    expect(deletedBucket).toBeNull();
  });

  test('bucket removed from sidebar after deletion', async ({
    page,
    testDatabase,
    testConnection
  }) => {
    const signInPage = new SignInPage(page);
    const connectionsPage = new ConnectionsPage(page);
    const { email, password } = getAdminCredentials();

    const bucketName = `test-bucket-sidebar-del-${Date.now()}`;

    await testDatabase.createTestBucket(bucketName, testConnection.id);

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    const sidebarLink = page.getByTestId('sidebar').getByRole('link', { name: bucketName });

    await expect(sidebarLink).toBeVisible();

    await connectionsPage.goto();
    await page.waitForURL('/connections');

    await connectionsPage.getConnectionHeader(testConnection.label).click();

    await expect(connectionsPage.getBucketItem(bucketName)).toBeVisible();

    const deleteResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/rpc/buckets/delete')
    );

    await connectionsPage.deleteBucket(bucketName);

    await deleteResponsePromise;

    await expect(connectionsPage.getBucketItem(bucketName)).toBeHidden();
    await expect(sidebarLink).toBeHidden();
  });

  test('bucket shows metrics in file browser header', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await page.goto(`/buckets/${testBucketWithFiles.bucketId}`);

    await expect(page.getByText(/\d+ objects/)).toBeVisible({ timeout: 15000 });
  });
});
