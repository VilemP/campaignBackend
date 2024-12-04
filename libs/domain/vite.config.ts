/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { getViteConfig } from '@nx/vite/plugins/vite-config';

export default defineConfig({
  ...getViteConfig(),
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest'
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../../coverage/libs/domain'
    }
  }
});