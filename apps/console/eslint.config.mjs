import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules/console/features/*/*'],
              message: 'Import console shared features through their public index.ts entrypoint.'
            },
            {
              group: [
                '@/modules/console/views/*/features/*',
                '@/modules/console/views/*/features/*/*'
              ],
              message:
                'View-level features are private to their owning view. Use relative imports within that view.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {}
  }
];
