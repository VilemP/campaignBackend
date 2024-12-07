import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: '../../node_modules/.vite/libs/cqrs',
  plugins: [
    nxViteTsPaths(),
    dts({ 
      entryRoot: 'src', 
      tsconfigPath: join(__dirname, 'tsconfig.lib.json')
    })
  ],
  build: {
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      name: 'cqrs',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: []
    },
    outDir: '../../dist/libs/cqrs',
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
      reportsDirectory: '../../coverage/libs/cqrs',
      provider: 'v8'
    }
  }
});