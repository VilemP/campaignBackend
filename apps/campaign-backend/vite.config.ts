/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/campaign-backend',
  plugins: [nxViteTsPaths()],
  build: {
    target: 'node18',
    ssr: true,
    rollupOptions: {
      input: 'apps/campaign-backend/src/main.ts',
      output: {
        format: 'esm'
      }
    }
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest'
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
});