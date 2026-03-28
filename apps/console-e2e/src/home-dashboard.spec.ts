import { expect, test } from './fixture';
import { HomePage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Home Dashboard', () => {
  test.describe('Empty State', () => {
    test('shows welcome message when no buckets exist', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const homePage = new HomePage(page);
      const { email, password } = getAdminCredentials();

      // Intercept the buckets API to return empty results without modifying the DB
      await page.route('**/rpc/buckets/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await homePage.goto();

      await expect(homePage.welcomeTitle).toBeVisible();
      await expect(homePage.welcomeDescription).toBeVisible();
      await expect(homePage.addFirstBucketButton).toBeVisible();
    });

    test('add first bucket button opens add bucket dialog', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const homePage = new HomePage(page);
      const { email, password } = getAdminCredentials();

      // Intercept the buckets API to return empty results without modifying the DB
      await page.route('**/rpc/buckets/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await homePage.goto();

      await expect(homePage.addFirstBucketButton).toBeVisible();

      // Unroute before clicking the button so the add bucket dialog works properly
      await page.unroute('**/rpc/buckets/**');

      await homePage.addFirstBucketButton.click();

      await expect(homePage.addBucketDialog).toBeVisible();
    });
  });

  test.describe('With Buckets', () => {
    test('redirects to bucket view when buckets exist', async ({
      page,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const { email, password } = getAdminCredentials();
      const bucketName = 'test-bucket-1';

      await testDatabase.createTestBucket(bucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await page.goto('/');
      await page.waitForURL(/\/buckets\//, { timeout: 10000 });

      await expect(page).toHaveURL(/\/buckets\//);
    });

    test('bucket appears in sidebar', async ({ page, testDatabase, testConnection }) => {
      const signInPage = new SignInPage(page);
      const { email, password } = getAdminCredentials();
      const bucketName = `test-sidebar-bucket-${Date.now()}`;

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await testDatabase.createTestBucket(bucketName, testConnection.id);

      await page.reload();

      await expect(page.getByRole('link', { name: bucketName })).toBeVisible();
    });

    test('can navigate to bucket from sidebar', async ({ page, testDatabase, testConnection }) => {
      const signInPage = new SignInPage(page);
      const { email, password } = getAdminCredentials();
      const bucketName = `test-nav-bucket-${Date.now()}`;

      await testDatabase.createTestBucket(bucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      const sidebarLink = page.getByRole('link', { name: bucketName });

      await expect(sidebarLink).toBeVisible();
      await sidebarLink.click();

      await page.waitForURL(/\/buckets\//, { timeout: 10000 });

      await expect(page).toHaveURL(/\/buckets\//);
    });
  });
});
