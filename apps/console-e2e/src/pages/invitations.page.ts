import { Locator, Page } from '@playwright/test';

export class InvitationsPage {
  public readonly page: Page;
  public readonly emailInput: Locator;
  public readonly sendInvitationButton: Locator;
  public readonly pendingInvitationsList: Locator;
  public readonly noInvitationsText: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Enter email address');

    this.sendInvitationButton = page.getByRole('button', {
      name: 'Send Invitation'
    });

    this.pendingInvitationsList = page.getByTestId('invitation-list');
    this.noInvitationsText = page.getByText('No pending invitations');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/users/invitations');
  }

  public async sendInvitation(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.sendInvitationButton.click();
  }

  public async waitForInvitationInList(email: string): Promise<void> {
    await this.getInvitationItem(email).waitFor({ state: 'visible' });
  }

  public async revokeInvitation(email: string): Promise<void> {
    await this.getRevokeButton(email).click();
  }

  public async waitForInvitationRemoved(email: string): Promise<void> {
    await this.getInvitationItem(email).waitFor({ state: 'detached' });
  }

  public getInvitationItem(email: string): Locator {
    return this.page.getByTestId(`invitation-item-${email}`);
  }

  public getInvitationEmail(email: string): Locator {
    return this.page.getByTestId(`invitation-email-${email}`);
  }

  public getRevokeButton(email: string): Locator {
    return this.page.getByTestId(`revoke-invitation-${email}`);
  }

  public async hasNoInvitations(): Promise<boolean> {
    return this.noInvitationsText.isVisible();
  }
}
