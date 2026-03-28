import { expect, test } from './fixture';
import { PermissionsPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Bucket Permissions', () => {
  test.describe('Permissions Page Access', () => {
    test('admin can access permissions page', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const permissionsPage = new PermissionsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await permissionsPage.goto();

      await expect(permissionsPage.pageTitle).toBeVisible();
    });

    test('non-admin user cannot access permissions page', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const permissionsPage = new PermissionsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await permissionsPage.goto();

      await expect(page.getByText(/Buckets \(\d+\)/)).toBeVisible();

      await expect(permissionsPage.pageTitle).toBeHidden();
      await expect(page).not.toHaveURL(/\/users\/permissions/);
    });
  });

  test.describe('Permission Management', () => {
    test('admin can toggle view permission for a user', async ({
      page,
      testUser,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const permissionsPage = new PermissionsPage(page);
      const { email, password } = getAdminCredentials();

      const testBucketName = `test-bucket-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      await testDatabase.createTestBucket(testBucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await permissionsPage.goto();
      await permissionsPage.waitForAccordionVisible();

      await permissionsPage.expandUserAccordion(testUser.email);

      const viewCheckbox = permissionsPage.getPermissionCheckbox(
        testUser.email,
        testBucketName,
        'view'
      );

      await expect(viewCheckbox).not.toBeChecked();

      await viewCheckbox.click();

      await expect(viewCheckbox).toBeChecked();

      const databasePermissions = await testDatabase.getUserPermissions(
        testUser.email,
        testBucketName
      );

      expect(databasePermissions).toContain('view');
    });

    test('admin can grant multiple permissions', async ({
      page,
      testUser,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const permissionsPage = new PermissionsPage(page);
      const { email, password } = getAdminCredentials();

      const testBucketName = `test-bucket-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      await testDatabase.createTestBucket(testBucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await permissionsPage.goto();
      await permissionsPage.waitForAccordionVisible();

      await permissionsPage.expandUserAccordion(testUser.email);

      for (const permission of ['view', 'edit', 'delete'] as const) {
        const checkbox = permissionsPage.getPermissionCheckbox(
          testUser.email,
          testBucketName,
          permission
        );

        await checkbox.click();
        await expect(checkbox).toBeChecked();
      }

      const databasePermissions = await testDatabase.getUserPermissions(
        testUser.email,
        testBucketName
      );

      expect(databasePermissions).toContain('view');
      expect(databasePermissions).toContain('edit');
      expect(databasePermissions).toContain('delete');
    });
  });

  test.describe('Permission Enforcement', () => {
    test('user without permissions cannot see bucket in sidebar', async ({
      page,
      testUser,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const { email, password } = getAdminCredentials();

      const testBucketName = `test-bucket-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      await testDatabase.createTestBucket(testBucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await expect(page.getByText(testBucketName)).toBeVisible();

      await page.context().clearCookies();

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await expect(page.getByText(/Buckets \(\d+\)/)).toBeVisible();

      await expect(page.getByText(testBucketName)).toBeHidden();
    });

    test('user with view permission can see bucket', async ({
      page,
      testUser,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);

      const testBucketName = `test-bucket-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      await testDatabase.createTestBucket(testBucketName, testConnection.id);

      await testDatabase.setUserPermission(testUser.email, testBucketName, 'view');

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await expect(page.getByText(testBucketName)).toBeVisible();
    });
  });
});
