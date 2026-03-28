import { expect, test } from './fixture';
import { AddBucketPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('Add Bucket Flow', () => {
  test('admin can add a bucket through new MinIO connection when no buckets exist', async ({
    page,
    testDatabase,
    s3MockEndpoint
  }) => {
    const signInPage = new SignInPage(page);
    const addBucketPage = new AddBucketPage(page);
    const { email, password } = getAdminCredentials();

    const connectionLabel = `test-minio-${Date.now()}`;

    const existingBuckets = await testDatabase['db'].execute({
      sql: 'SELECT id, name, connection_id, created_at FROM bucket',
      args: []
    });

    const existingPermissions = await testDatabase['db'].execute({
      sql: 'SELECT bucket_id, user_id, permission FROM bucket_permission',
      args: []
    });

    await testDatabase['db'].execute({ sql: 'DELETE FROM bucket_permission', args: [] });
    await testDatabase['db'].execute({ sql: 'DELETE FROM bucket', args: [] });

    const failedResponses: { url: string; status: number; body: string }[] = [];

    try {
      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(2000);

      page.on('response', async (response) => {
        if (response.url().includes('/rpc') && response.status() >= 400) {
          let body: string;

          try {
            body = await response.text();
          } catch {
            body = 'Could not read body';
          }

          failedResponses.push({
            url: response.url(),
            status: response.status(),
            body
          });
        }
      });

      await addBucketPage.openDialog();
      await addBucketPage.selectNewConnection();

      await addBucketPage.fillConnection({
        label: connectionLabel,
        accessKey: 'test-access-key',
        secretKey: 'test-secret-key',
        endpoint: s3MockEndpoint
      });

      await addBucketPage.waitForBucketList();

      const firstCheckbox = page.getByRole('checkbox').first();

      await firstCheckbox.click();

      await addBucketPage.clickAdd();

      await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible({ timeout: 15000 });

      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(3000);

      expect(
        failedResponses.filter((r) => r.status === 404),
        `Expected no 404 responses during bucket creation flow`
      ).toHaveLength(0);
    } finally {
      const connectionResult = await testDatabase['db'].execute({
        sql: 'SELECT id FROM connection WHERE label = ?',
        args: [connectionLabel]
      });

      // eslint-disable-next-line playwright/no-conditional-in-test
      if (connectionResult.rows.length > 0) {
        const connectionId = connectionResult.rows[0].id as string;

        await testDatabase.deleteTestConnection(connectionId);
      }

      await testDatabase['db'].execute({
        sql: 'DELETE FROM bucket WHERE name NOT IN (SELECT name FROM bucket WHERE 0)',
        args: []
      });

      for (const row of existingBuckets.rows) {
        await testDatabase['db'].execute({
          sql: 'INSERT OR IGNORE INTO bucket (id, connection_id, name, created_at) VALUES (?, ?, ?, ?)',
          args: [row.id, row.connection_id, row.name, row.created_at]
        });
      }

      for (const row of existingPermissions.rows) {
        await testDatabase['db'].execute({
          sql: 'INSERT OR IGNORE INTO bucket_permission (bucket_id, user_id, permission) VALUES (?, ?, ?)',
          args: [row.bucket_id, row.user_id, row.permission]
        });
      }
    }
  });
});
