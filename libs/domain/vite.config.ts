/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/domain',
  
  plugins: [nxViteTsPaths()],

  // Configuration for vitest
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/domain',
      provider: 'v8'
    }
  },

  // Resolve paths and aliases
  resolve: {
    alias: {
      '@domain': join(__dirname, 'src')
    }
  }
});