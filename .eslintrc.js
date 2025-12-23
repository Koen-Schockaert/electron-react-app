module exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Use TS parser
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json', // ensures type-aware linting
  },
  extends: [
    'erb', // keep ERB base config
    'plugin:@typescript-eslint/recommended', // recommended TS rules
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript', // import plugin for TS
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // TypeScript-specific
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Disable conflicting base rules
    'no-shadow': 'off',
    'no-unused-vars': 'off',

    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',

    // Import rules (optional relaxations for ERB)
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-import-module-exports': 'off',

    // Prefer default export (optional)
    'import/prefer-default-export': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
    },
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
};
