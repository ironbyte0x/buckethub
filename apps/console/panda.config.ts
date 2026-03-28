import { designSystem, isomorphicPlugin } from '@buckethub/ui';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  presets: [designSystem],
  preflight: true,
  jsxFramework: 'react',
  jsxStyleProps: 'minimal',
  shorthands: false,
  syntax: 'object-literal',
  importMap: '@buckethub/styled-system',
  lightningcss: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}', '../../libs/ui/src/**/*.{js,jsx,ts,tsx}'],
  plugins: [isomorphicPlugin()],
  outExtension: 'js',
  exclude: [],
  outdir: '../../libs/styled-system/dist'
});
