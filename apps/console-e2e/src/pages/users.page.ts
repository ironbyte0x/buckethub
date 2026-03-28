import { Locator, Page } from '@playwright/test';

export class UsersPage {
  public readonly page: Page;
  public readonly pageTitle: Locator;
  public readonly usersTable: Locator;
  public readonly noUsersText: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('User Management');
    this.usersTable = page.getByRole('table');
    this.noUsersText = page.getByText('No users found');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/users/users');
  }

  public getUserRow(email: string): Locator {
    return this.page.getByTestId(`user-row-${email}`);
  }

  public getUserName(email: string): Locator {
    return this.page.getByTestId(`user-name-${email}`);
  }

  public getUserEmail(email: string): Locator {
    return this.page.getByTestId(`user-email-${email}`);
  }

  public getUserRole(email: string): Locator {
    return this.page.getByTestId(`user-role-${email}`);
  }

  public getUserStatus(email: string): Locator {
    return this.page.getByTestId(`user-status-${email}`);
  }

  public getActionsMenu(email: string): Locator {
    return this.page.getByTestId(`user-actions-menu-${email}`);
  }

  public getToggleRoleMenuItem(email: string): Locator {
    return this.page.getByTestId(`toggle-role-${email}`);
  }

  public getBanMenuItem(email: string): Locator {
    return this.page.getByTestId(`ban-user-${email}`);
  }

  public getUnbanMenuItem(email: string): Locator {
    return this.page.getByTestId(`unban-user-${email}`);
  }

  public getDeleteMenuItem(email: string): Locator {
    return this.page.getByTestId(`delete-user-${email}`);
  }

  public async openActionsMenu(email: string): Promise<void> {
    await this.getActionsMenu(email).click();
  }

  public async toggleRole(email: string): Promise<void> {
    await this.openActionsMenu(email);

    const menuItem = this.getToggleRoleMenuItem(email);

    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();

    await this.page
      .getByText(/Admin access (granted|revoked)/)
      .first()
      .waitFor({ state: 'visible' });
  }

  public async banUser(email: string): Promise<void> {
    await this.openActionsMenu(email);

    const menuItem = this.getBanMenuItem(email);

    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();

    const confirmButton = this.page.getByRole('button', { name: 'Ban User' });

    await confirmButton.waitFor({ state: 'visible' });

    await Promise.all([
      this.page.waitForResponse((resp) => resp.url().includes('/rpc/users') && resp.ok()),
      confirmButton.click()
    ]);
  }

  public async unbanUser(email: string): Promise<void> {
    await this.openActionsMenu(email);

    const menuItem = this.getUnbanMenuItem(email);

    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
    await this.page.getByText('User unbanned').waitFor({ state: 'visible' });
  }

  public async deleteUser(email: string): Promise<void> {
    await this.openActionsMenu(email);

    const menuItem = this.getDeleteMenuItem(email);

    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();

    const confirmButton = this.page.getByRole('button', { name: 'Delete' });

    await confirmButton.waitFor({ state: 'visible' });
    await confirmButton.click();
    await this.page.getByText('User deleted').waitFor({ state: 'visible' });
  }

  public async waitForUserInList(email: string): Promise<void> {
    await this.getUserRow(email).waitFor({ state: 'visible' });
  }

  public async waitForUserRemoved(email: string): Promise<void> {
    await this.getUserRow(email).waitFor({ state: 'detached' });
  }
}
