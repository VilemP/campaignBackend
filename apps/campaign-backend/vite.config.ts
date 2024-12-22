/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import swc from 'unplugin-swc';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/campaign-backend',
  root: __dirname,
  plugins: [
    nxViteTsPaths(),
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        target: 'es2020',
        transform: {
          decoratorMetadata: true,
          legacyDecorator: true
        },
      }
    })
  ],
  build: {
    target: 'es2020',
    ssr: true,
    emptyOutDir: true,
    outDir: '../../dist/apps/campaign-backend',
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
  }
});