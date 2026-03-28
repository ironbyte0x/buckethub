import { Locator, Page } from '@playwright/test';

export class AddBucketPage {
  public readonly page: Page;
  private readonly dialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByLabel('Add New Bucket');
  }

  public async openDialog(): Promise<void> {
    const bucketsHeader = this.page.getByText(/^Buckets \(\d+\)$/);
    const addButton = bucketsHeader.locator('..').getByRole('button');

    await addButton.click();

    await this.dialog.waitFor({ state: 'visible' });
  }

  public async selectNewConnection(): Promise<void> {
    const connectionTypeStep = this.dialog.getByText('How would you like to connect?');

    if (await connectionTypeStep.isVisible()) {
      await this.dialog.getByText('Add new connection').click();
      await this.dialog.getByRole('button', { name: 'Next' }).click();
    }
  }

  public async fillConnection(options: {
    label: string;
    accessKey: string;
    secretKey: string;
    endpoint: string;
  }): Promise<void> {
    await this.dialog.getByLabel('Label').fill(options.label);
    await this.dialog.getByLabel('Access Key ID').fill(options.accessKey);
    await this.dialog.getByLabel('Secret Access Key').fill(options.secretKey);

    const endpointField = this.dialog.getByLabel('Endpoint');

    await endpointField.click();
    await endpointField.press('ControlOrMeta+a');
    await endpointField.pressSequentially(options.endpoint);
    await this.dialog.getByRole('button', { name: 'Next' }).click();
  }

  public async waitForBucketList(): Promise<void> {
    await this.dialog.getByText('Choose which buckets you want to add').waitFor({
      state: 'visible',
      timeout: 15000
    });
  }

  public async clickAdd(): Promise<void> {
    await this.dialog.getByRole('button', { name: 'Add' }).click();
  }
}
