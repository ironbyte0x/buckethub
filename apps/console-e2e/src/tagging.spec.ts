import { expect, test } from './fixture';
import { ConnectionsPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Tagging', () => {
  test.describe('Tag CRUD via Edit Connection', () => {
    test('admin can create a new tag via edit connection dialog', async ({
      page,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const connectionsPage = new ConnectionsPage(page);
      const { email, password } = getAdminCredentials();

      const bucketName = `test-bucket-tag-create-${Date.now()}`;
      const tagName = `test-tag-create-${Date.now()}`;

      await testDatabase.createTestBucket(bucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await connectionsPage.goto();
      await page.waitForURL('/connections');

      await connectionsPage.getEditConnectionButton(testConnection.label).click();
      await connectionsPage.editDialog.waitFor({ state: 'visible' });

      const addTagButton = connectionsPage.editDialog.getByText('Add tag', { exact: true });

      await addTagButton.click();

      const tagInput = page.getByPlaceholder('Search tags...');

      await tagInput.fill(tagName);

      const createOption = page.getByText(`Create "${tagName}"`);

      await createOption.click();

      const createTagDialog = page.getByRole('dialog').filter({ hasText: 'Create New Tag' });
      const tagNameInput = createTagDialog.getByLabel('Tag name');

      await expect(tagNameInput).toHaveValue(tagName);

      await createTagDialog.getByRole('button', { name: 'Create' }).click();

      await createTagDialog.waitFor({ state: 'hidden' });

      const saveResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/rpc/connections/update')
      );

      await connectionsPage.editSaveButton.click();

      await saveResponsePromise;

      const tag = await testDatabase.getTagByName(tagName);

      expect(tag).not.toBeNull();
      expect(tag?.name).toBe(tagName);

      await testDatabase.deleteTestTag(tagName);
    });

    test('tag appears on connection after assignment', async ({
      page,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const connectionsPage = new ConnectionsPage(page);
      const { email, password } = getAdminCredentials();

      const tagName = `test-tag-visible-${Date.now()}`;

      await testDatabase.createTestTag(tagName);
      await testDatabase.assignTagToConnection(tagName, testConnection.label);

      const bucketName = `test-bucket-tag-visible-${Date.now()}`;

      await testDatabase.createTestBucket(bucketName, testConnection.id);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await connectionsPage.goto();
      await page.waitForURL('/connections');

      const connectionAccordion = connectionsPage.getConnectionAccordion(testConnection.label);

      await expect(connectionAccordion.getByText(tagName)).toBeVisible();
    });
  });

  test.describe('Tag on Buckets', () => {
    test('tag appears on bucket after assignment', async ({
      page,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const connectionsPage = new ConnectionsPage(page);
      const { email, password } = getAdminCredentials();

      const bucketName = `test-bucket-tag-bucket-${Date.now()}`;
      const tagName = `test-tag-bucket-${Date.now()}`;

      await testDatabase.createTestBucket(bucketName, testConnection.id);
      await testDatabase.createTestTag(tagName);
      await testDatabase.assignTagToBucket(tagName, bucketName);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await connectionsPage.goto();
      await page.waitForURL('/connections');

      await connectionsPage.getConnectionHeader(testConnection.label).click();

      const bucketItem = connectionsPage.getBucketItem(bucketName);

      await expect(bucketItem).toBeVisible();

      const connectionContent = connectionsPage.getConnectionAccordion(testConnection.label);

      await expect(connectionContent.getByText(tagName)).toBeVisible();
    });

    test('admin can add tag to bucket via edit bucket dialog', async ({
      page,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const connectionsPage = new ConnectionsPage(page);
      const { email, password } = getAdminCredentials();

      const bucketName = `test-bucket-edit-tag-${Date.now()}`;
      const tagName = `test-tag-edit-bucket-${Date.now()}`;

      await testDatabase.createTestBucket(bucketName, testConnection.id);
      await testDatabase.createTestTag(tagName);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await connectionsPage.goto();
      await page.waitForURL('/connections');

      await connectionsPage.getConnectionHeader(testConnection.label).click();

      await expect(connectionsPage.getBucketItem(bucketName)).toBeVisible();

      await connectionsPage.getEditBucketButton(bucketName).click();

      const editBucketDialog = page.getByRole('dialog', { name: 'Edit Bucket' }).last();

      await editBucketDialog.waitFor({ state: 'visible' });

      // Wait for Suspense to resolve — Save button is disabled in the fallback, enabled once form loads
      await expect(editBucketDialog.getByRole('button', { name: 'Save' })).toBeEnabled();

      await editBucketDialog.getByText('Add tag', { exact: true }).click();

      const tagInput = page.getByPlaceholder('Search tags...');

      await tagInput.fill(tagName);

      const tagOption = page.getByRole('option', { name: tagName });

      await tagOption.click();

      // Close the dropdown that stays open after tag selection by clicking the dialog title
      await editBucketDialog.getByText('Edit Bucket').first().click();

      const saveResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/rpc/tags/addTagToBucket')
      );

      await editBucketDialog.getByRole('button', { name: 'Save' }).click();

      await saveResponsePromise;

      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(1000);

      await page.reload();
      await page.waitForURL('/connections');

      await connectionsPage.getConnectionHeader(testConnection.label).click();

      const bucketItem = connectionsPage.getBucketItem(bucketName);

      await expect(bucketItem).toBeVisible();

      const connectionContent = connectionsPage.getConnectionAccordion(testConnection.label);

      await expect(connectionContent.getByText(tagName)).toBeVisible();
    });
  });

  test.describe('Tag Removal', () => {
    test('removing tag from connection via edit dialog', async ({
      page,
      testDatabase,
      testConnection
    }) => {
      const signInPage = new SignInPage(page);
      const connectionsPage = new ConnectionsPage(page);
      const { email, password } = getAdminCredentials();

      const bucketName = `test-bucket-tag-remove-${Date.now()}`;
      const tagName = `test-tag-remove-${Date.now()}`;

      await testDatabase.createTestBucket(bucketName, testConnection.id);
      await testDatabase.createTestTag(tagName);
      await testDatabase.assignTagToConnection(tagName, testConnection.label);

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await connectionsPage.goto();
      await page.waitForURL('/connections');

      const connectionAccordion = connectionsPage.getConnectionAccordion(testConnection.label);

      await expect(connectionAccordion.getByText(tagName)).toBeVisible();

      await connectionsPage.getEditConnectionButton(testConnection.label).click();
      await connectionsPage.editDialog.waitFor({ state: 'visible' });

      const tagChip = connectionsPage.editDialog.getByLabel(tagName);
      const removeButton = tagChip.getByRole('button', { name: 'Remove' });

      await removeButton.click();

      const removeResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/rpc/connections/update')
      );

      await connectionsPage.editSaveButton.click();

      await removeResponsePromise;

      await expect(connectionAccordion.getByText(tagName)).toBeHidden();
    });
  });
});
