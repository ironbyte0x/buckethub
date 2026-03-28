import { expect, test } from './fixture';
import { SignInPage, UsersPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Users Management', () => {
  test.describe('View Users', () => {
    test('admin can view users list', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();

      await expect(usersPage.pageTitle).toBeVisible();
      await expect(usersPage.usersTable).toBeVisible();
      await expect(usersPage.getUserRow(email)).toBeVisible();
    });

    test('admin sees their own user marked as (you)', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();

      const userName = usersPage.getUserName(email);

      await expect(userName).toContainText('(you)');
    });

    test('admin cannot see actions menu for themselves', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(email);

      await expect(usersPage.getActionsMenu(email)).toBeHidden();
    });
  });

  test.describe('Role Management', () => {
    test('admin can make a user an admin', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(testUser.email);

      await expect(usersPage.getUserRole(testUser.email)).toContainText('User');

      await usersPage.toggleRole(testUser.email);

      await expect(usersPage.getUserRole(testUser.email)).toContainText('Admin');
    });

    test('admin can revoke admin access', async ({ page, testUser, testDatabase }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(testUser.email);

      await usersPage.toggleRole(testUser.email);

      await expect(usersPage.getUserRole(testUser.email)).toContainText('Admin');

      await usersPage.toggleRole(testUser.email);
      await expect(usersPage.getUserRole(testUser.email)).toContainText('User');

      const role = await testDatabase.getUserRole(testUser.email);

      expect(role).toBe('user');
    });
  });

  test.describe('Ban/Unban Users', () => {
    test('admin can ban a user', async ({ page, testUser, testDatabase }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(testUser.email);

      await expect(usersPage.getUserStatus(testUser.email)).toContainText('Active');

      await usersPage.banUser(testUser.email);

      await expect(usersPage.getUserStatus(testUser.email)).toContainText('Banned');

      const isBanned = await testDatabase.isUserBanned(testUser.email);

      expect(isBanned).toBe(true);
    });

    test('admin can unban a user', async ({ page, testUser, testDatabase }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(testUser.email);

      await usersPage.banUser(testUser.email);

      await expect(usersPage.getUserStatus(testUser.email)).toContainText('Banned');

      await usersPage.unbanUser(testUser.email);

      await expect(usersPage.getUserStatus(testUser.email)).toContainText('Active');

      const isBanned = await testDatabase.isUserBanned(testUser.email);

      expect(isBanned).toBe(false);
    });

    test('banned user cannot sign in', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(testUser.email);

      await usersPage.banUser(testUser.email);

      await page.context().clearCookies();

      await signInPage.goto();
      await signInPage.signIn(testUser.email, testUser.password);

      await expect(signInPage.errorAlert).toBeVisible();
      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('Delete Users', () => {
    test('admin can delete a user', async ({ page, testUser, testDatabase }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await usersPage.goto();
      await usersPage.waitForUserInList(testUser.email);

      await usersPage.deleteUser(testUser.email);

      await usersPage.waitForUserRemoved(testUser.email);

      const user = await testDatabase.getUserByEmail(testUser.email);

      expect(user).toBeNull();
    });
  });

  test.describe('Access Control', () => {
    test('non-admin user cannot access users page', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const usersPage = new UsersPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await usersPage.goto();

      await expect(page.getByText(/Buckets \(\d+\)/)).toBeVisible();

      await expect(usersPage.pageTitle).toBeHidden();
      await expect(page).not.toHaveURL(/\/users\/users/);
    });
  });
});
