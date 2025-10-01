import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  // Ignore build + external folders
  {
    ignores: ['.next', 'node_modules', '.pnpm_store', 'next-env.d.ts'],
  },

  // Next.js configs
  ...compat.config({
    extends: ['next', 'next/core-web-vitals'],
    rules: {
      'react/no-unescaped-entities': [
        'error',
        { forbid: ['>', '}', '"'] }, // don't forbid apostrophes
      ],
    },
  }),

  // TypeScript recommended configs
  ...tseslint.configs.recommended,

  // Prettier: disables ESLint rules that conflict with Prettier
  ...compat.config({
    extends: ['prettier'],
  }),
];

export default config;
