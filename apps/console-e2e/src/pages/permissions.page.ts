import { Locator, Page } from '@playwright/test';

export class PermissionsPage {
  public readonly page: Page;
  public readonly pageTitle: Locator;
  public readonly noUsersText: Locator;
  public readonly noBucketsText: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Bucket Permissions');

    this.noUsersText = page.getByText('No non-admin users to manage permissions for.');

    this.noBucketsText = page.getByText('No buckets available.');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/users/permissions');
  }

  public getUserAccordionTrigger(userEmail: string): Locator {
    return this.page.getByRole('heading', { level: 3 }).filter({ hasText: userEmail });
  }

  public async expandUserAccordion(userEmail: string): Promise<void> {
    const trigger = this.getUserAccordionTrigger(userEmail);
    const columnHeader = this.page.getByRole('columnheader', {
      name: 'Bucket'
    });
    const isVisible = await columnHeader.isVisible().catch(() => false);

    if (!isVisible) {
      await trigger.click();
      await columnHeader.waitFor({ state: 'visible' });
    }
  }

  public getPermissionCheckbox(
    _userEmail: string,
    bucketName: string,
    permission: 'view' | 'edit' | 'delete'
  ): Locator {
    // TODO: scope to user's section once DOM structure supports it
    const row = this.page.getByRole('row').filter({ hasText: bucketName });
    // Each cell contains two checkbox roles (visible + hidden native input),
    // so we scope to the correct cell first, then take the first checkbox.
    const cellIndex = { view: 1, edit: 2, delete: 3 }[permission];

    return row.getByRole('cell').nth(cellIndex).getByRole('checkbox').first();
  }

  public async togglePermission(
    userEmail: string,
    bucketName: string,
    permission: 'view' | 'edit' | 'delete'
  ): Promise<void> {
    await this.expandUserAccordion(userEmail);

    const checkbox = this.getPermissionCheckbox(userEmail, bucketName, permission);

    await checkbox.click();
  }

  public async isPermissionEnabled(
    userEmail: string,
    bucketName: string,
    permission: 'view' | 'edit' | 'delete'
  ): Promise<boolean> {
    await this.expandUserAccordion(userEmail);

    const checkbox = this.getPermissionCheckbox(userEmail, bucketName, permission);

    return checkbox.isChecked();
  }

  public async waitForAccordionVisible(): Promise<void> {
    await this.page.getByText('permissions').first().waitFor({ state: 'visible' });
  }
}
