/// <reference types='vitest' />
import { defineConfig, PluginOption, withFilter } from 'vite';
import svgr from 'vite-plugin-svgr';
import { devtools } from '@tanstack/devtools-vite';
import react from '@vitejs/plugin-react';
// import { analyzer } from 'vite-bundle-analyzer';

function stripDemoModePlugin(): PluginOption {
  return {
    name: 'strip-demo',
    enforce: 'pre',
    resolveId(id) {
      if (process.env.VITE_DEMO_MODE !== 'true' && id.includes('/demo')) {
        return '\0empty-demo';
      }

      return undefined;
    },
    load(id) {
      if (id === '\0empty-demo') {
        return 'export const DemoAuthProvider = undefined;\nexport const DemoServicesProvider = undefined;';
      }

      return undefined;
    }
  };
}

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/console',
  server: {
    port: 3001,
    host: 'localhost'
  },
  preview: {
    port: 3001,
    host: 'localhost'
  },
  resolve: {
    tsconfigPaths: true
  },
  plugins: [
    react(),
    devtools(),
    withFilter(
      svgr({
        svgrOptions: {
          ref: true
        }
      }),
      { load: { id: /\.svg\?react$/ } }
    ),
    // analyzer(),
    stripDemoModePlugin()
  ],
  build: {
    rolldownOptions: {
      experimental: {
        lazyBarrel: true
      }
    },
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  define: {
    'import.meta.vitest': undefined
  }
}));
