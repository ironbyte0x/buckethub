import { expect, Locator, Page } from '@playwright/test';

export class SettingsPage {
  public readonly page: Page;

  // Navigation
  public readonly userMenuTrigger: Locator;
  public readonly settingsMenuItem: Locator;
  public readonly logOutMenuItem: Locator;

  // Sidebar user info (for verifying profile updates)
  public readonly sidebarUserName: Locator;
  public readonly sidebarUserEmail: Locator;

  // Layout
  public readonly profileNavItem: Locator;
  public readonly appearanceNavItem: Locator;
  public readonly securityNavItem: Locator;

  // Profile form
  public readonly nameInput: Locator;
  public readonly emailInput: Locator;
  public readonly uploadImageButton: Locator;
  public readonly removeImageButton: Locator;
  public readonly avatarImage: Locator;
  public readonly saveButton: Locator;
  public readonly errorAlert: Locator;

  // Appearance
  public readonly lightThemeButton: Locator;
  public readonly darkThemeButton: Locator;
  public readonly systemThemeButton: Locator;

  // Security
  public readonly currentPasswordInput: Locator;
  public readonly newPasswordInput: Locator;
  public readonly confirmPasswordInput: Locator;
  public readonly changePasswordButton: Locator;
  public readonly successMessage: Locator;

  public constructor(page: Page) {
    this.page = page;

    // Navigation from sidebar
    this.userMenuTrigger = page.getByTestId('user-info-trigger');
    this.settingsMenuItem = page.getByRole('menuitem', { name: 'Settings' });
    this.logOutMenuItem = page.getByRole('menuitem', { name: 'Log out' });

    // Sidebar user info
    this.sidebarUserName = page.getByTestId('user-info-name');
    this.sidebarUserEmail = page.getByTestId('user-info-email');

    // Settings navigation
    this.profileNavItem = page.getByRole('link', { name: 'Profile' });
    this.appearanceNavItem = page.getByRole('link', { name: 'Appearance' });
    this.securityNavItem = page.getByRole('link', { name: 'Security' });

    // Profile form
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.uploadImageButton = page.getByRole('button', { name: 'Upload image' });
    this.removeImageButton = page.getByRole('button', { name: 'Remove' });
    this.avatarImage = page.locator('[data-slot="avatar-image"]');
    this.saveButton = page.getByRole('button', { name: 'Save changes' });
    this.errorAlert = page.getByRole('alert');

    // Theme buttons
    this.lightThemeButton = page.getByRole('button', { name: 'Light' });
    this.darkThemeButton = page.getByRole('button', { name: 'Dark' });
    this.systemThemeButton = page.getByRole('button', { name: 'System' });

    // Security form
    this.currentPasswordInput = page.getByLabel('Current password');
    this.newPasswordInput = page.getByLabel('New password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm new password');

    this.changePasswordButton = page.getByRole('button', {
      name: 'Change password'
    });

    this.successMessage = page.getByText('Password changed successfully');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/settings');
  }

  public async gotoProfile(): Promise<void> {
    await this.page.goto('/settings/profile');
  }

  public async gotoAppearance(): Promise<void> {
    await this.page.goto('/settings/appearance');
  }

  public async gotoSecurity(): Promise<void> {
    await this.page.goto('/settings/security');
  }

  public async navigateFromUserMenu(): Promise<void> {
    await this.userMenuTrigger.click();
    await this.settingsMenuItem.click();
    await this.page.waitForURL('/settings/profile');
  }

  public async updateName(name: string): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.fill(name);
  }

  public async updateEmail(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  public async saveProfile(): Promise<void> {
    await this.saveButton.click();
  }

  public async saveProfileAndWait(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((resp) => resp.url().includes('updateProfile')),
      this.page.waitForResponse((resp) => resp.url().includes('get-session')),
      this.saveButton.click()
    ]);
  }

  public async selectTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    const button =
      theme === 'light'
        ? this.lightThemeButton
        : theme === 'dark'
          ? this.darkThemeButton
          : this.systemThemeButton;

    await button.click();
  }

  public async selectThemeAndWait(theme: 'light' | 'dark' | 'system'): Promise<void> {
    const button =
      theme === 'light'
        ? this.lightThemeButton
        : theme === 'dark'
          ? this.darkThemeButton
          : this.systemThemeButton;

    await button.click();

    await expect(button).toHaveAttribute('data-selected', 'true');
  }

  public async isDarkModeActive(): Promise<boolean> {
    return this.page.evaluate(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.documentElement.classList.contains('dark')
    );
  }

  public async isThemeSelected(theme: 'light' | 'dark' | 'system'): Promise<boolean> {
    const button =
      theme === 'light'
        ? this.lightThemeButton
        : theme === 'dark'
          ? this.darkThemeButton
          : this.systemThemeButton;

    const dataSelected = await button.getAttribute('data-selected');

    return dataSelected === 'true';
  }

  public async fillPasswordForm(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  public async changePassword(): Promise<void> {
    await this.changePasswordButton.click();
  }

  public async changePasswordAndWait(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((resp) => resp.url().includes('change-password')),
      this.changePasswordButton.click()
    ]);
  }

  public async signOut(): Promise<void> {
    await this.userMenuTrigger.click();
    await this.logOutMenuItem.click();
    await this.page.waitForURL('/sign-in');
  }
}
