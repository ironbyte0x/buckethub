import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { Duration, UserRole } from '@buckethub/core';
import { ORPCError } from '@orpc/server';
import { Auth } from '../../auth';
import { environment } from '../../environment';
import { database, user } from '../../shared/db';
import type { Mailer } from '../../shared/email';
import type { UserRepository } from '../users';
import type { InvitationRepository } from './invitation.repository';

export class InvitationService {
  constructor(
    private readonly auth: Auth,
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly mailer: Mailer
  ) {}

  public async sendInvitation(input: {
    email: string;
    invitedById: string;
  }): Promise<{ id: string }> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'User with this email already exists'
      });
    }

    const existingInvitation = await this.invitationRepository.findValidByEmail(input.email);

    if (existingInvitation) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Invitation already sent to this email'
      });
    }

    const inviter = await this.userRepository.findById(input.invitedById);

    if (!inviter) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Inviter not found'
      });
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + Duration.inDays(1).toMilliseconds());

    const invitation = await this.invitationRepository.create({
      id: randomUUID(),
      email: input.email,
      token,
      invitedById: input.invitedById,
      expiresAt
    });

    try {
      const inviteUrl = `${environment.BASE_URL}/accept-invitation#token=${token}`;

      await this.mailer.sendInvitationEmail({
        to: input.email,
        inviteUrl,
        invitedByName: inviter.name
      });
    } catch (error) {
      await this.invitationRepository.delete(invitation.id);
      throw error;
    }

    return { id: invitation.id };
  }

  public async acceptInvitation(input: {
    token: string;
    name: string;
    password: string;
  }): Promise<void> {
    const invitation = await this.invitationRepository.findValidByToken(input.token);

    if (!invitation) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Invalid or expired invitation'
      });
    }

    const { user: createdUser } = await this.auth.api.createUser({
      body: {
        email: invitation.email,
        password: input.password,
        name: input.name,
        role: UserRole.User
      }
    });

    await database.update(user).set({ emailVerified: true }).where(eq(user.id, createdUser.id));
    await this.invitationRepository.deleteByToken(input.token);
  }

  public async getInvitationByToken(token: string): Promise<{ email: string } | null> {
    const invitation = await this.invitationRepository.findValidByToken(token);

    if (!invitation) {
      return null;
    }

    return { email: invitation.email };
  }

  public async revokeInvitation(id: string): Promise<void> {
    await this.invitationRepository.delete(id);
  }

  public async listInvitations(): Promise<
    Array<{
      id: string;
      email: string;
      createdAt: Date;
      expiresAt: Date;
    }>
  > {
    const invitations = await this.invitationRepository.getAll();

    return invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt
    }));
  }
}
