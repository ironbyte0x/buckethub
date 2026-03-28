import { Locator, Page } from '@playwright/test';

export class HomePage {
  public readonly page: Page;
  public readonly welcomeTitle: Locator;
  public readonly welcomeDescription: Locator;
  public readonly addFirstBucketButton: Locator;
  public readonly addBucketDialog: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.getByText('Welcome to Buckethub');

    this.welcomeDescription = page.getByText('Your unified S3 bucket management platform.');

    this.addFirstBucketButton = page.getByRole('button', {
      name: 'Add your first bucket'
    });

    this.addBucketDialog = page.getByLabel('Add New Bucket');
  }

  public async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
