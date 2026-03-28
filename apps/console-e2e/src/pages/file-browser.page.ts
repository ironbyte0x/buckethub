import { Locator, Page } from '@playwright/test';

export class FileBrowserPage {
  public readonly page: Page;
  public readonly searchInput: Locator;
  public readonly newFolderButton: Locator;
  public readonly uploadButton: Locator;
  public readonly refreshButton: Locator;
  public readonly objectsTable: Locator;
  public readonly emptyMessage: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search objects...');
    this.newFolderButton = page.getByRole('button', { name: 'New folder' });
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.objectsTable = page.getByRole('table');
    this.emptyMessage = page.getByText(/This (bucket|folder) is empty/);
  }

  public async goto(bucketId: string): Promise<void> {
    await this.page.goto(`/buckets/${bucketId}`);
    await this.page.waitForURL(new RegExp(`/buckets/${bucketId}`));
  }

  public getFileRow(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  public getFolderRow(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  public getRowCheckbox(name: string): Locator {
    return this.getFileRow(name).getByRole('checkbox');
  }

  public async clickFile(name: string): Promise<void> {
    await this.getFileRow(name).getByRole('link', { name }).click();
  }

  public async clickFolder(name: string): Promise<void> {
    await this.getFolderRow(name).getByRole('link', { name }).click();
  }

  public async uploadFile(filePath: string): Promise<void> {
    await this.uploadButton.click();

    const uploadFileOption = this.page.getByRole('menuitem', { name: 'Upload file' });

    await uploadFileOption.click();

    const fileInput = this.page.locator('input[type="file"]:not([webkitdirectory])');

    await fileInput.setInputFiles(filePath);
  }

  public async createFolder(name: string): Promise<void> {
    await this.newFolderButton.click();

    const dialog = this.page.getByRole('dialog', { name: 'New Folder' });

    await dialog.waitFor({ state: 'visible' });

    const newButton = dialog.getByRole('button', { name: 'New' });

    await newButton.click();

    const folderNameInput = this.page.getByPlaceholder('Folder name');

    await folderNameInput.fill(name);
    await folderNameInput.press('Enter');
    await dialog.getByRole('button', { name: 'Create' }).click();
  }

  public async openFileActions(name: string): Promise<void> {
    const row = this.getFileRow(name);
    const moreButton = row.getByRole('button').last();

    await moreButton.click();
  }

  public async renameFile(name: string, newName: string): Promise<void> {
    await this.openFileActions(name);
    await this.page.getByRole('menu').getByText('Rename', { exact: true }).click();

    const dialog = this.page.getByRole('dialog', { name: 'Rename Object' });

    await dialog.waitFor({ state: 'visible' });

    const input = dialog.getByPlaceholder('Enter new object key');

    await input.clear();
    await input.fill(newName);

    const responsePromise = this.page.waitForResponse((response) =>
      response.url().includes('/rpc/objects/rename')
    );

    await dialog.getByRole('button', { name: 'Rename' }).click();
    await responsePromise;
  }

  public async deleteFile(name: string): Promise<void> {
    await this.openFileActions(name);

    const responsePromise = this.page.waitForResponse((response) =>
      response.url().includes('/rpc/objects/deleteObject')
    );

    await this.page.getByRole('menuitem', { name: 'Delete' }).click();

    const confirmButton = this.page.getByRole('button', { name: 'Delete' });

    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }

    await responsePromise;
  }

  public async shareFile(name: string): Promise<string> {
    await this.openFileActions(name);

    const responsePromise = this.page.waitForResponse((response) =>
      response.url().includes('/rpc/objects/generateShareUrl')
    );

    await this.page.getByRole('menu').getByText('Share', { exact: true }).click();

    const dialog = this.page.getByRole('dialog', { name: 'Share Object' });

    await dialog.waitFor({ state: 'visible' });
    await responsePromise;

    const urlInput = dialog.getByRole('textbox').first();
    const url = await urlInput.inputValue();

    await this.page.keyboard.press('Escape');

    return url;
  }

  public async selectFiles(names: string[]): Promise<void> {
    for (const name of names) {
      await this.getRowCheckbox(name).check();
    }
  }

  public getBreadcrumb(name: string): Locator {
    return this.page.getByRole('link', { name }).first();
  }
}
