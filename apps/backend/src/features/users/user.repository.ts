import { eq } from 'drizzle-orm';
import { database, user } from '../../shared/db';

export class UserRepository {
  public async findByEmail(email: string) {
    const [result] = await database.select().from(user).where(eq(user.email, email));

    return result ?? null;
  }

  public async findById(id: string) {
    const [result] = await database.select().from(user).where(eq(user.id, id));

    return result ?? null;
  }
}
