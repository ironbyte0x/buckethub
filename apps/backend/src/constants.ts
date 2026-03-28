import { environment } from './environment';

export const TRUSTED_ORIGINS =
  process.env.NODE_ENV === 'production' ? [environment.BASE_URL] : ['http://localhost:3001'];
