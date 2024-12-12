/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/event-sourcing',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({ 
      entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json')
    }),
  ],
  build: {
    outDir: '../../dist/libs/event-sourcing',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { 
      transformMixedEsModules: true
    },
    lib: {
      entry: 'src/index.ts',
      name: 'event-sourcing',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['@libs/domain', '@libs/errors']
    }
    

  }
});