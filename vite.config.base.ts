import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    angular(),
    nxViteTsPaths()
  ],
  resolve: {
    alias: {
      '@campaign-platform': resolve(__dirname, './campaign-platform/src'),
      '@ad-distribution': resolve(__dirname, './domains/ad-distribution/src'),
      '@supply-shaping': resolve(__dirname, './domains/supply-shaping/src'),
      '@forecasting': resolve(__dirname, './domains/forecasting/src'),
      '@shared-lbs': resolve(__dirname, './shared/lbs/src')
    }
  }
});