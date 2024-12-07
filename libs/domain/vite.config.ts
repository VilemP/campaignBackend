import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: '../../node_modules/.vite/libs/domain',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({ 
      entryRoot: 'src', 
      tsconfigPath: join(__dirname, 'tsconfig.lib.json')
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      name: 'domain',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['@libs/errors']
    },
    outDir: '../../dist/libs/domain',
    reportCompressedSize: true,
    commonjsOptions: { 
      transformMixedEsModules: true,
      extensions: ['.js', '.ts']
    }
  }
});