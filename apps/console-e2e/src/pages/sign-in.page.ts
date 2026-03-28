import { Locator, Page } from '@playwright/test';

export class SignInPage {
  public readonly page: Page;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly signInButton: Locator;
  public readonly errorAlert: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorAlert = page.getByRole('alert');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/sign-in');
  }

  public async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  public async signInAndWaitForNavigation(email: string, password: string): Promise<void> {
    await this.signIn(email, password);
    await this.page.waitForURL((url) => !url.pathname.startsWith('/sign-in'));
  }
}
