import { and, eq, gt, lt } from 'drizzle-orm';
import { database, Invitation, invitation, NewInvitation } from '../../shared/db';

export class InvitationRepository {
  public async create(data: NewInvitation): Promise<Invitation> {
    const [result] = await database.insert(invitation).values(data).returning();

    return result;
  }

  public async findByToken(token: string): Promise<Invitation | undefined> {
    const [result] = await database.select().from(invitation).where(eq(invitation.token, token));

    return result;
  }

  public async findValidByToken(token: string): Promise<Invitation | undefined> {
    const [result] = await database
      .select()
      .from(invitation)
      .where(and(eq(invitation.token, token), gt(invitation.expiresAt, new Date())));

    return result;
  }

  public async findByEmail(email: string): Promise<Invitation | undefined> {
    const [result] = await database.select().from(invitation).where(eq(invitation.email, email));

    return result;
  }

  public async findValidByEmail(email: string): Promise<Invitation | undefined> {
    const [result] = await database
      .select()
      .from(invitation)
      .where(and(eq(invitation.email, email), gt(invitation.expiresAt, new Date())));

    return result;
  }

  public async getAll(): Promise<Invitation[]> {
    return database.select().from(invitation);
  }

  public async delete(id: string): Promise<void> {
    await database.delete(invitation).where(eq(invitation.id, id));
  }

  public async deleteByToken(token: string): Promise<void> {
    await database.delete(invitation).where(eq(invitation.token, token));
  }

  public async deleteExpired(): Promise<void> {
    await database.delete(invitation).where(lt(invitation.expiresAt, new Date()));
  }
}
