import { eq } from 'drizzle-orm';
import { Theme } from '@buckethub/rpc-contract';
import { database, UserPreferences, userPreferences } from '../../shared/db';

export class ProfileRepository {
  public async getByUserId(userId: string): Promise<UserPreferences | null> {
    const [result] = await database
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    return result ?? null;
  }

  public async upsert(userId: string, theme: Theme): Promise<void> {
    await database.insert(userPreferences).values({ userId, theme }).onConflictDoUpdate({
      target: userPreferences.userId,
      set: { theme }
    });
  }
}
