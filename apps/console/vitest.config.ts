import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const sharedResolve = {
  alias: {
    '@/': path.resolve(__dirname, 'src') + '/'
  },
  conditions: ['@buckethub/source']
};

export default defineConfig(() => ({
  resolve: sharedResolve,
  test: {
    name: 'console',
    watch: false,
    globals: false,
    projects: [
      {
        resolve: sharedResolve,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.spec.{ts,tsx}'],
          exclude: ['src/**/*.browser.spec.{ts,tsx}'],
          includeSource: ['src/**/*.{ts,tsx}']
        }
      },
      {
        resolve: sharedResolve,
        test: {
          name: 'browser',
          environment: 'node',
          include: ['src/**/*.browser.spec.{ts,tsx}'],
          includeSource: ['src/**/*.{ts,tsx}'],
          exclude: ['src/**/!(*.browser).spec.{ts,tsx}'],
          setupFiles: ['src/test/browser/setup.ts'],
          browser: {
            provider: playwright(),
            enabled: true,
            instances: [
              {
                browser: 'chromium' as const,
                context: {
                  viewport: { width: 1280, height: 720 }
                }
              }
            ]
          }
        }
      }
    ]
  }
}));
