import * as v from 'valibot';

declare global {
  interface Window {
    __CONFIG__?: Record<string, string>;
  }
}

const runtimeConfig = window.__CONFIG__ ?? {};

const environmentSchema = v.object({
  VITE_API_BASE_URL: v.optional(v.string(), 'http://localhost:3000'),
  VITE_DEMO_MODE: v.pipe(
    v.optional(v.string(), 'false'),
    v.transform((value) => value === 'true')
  )
});

export const environment = v.parse(environmentSchema, {
  ...import.meta.env,
  ...runtimeConfig
});
