import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import react from 'eslint-plugin-react';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/test-output'
    ]
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      import: importPlugin,
      unicorn: unicorn
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['scope:lib']
            },
            {
              sourceTag: 'scope:lib',
              onlyDependOnLibsWithTags: ['scope:lib']
            },
            {
              sourceTag: 'type:frontend',
              onlyDependOnLibsWithTags: ['type:frontend', 'type:shared']
            },
            {
              sourceTag: 'type:backend',
              onlyDependOnLibsWithTags: ['type:backend', 'type:shared']
            },
            {
              sourceTag: 'type:shared',
              onlyDependOnLibsWithTags: ['type:shared']
            }
          ]
        }
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^node:', '^react', '^next', '^[a-z]', '^@?\\w', '^', '^\\.', '^\\u0000']]
        }
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'unused-imports/no-unused-imports': 'error',
      curly: ['error', 'all'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'block'
        },
        {
          blankLine: 'always',
          prev: 'block',
          next: '*'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'block-like'
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*'
        },
        {
          blankLine: 'always',
          prev: 'multiline-expression',
          next: '*'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'multiline-expression'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'return'
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['const', 'let', 'var']
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var']
        },
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*'
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive'
        }
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'off'
          }
        }
      ],
      'no-unused-expressions': [
        'error',
        {
          allowTernary: false
        }
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase'
        }
      ],
      'unicorn/prefer-switch': [
        'error',
        {
          minimumCases: 3,
          emptyDefaultCase: 'no-default-case'
        }
      ],
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            Props: true,
            props: true,
            Prop: true,
            ref: true,
            Ref: true,
            Refs: true,
            utils: true
          }
        }
      ],
      'unicorn/no-negated-condition': 'error',
      'unicorn/no-negation-in-equality-check': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/no-useless-fallback-in-spread': 'error',
      'unicorn/no-lonely-if': 'error',
      'one-var': ['error', 'never'],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'framer-motion',
              allowImportNames: [],
              message: 'Please use motion/react instead of framer-motion.'
            }
          ]
        }
      ],
      'import/no-default-export': 'error'
    }
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      react: react
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          noSortAlphabetically: true,
          reservedFirst: ['key', 'ref']
        }
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        }
      ],
      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'on',
          eventHandlerPropPrefix: 'on'
        }
      ],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: false
        }
      ],
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            'React.FC': {
              message: 'Please use React.FunctionComponent instead.',
              fixWith: 'React.FunctionComponent'
            }
          }
        }
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message: "Import of 'React' is unnecessary."
            },
            {
              name: 'framer-motion',
              allowImportNames: [],
              message: 'Please use motion/react instead of framer-motion.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.stories.*'],
    rules: {
      'import/no-default-export': 'off'
    }
  },
  {
    files: ['**/{vitest,vite,panda}.config.ts'],
    rules: {
      'import/no-default-export': 'off'
    }
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs'
    ],
    // Override or add rules here
    rules: {}
  }
];
