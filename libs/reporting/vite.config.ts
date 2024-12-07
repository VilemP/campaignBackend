import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
      entry: join(__dirname, 'src/index.ts'),
      name: 'reporting',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: []
    },
    outDir: '../../dist/libs/reporting',
    reportCompressedSize: true
  }
});