import { createAuthClient } from 'better-auth/react';
import { authClientOptions } from './config';

export const authClient = createAuthClient(authClientOptions);

export type AuthClient = typeof authClient;
