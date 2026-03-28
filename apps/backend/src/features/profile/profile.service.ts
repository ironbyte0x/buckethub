import { APIError } from 'better-call';
import { EmailAlreadyExistsError, Preferences, Profile, Theme } from '@buckethub/rpc-contract';
import { ORPCError } from '@orpc/server';
import { Auth } from '../../auth';
import { UserRepository } from '../users';
import { ProfileRepository } from './profile.repository';

export class ProfileService {
  constructor(
    private readonly auth: Auth,
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async getProfile(userId: string, headers: Headers): Promise<Profile> {
    const session = await this.getSession(userId, headers);

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null
    };
  }

  public async updateProfile(
    userId: string,
    data: { name?: string; email?: string; image?: string | null },
    headers: Headers
  ) {
    const session = await this.getSession(userId, headers);

    if (data.email !== undefined && data.email.toLowerCase() !== session.user.email.toLowerCase()) {
      const email = data.email.toLowerCase();
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser && existingUser.id !== userId) {
        throw new EmailAlreadyExistsError();
      }

      try {
        await this.auth.api.changeEmail({
          headers,
          body: {
            newEmail: email
          }
        });
      } catch (error) {
        if (error instanceof APIError && error.status === 'UNPROCESSABLE_ENTITY') {
          throw new EmailAlreadyExistsError();
        }

        throw error;
      }
    }

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.image !== undefined) {
      updateData.image = data.image;
    }

    if (Object.keys(updateData).length > 0) {
      await this.auth.api.updateUser({
        headers,
        body: updateData
      });
    }

    return this.getProfile(userId, headers);
  }

  public async getPreferences(userId: string): Promise<Preferences> {
    const result = await this.profileRepository.getByUserId(userId);

    if (!result) {
      return { theme: 'system' };
    }

    return { theme: result.theme as Theme };
  }

  public async updatePreferences(userId: string, data: { theme?: Theme }): Promise<Preferences> {
    if (data.theme !== undefined) {
      await this.profileRepository.upsert(userId, data.theme);
    }

    return this.getPreferences(userId);
  }

  private async getSession(userId: string, headers: Headers) {
    const session = await this.auth.api.getSession({
      headers,
      query: {
        disableCookieCache: true
      }
    });

    if (!session || session.user.id !== userId) {
      throw new ORPCError('NOT_FOUND', {
        message: 'User not found'
      });
    }

    return session;
  }
}
