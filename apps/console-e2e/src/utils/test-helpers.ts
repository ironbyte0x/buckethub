import { getE2EConfig } from './e2e-config';

export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `test-${timestamp}-${random}@example.com`;
}

export function getAdminCredentials(): { email: string; password: string } {
  try {
    const config = getE2EConfig();

    return { email: config.adminEmail, password: config.adminPassword };
  } catch {
    const email = process.env['ADMIN_EMAIL'];
    const password = process.env['ADMIN_PASSWORD'];

    if (email && password) {
      return { email, password };
    }

    throw new Error(
      'Admin credentials not available. Ensure global-setup ran or set ADMIN_EMAIL/ADMIN_PASSWORD env vars.'
    );
  }
}
