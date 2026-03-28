import { expect, test } from './fixture';
import { FileBrowserPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('File Operations', () => {
  test('can upload a file and see it in the list', async ({
    page,
    testBucketWithFiles,
    testFilePath
  }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.uploadFile(testFilePath);

    await expect(fileBrowser.getFileRow('test-upload.txt')).toBeVisible();
  });

  test('can create a new folder', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    const folderName = `test-folder-${Date.now()}`;

    await fileBrowser.createFolder(folderName);

    // The "Create" button navigates into the new folder path
    await expect(page).toHaveURL(new RegExp(`${folderName}%2F`), { timeout: 10000 });
  });

  test('can navigate into a folder and back', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.clickFolder('subfolder');
    await expect(fileBrowser.getFileRow('nested-file.txt')).toBeVisible();

    await fileBrowser.getBreadcrumb(testBucketWithFiles.bucketName).click();
    await expect(fileBrowser.getFileRow('test-file-1.txt')).toBeVisible();
    await expect(fileBrowser.getFileRow('test-file-2.txt')).toBeVisible();
  });

  test('can rename a file', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.renameFile('test-file-1.txt', 'renamed-file.txt');

    await expect(fileBrowser.getFileRow('renamed-file.txt')).toBeVisible();
    await expect(fileBrowser.getFileRow('test-file-1.txt')).toBeHidden();
  });

  test('can delete a file', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.deleteFile('test-file-2.txt');

    await expect(fileBrowser.getFileRow('test-file-2.txt')).toBeHidden();
  });

  test('can generate a share URL', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();
    await expect(fileBrowser.getFileRow('test-file-1.txt')).toBeVisible({ timeout: 15000 });

    const shareUrl = await fileBrowser.shareFile('test-file-1.txt');

    expect(shareUrl).toBeTruthy();
    expect(shareUrl).toContain('http');
  });

  test('can view file details', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.clickFile('test-file-1.txt');

    await expect(page.getByText('Object Details')).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
  });

  test('can select multiple files and batch delete', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.selectFiles(['test-file-1.txt', 'test-file-2.txt']);

    const bulkDeleteButton = page.getByRole('button', { name: 'Delete', exact: true });

    await bulkDeleteButton.click();

    const confirmDeleteButton = page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Delete' });

    await confirmDeleteButton.click();

    await expect(fileBrowser.getFileRow('test-file-1.txt')).toBeHidden();
    await expect(fileBrowser.getFileRow('test-file-2.txt')).toBeHidden();
  });

  test('can search for objects by name', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.searchInput.fill('subfolder');

    await expect(fileBrowser.getFolderRow('subfolder')).toBeVisible();
    await expect(fileBrowser.getFileRow('test-file-1.txt')).toBeHidden();
  });

  test('shows no results for non-matching search', async ({ page, testBucketWithFiles }) => {
    const signInPage = new SignInPage(page);
    const fileBrowser = new FileBrowserPage(page);
    const { email, password } = getAdminCredentials();

    await signInPage.goto();
    await signInPage.signInAndWaitForNavigation(email, password);

    await fileBrowser.goto(testBucketWithFiles.bucketId);
    await expect(fileBrowser.objectsTable).toBeVisible();

    await fileBrowser.searchInput.fill('nonexistent-file-xyz');

    await expect(page.getByText('No objects found')).toBeVisible();
  });
});
