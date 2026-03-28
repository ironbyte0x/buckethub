import { expect, test } from './fixture';
import { AcceptInvitationPage, InvitationsPage, SignInPage } from './pages';
import { getAdminCredentials } from './utils';

test.describe('User Invitation Flow', () => {
  test.describe('Admin Invitation Management', () => {
    test('admin can send an invitation', async ({ page, testEmail }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      const invitationItem = invitationsPage.getInvitationItem(testEmail);

      await expect(invitationItem).toBeVisible();
    });

    test('admin can revoke an invitation', async ({ page, testEmail }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      await invitationsPage.revokeInvitation(testEmail);

      await expect(invitationsPage.getInvitationItem(testEmail)).toBeHidden();
    });

    test('shows error when inviting existing user email', async ({ page }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await invitationsPage.goto();
      await invitationsPage.sendInvitation(email);

      const errorMessage = page.getByText('User with this email already exists');

      await expect(errorMessage).toBeVisible();
    });

    test('shows error when inviting already invited email', async ({ page, testEmail }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);

      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      await invitationsPage.sendInvitation(testEmail);

      const errorMessage = page.getByText('Invitation already sent to this email');

      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('Accept Invitation', () => {
    test('user can accept a valid invitation', async ({ page, testEmail, mailpit }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const acceptPage = new AcceptInvitationPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);
      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      const token = await mailpit.getInvitationToken(testEmail);

      await page.context().clearCookies();

      await acceptPage.goto(token);

      const emailDisplay = acceptPage.getEmailDisplay();

      await expect(emailDisplay).toContainText(testEmail);

      await acceptPage.acceptInvitationAndWaitForRedirect('Test User', 'Password123!');

      await expect(page).toHaveURL('/sign-in');
    });

    test('user can sign in after accepting invitation', async ({ page, testEmail, mailpit }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const acceptPage = new AcceptInvitationPage(page);
      const { email, password } = getAdminCredentials();
      const newUserPassword = 'NewUserPass123!';

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);
      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      const token = await mailpit.getInvitationToken(testEmail);

      await page.context().clearCookies();
      await acceptPage.goto(token);

      await acceptPage.acceptInvitationAndWaitForRedirect('New User', newUserPassword);

      await signInPage.signInAndWaitForNavigation(testEmail, newUserPassword);

      await expect(page).not.toHaveURL(/sign-in/);
    });

    test('shows error for invalid invitation token', async ({ page }) => {
      const acceptPage = new AcceptInvitationPage(page);

      await acceptPage.goto('invalid-token-12345');

      const isInvalid = await acceptPage.isInvalidInvitation();

      expect(isInvalid).toBe(true);

      await expect(acceptPage.goToSignInButton).toBeVisible();
    });

    test('shows error for missing token', async ({ page }) => {
      await page.goto('/accept-invitation');

      const invalidMessage = page.getByText('This invitation link is invalid or has expired.');

      await expect(invalidMessage).toBeVisible();
    });

    test('shows validation error for password mismatch', async ({ page, testEmail, mailpit }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const acceptPage = new AcceptInvitationPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);
      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      const token = await mailpit.getInvitationToken(testEmail);

      await page.context().clearCookies();

      await acceptPage.goto(token);
      await acceptPage.nameInput.fill('Test User');
      await acceptPage.passwordInput.fill('Password123!');
      await acceptPage.confirmPasswordInput.fill('DifferentPassword!');
      await acceptPage.submitForm();

      const errorMessage = page.getByText('Passwords do not match');

      await expect(errorMessage).toBeVisible();
    });

    test('shows validation error for short password', async ({ page, testEmail, mailpit }) => {
      const signInPage = new SignInPage(page);
      const invitationsPage = new InvitationsPage(page);
      const acceptPage = new AcceptInvitationPage(page);
      const { email, password } = getAdminCredentials();

      await signInPage.goto();
      await signInPage.signInAndWaitForNavigation(email, password);
      await invitationsPage.goto();
      await invitationsPage.sendInvitation(testEmail);
      await invitationsPage.waitForInvitationInList(testEmail);

      const token = await mailpit.getInvitationToken(testEmail);

      await page.context().clearCookies();

      await acceptPage.goto(token);
      await acceptPage.fillForm('Test User', 'short');
      await acceptPage.submitForm();

      const errorMessage = page.getByText('Password must be at least 8 characters');

      await expect(errorMessage).toBeVisible();
    });
  });
});
