/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/campaign-backend',
  plugins: [nxViteTsPaths()],
  build: {
    target: 'es2020',
    ssr: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.ts'),
      external: ['express'],
      output: {
        format: 'module',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name].mjs',
        assetFileNames: '[name][extname]'
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