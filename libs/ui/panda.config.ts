import { defineConfig } from '@pandacss/dev';
import { designSystem, isomorphicPlugin } from './src/panda';

export default defineConfig({
  presets: [designSystem],
  preflight: true,
  jsxFramework: 'react',
  jsxStyleProps: 'minimal',
  shorthands: false,
  syntax: 'object-literal',
  importMap: '@buckethub/styled-system',
  lightningcss: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [isomorphicPlugin()],
  outExtension: 'js',
  exclude: [],
  outdir: '../styled-system/dist'
});
