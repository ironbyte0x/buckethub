import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { UserRole } from '@buckethub/core';
import { TRUSTED_ORIGINS } from './constants';
import { environment } from './environment';
import { database } from './shared/db';
import { Mailer } from './shared/email';

export type Auth = ReturnType<typeof createAuth>;

export const createAuth = (mailer: Mailer) =>
  betterAuth({
    baseURL: environment.BASE_URL,
    trustedOrigins: TRUSTED_ORIGINS,
    secret: environment.AUTH_SECRET,
    database: drizzleAdapter(database, {
      provider: 'sqlite'
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      requireEmailVerification: true,
      password: {
        hash: (password) => Bun.password.hash(password, { algorithm: 'argon2id' }),
        verify: ({ password, hash }) => Bun.password.verify(password, hash)
      },
      sendResetPassword: async ({ user, url }) => {
        // Avoid awaiting the email sending to prevent timing attacks
        void mailer.sendResetPasswordEmail({
          to: user.email,
          resetUrl: url
        });
      }
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        void mailer.sendEmailVerificationEmail({
          to: user.email,
          verificationUrl: url
        });
      }
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
        strategy: 'jwe'
      }
    },
    user: {
      changeEmail: {
        enabled: true,
        updateEmailWithoutVerification: false
      }
    },
    plugins: [
      admin({
        defaultRole: 'user',
        role: [UserRole.Admin, UserRole.User]
      })
    ]
  });
