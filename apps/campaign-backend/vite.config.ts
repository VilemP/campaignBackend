/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/campaign-backend',
  root: __dirname,
  plugins: [nxViteTsPaths()],
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
  },  
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { 
        decorators: true 
      },
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true
        }
      }
    }

  }
});