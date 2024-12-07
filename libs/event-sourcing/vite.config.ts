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
    dts({ entryRoot: 'src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
  ],
  build: {
    emptyOutDir: true,
    entry: 'src/index.ts',
    name: 'event-sourcing',
    fileName: 'index',
    formats: ['es', 'cjs'],
    external: [],
    lib: {
      entry: 'src/index.ts',
      name: 'event-sourcing',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: { external: [] },
    outDir: '../../dist/libs/event-sourcing',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/event-sourcing',
      provider: 'v8',
    },
  },
});

      provider: 'v8',
    },
  },
}); 