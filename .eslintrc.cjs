module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname, 
      sourceType: 'module', 
    },
    plugins: ['@typescript-eslint'],
    overrides: [
      {
        files: ['src/**/*.ts'], 
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
        },
      },
    ],
  };
  