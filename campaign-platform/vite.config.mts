/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';
import path, { resolve } from 'path';

// Import our federation config
import { hostConfig, getSharedConfig } from '../module.federation.config';


// Read package.json for shared dependencies
import * as packageJson from '../package.json';

const paths = {
  workspaceRoot: path.resolve(__dirname, '../'),
  projectRoot: __dirname
};


export default defineConfig({
  appType: 'spa',
  root: resolve(paths.projectRoot, 'src'), 
  cacheDir: resolve(paths.workspaceRoot, 'node_modules/.vite/campaign-platform'),
  publicDir: 'src/public',
  base: '/',
  plugins: [
    angular(),
    federation({
      ...hostConfig,
      shared: getSharedConfig(packageJson)
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md'])
  ],
  build: {
    target: 'esnext',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(paths.projectRoot, 'src/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@campaign-platform': resolve(paths.projectRoot, 'src')
    },
    mainFields: ['module']
  },
  server: {
    port: 4200,
    strictPort: true,
    fs: {
      allow: ['..']
    }
  },
  preview: {
    port: 4200,
    strictPort: true
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    cache: {
      dir: '../node_modules/.vitest'
    }
  }
});
