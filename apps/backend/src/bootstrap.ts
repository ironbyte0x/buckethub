import { count, eq } from 'drizzle-orm';
import { UserRole } from '@buckethub/core';
import { environment } from './environment';
import { auth } from './instances';
import { database, user } from './shared/db';
import { runMigrations } from './shared/db/migrate';

function getAdminCredentials() {
  const email = environment.ADMIN_EMAIL;
  const password = environment.ADMIN_PASSWORD;
  const name = environment.ADMIN_NAME;

  if (!email || !password || !name) {
    const missing = [
      !email && 'ADMIN_EMAIL',
      !password && 'ADMIN_PASSWORD',
      !name && 'ADMIN_NAME'
    ].filter(Boolean);

    throw new Error(
      `No users in database. Admin credentials required but missing: ${missing.join(', ')}`
    );
  }

  return { email, password, name };
}

async function createAdminUser() {
  const { email, password, name } = getAdminCredentials();

  const { user: createdUser } = await auth.api.createUser({
    body: { email, password, name, role: UserRole.Admin }
  });

  await database.update(user).set({ emailVerified: true }).where(eq(user.id, createdUser.id));

  console.log(`Admin user created: ${email}`);
}

async function hasUsers(): Promise<boolean> {
  const result = await database.select({ count: count() }).from(user);

  return result[0].count > 0;
}

export async function bootstrap() {
  runMigrations();

  const usersExist = await hasUsers();

  if (!usersExist) {
    await createAdminUser();
  }
}
