import { defineConfig } from 'vite';
import swc from 'unplugin-swc';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,  
    
  build: {
    outDir: '../../dist/apps/campaign-backend/docs',
    lib: {
      name: 'openapi',
      fileName: 'openapi',
      entry: './src/docs/openapi.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: [/^@nestjs\/.*/, 'fs', 'path','url']
    }
  },
  plugins: [
    nxViteTsPaths(),
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        target: 'es2020',
        transform: {
          decoratorMetadata: true,
          legacyDecorator: true
        },
      }
    })
  ]
});