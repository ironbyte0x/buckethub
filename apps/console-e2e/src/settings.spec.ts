import { expect, test } from './fixture';
import { SettingsPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Settings', () => {
  test.describe('Navigation', () => {
    test('user can navigate to settings from user menu', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await settingsPage.navigateFromUserMenu();

      await expect(page).toHaveURL('/settings/profile');
    });

    test('user can navigate between profile and appearance tabs', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await settingsPage.gotoProfile();
      await expect(page).toHaveURL('/settings/profile');

      await settingsPage.appearanceNavItem.click();
      await expect(page).toHaveURL('/settings/appearance');

      await settingsPage.profileNavItem.click();
      await expect(page).toHaveURL('/settings/profile');
    });
  });

  test.describe('Profile', () => {
    test('user can update their name', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await settingsPage.gotoProfile();

      await expect(settingsPage.nameInput).toBeVisible();

      const originalName = await settingsPage.nameInput.inputValue();
      const newName = 'Admin Updated';

      await settingsPage.updateName(newName);

      await expect(settingsPage.saveButton).toBeEnabled();

      await settingsPage.saveProfileAndWait();

      await expect(settingsPage.errorAlert).toBeHidden();
      await expect(settingsPage.nameInput).toHaveValue(newName);
      await expect(settingsPage.sidebarUserName).toHaveText(newName);

      await settingsPage.updateName(originalName);
      await settingsPage.saveProfileAndWait();
    });

    test('save button is disabled when form is pristine', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoProfile();

      await expect(settingsPage.saveButton).toBeDisabled();
    });

    test('save button is enabled after modifying form', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoProfile();

      await expect(settingsPage.saveButton).toBeDisabled();

      await settingsPage.updateName('Modified Name');

      await expect(settingsPage.saveButton).toBeEnabled();
    });

    test('shows error when updating to duplicate email', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);
      const { email: adminEmail } = getAdminCredentials();

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoProfile();

      await settingsPage.updateEmail(adminEmail);
      await settingsPage.saveProfile();

      await expect(settingsPage.errorAlert).toBeVisible();
    });

    test('shows validation error for empty name', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoProfile();

      await settingsPage.nameInput.clear();
      await settingsPage.saveProfile();

      const errorMessage = page.getByText('Name is required');

      await expect(errorMessage).toBeVisible();
    });

    test('shows validation error for invalid email', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoProfile();

      await settingsPage.updateEmail('invalid-email');
      await settingsPage.saveProfile();

      const errorMessage = page.getByText('Invalid email address');

      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('Appearance', () => {
    test('user can select light theme', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoAppearance();

      await settingsPage.selectThemeAndWait('light');

      const isDark = await settingsPage.isDarkModeActive();

      expect(isDark).toBe(false);

      const isSelected = await settingsPage.isThemeSelected('light');

      expect(isSelected).toBe(true);
    });

    test('user can select dark theme', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoAppearance();

      await settingsPage.selectThemeAndWait('dark');

      const isDark = await settingsPage.isDarkModeActive();

      expect(isDark).toBe(true);

      const isSelected = await settingsPage.isThemeSelected('dark');

      expect(isSelected).toBe(true);
    });

    test('user can select system theme', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoAppearance();

      await settingsPage.selectThemeAndWait('dark');

      await settingsPage.selectThemeAndWait('system');

      const isSelected = await settingsPage.isThemeSelected('system');

      expect(isSelected).toBe(true);
    });

    test('theme persists after page reload', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoAppearance();

      await settingsPage.selectThemeAndWait('dark');

      await page.reload();

      const isDark = await settingsPage.isDarkModeActive();

      expect(isDark).toBe(true);

      const isSelected = await settingsPage.isThemeSelected('dark');

      expect(isSelected).toBe(true);
    });
  });

  test.describe('Security', () => {
    test('user can navigate to security tab', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoSecurity();

      await expect(page).toHaveURL('/settings/security');
      await expect(settingsPage.currentPasswordInput).toBeVisible();
    });

    test('change password button is disabled when form is empty', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoSecurity();

      await expect(settingsPage.changePasswordButton).toBeDisabled();
    });

    test('shows validation error for mismatched passwords', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoSecurity();

      await settingsPage.fillPasswordForm(testUser.password, 'newpassword123', 'differentpassword');

      await settingsPage.changePassword();

      const errorMessage = page.getByText('Passwords do not match');

      await expect(errorMessage).toBeVisible();
    });

    test('shows validation error for short password', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoSecurity();

      await settingsPage.fillPasswordForm(testUser.password, 'short', 'short');

      await settingsPage.changePassword();

      const errorMessage = page.getByText('Password must be at least 8 characters');

      await expect(errorMessage).toBeVisible();
    });

    test('shows error for incorrect current password', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoSecurity();

      await settingsPage.fillPasswordForm('wrongpassword', 'newpassword123', 'newpassword123');

      await settingsPage.changePasswordAndWait();

      await expect(settingsPage.errorAlert).toBeVisible();
    });

    test('user can change password successfully', async ({ page, testUser }) => {
      const signInPage = new SignInPage(page);
      const settingsPage = new SettingsPage(page);
      const newPassword = 'newpassword123';

      await signInPage.goto();

      await signInPage.signInAndWaitForNavigation(testUser.email, testUser.password);

      await settingsPage.gotoSecurity();

      await settingsPage.fillPasswordForm(testUser.password, newPassword, newPassword);

      await settingsPage.changePasswordAndWait();

      await expect(settingsPage.successMessage).toBeVisible();

      // Sign out and verify can login with new password
      await settingsPage.signOut();
      await signInPage.signInAndWaitForNavigation(testUser.email, newPassword);

      await expect(page).toHaveURL('/');

      // Reset password back to original for other tests
      await settingsPage.gotoSecurity();

      await settingsPage.fillPasswordForm(newPassword, testUser.password, testUser.password);

      await settingsPage.changePasswordAndWait();
    });
  });
});
