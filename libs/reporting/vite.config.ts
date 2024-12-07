import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { join } from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/libs/reporting',
  plugins: [
    nxViteTsPaths(),
    dts({ 
      entryRoot: 'src', 
      tsconfigPath: join(__dirname, 'tsconfig.lib.json')
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'reporting',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: []
    },
    outDir: '../../dist/libs/reporting',
    reportCompressedSize: true
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest'
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/reporting',
      provider: 'v8'
    }
  }
});