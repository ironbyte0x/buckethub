import { Locator, Page } from '@playwright/test';

export class AcceptInvitationPage {
  public readonly page: Page;
  public readonly nameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly confirmPasswordInput: Locator;
  public readonly createAccountButton: Locator;
  public readonly errorAlert: Locator;
  public readonly invalidInvitationMessage: Locator;
  public readonly goToSignInButton: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Name');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');

    this.createAccountButton = page.getByRole('button', {
      name: 'Create Account'
    });

    this.errorAlert = page.getByRole('alert');

    this.invalidInvitationMessage = page.getByText(
      'This invitation link is invalid or has expired.'
    );

    this.goToSignInButton = page.getByRole('button', { name: 'Go to Sign In' });
  }

  public async goto(token: string): Promise<void> {
    await this.page.goto(`/accept-invitation#token=${token}`);
  }

  public async fillForm(name: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  public async submitForm(): Promise<void> {
    await this.createAccountButton.click();
  }

  public async acceptInvitation(name: string, password: string): Promise<void> {
    await this.fillForm(name, password);
    await this.submitForm();
  }

  public async acceptInvitationAndWaitForRedirect(name: string, password: string): Promise<void> {
    await this.acceptInvitation(name, password);
    await this.page.waitForURL('/sign-in');
  }

  public async isInvalidInvitation(): Promise<boolean> {
    try {
      await this.invalidInvitationMessage.waitFor({
        state: 'visible',
        timeout: 10000
      });

      return true;
    } catch {
      return false;
    }
  }

  public getEmailDisplay(): Locator {
    return this.page.getByText(/Create your account for/);
  }
}
