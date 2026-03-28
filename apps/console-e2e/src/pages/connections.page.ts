import { Locator, Page } from '@playwright/test';

export class ConnectionsPage {
  public readonly page: Page;
  public readonly pageTitle: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Connections management');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/connections');
  }

  public getConnectionAccordion(label: string): Locator {
    return this.page.getByTestId('connections-list').locator('> div').filter({ hasText: label });
  }

  public getConnectionHeader(label: string): Locator {
    return this.getConnectionAccordion(label).locator('h3, button').filter({ hasText: label });
  }

  public getEditConnectionButton(label: string): Locator {
    return this.getConnectionAccordion(label).getByRole('button', { name: 'Edit connection' });
  }

  public getDeleteConnectionButton(label: string): Locator {
    return this.getConnectionAccordion(label).getByRole('button', { name: 'Delete connection' });
  }

  public getBucketItem(bucketName: string): Locator {
    return this.page.locator('main').getByRole('link').filter({ hasText: bucketName });
  }

  public getEditBucketButton(bucketName: string): Locator {
    return this.getBucketItem(bucketName)
      .locator('..')
      .getByRole('button', { name: 'Edit bucket' });
  }

  public getDeleteBucketButton(bucketName: string): Locator {
    return this.getBucketItem(bucketName)
      .locator('..')
      .getByRole('button', { name: 'Delete bucket' });
  }

  public get editDialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Edit Connection' });
  }

  public get editLabelInput(): Locator {
    return this.editDialog.getByLabel('Label');
  }

  public get editSaveButton(): Locator {
    return this.editDialog.getByRole('button', { name: 'Save' });
  }

  public get editCancelButton(): Locator {
    return this.editDialog.getByRole('button', { name: 'Cancel' });
  }

  public get deleteConfirmButton(): Locator {
    return this.page.getByRole('alertdialog').getByRole('button', { name: 'Delete' });
  }

  public get deleteCancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  public async editConnectionLabel(currentLabel: string, newLabel: string): Promise<void> {
    await this.getEditConnectionButton(currentLabel).click();
    await this.editDialog.waitFor({ state: 'visible' });
    await this.editLabelInput.clear();
    await this.editLabelInput.fill(newLabel);
    await this.editSaveButton.click();
  }

  public async deleteConnection(label: string): Promise<void> {
    await this.getDeleteConnectionButton(label).click();
    await this.deleteConfirmButton.waitFor({ state: 'visible' });
    await this.deleteConfirmButton.click();
  }

  public async deleteBucket(bucketName: string): Promise<void> {
    await this.getDeleteBucketButton(bucketName).click();
    await this.deleteConfirmButton.waitFor({ state: 'visible' });
    await this.deleteConfirmButton.click();
  }
}
