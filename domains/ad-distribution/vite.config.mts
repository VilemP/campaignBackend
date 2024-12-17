/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

// Import our federation config
import { remoteConfigs, getSharedConfig } from '../../module.federation.config';

// Read package.json for shared dependencies
import * as packageJson from '../../package.json';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/ad-distribution',
  publicDir: 'public',
  base: '/',
  plugins: [
    nxViteTsPaths(),
    federation({
      ...remoteConfigs['ad-distribution'],
      shared: getSharedConfig(packageJson)
    }),
    angular()
  ],
  resolve: {
    alias: {
      '@ad-distribution': resolve(__dirname, './src')
    },
    mainFields: ['module']
  },
  server: {
    port: 4201,
    strictPort: true,
    fs: {
      allow: ['..']
    }
  },
  preview: {
    port: 4201,
    strictPort: true
  },
  build: {
    target: 'esnext',
    outDir: resolve(__dirname, '../../dist/apps/ad-distribution'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  }
});
