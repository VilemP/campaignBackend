/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: '../../node_modules/.vite/campaign-backend',
  plugins: [nxViteTsPaths()],
  build: {
    target: 'es2020',
    ssr: true,
    rollupOptions: {
      input: join(__dirname, 'src/main.ts'),
      external: ['express'],
      output: {
        format: 'module',  // More explicit ESM
        entryFileNames: '[name].mjs',  // .mjs extension for clarity
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