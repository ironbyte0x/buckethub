import { BetterAuthClientOptions } from 'better-auth';
import { adminClient } from 'better-auth/client/plugins';
import { environment } from '@/environment';

export const authClientOptions = {
  baseURL: environment.VITE_API_BASE_URL,
  plugins: [adminClient()],
  sessionOptions: {
    refetchInterval: 4.9 * 60
  }
} satisfies BetterAuthClientOptions;
