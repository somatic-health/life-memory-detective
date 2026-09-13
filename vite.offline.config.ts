import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'path';
import { defineConfig } from 'vite';

// Build-only configuration for the standalone file:// delivery package.
// The application source and the normal web build remain unchanged.
export default defineConfig({
  plugins: [
    {
      name: 'offline-relative-assets',
      transform(code, id) {
        const normalizedId = id.replaceAll('\\', '/');
        if (normalizedId.endsWith('/src/data/questions.ts') || code.includes('/assets/questions/')) {
          return code.replaceAll('/assets/questions/', 'assets/questions/');
        }
        if (normalizedId.endsWith('/src/index.css')) {
          return code.replace(
            "font-family: 'Noto Sans TC', sans-serif;",
            "font-family: 'Noto Sans TC', 'Microsoft JhengHei', 'Microsoft YaHei', 'PingFang TC', system-ui, sans-serif;",
          );
        }
        return null;
      },
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type === 'asset' && output.fileName.endsWith('.css')) {
            const css = typeof output.source === 'string' ? output.source : new TextDecoder().decode(output.source);
            output.source = css.replaceAll(
              'font-family:Noto Sans TC,sans-serif',
              'font-family:Noto Sans TC,Microsoft JhengHei,Microsoft YaHei,PingFang TC,system-ui,sans-serif',
            );
          }
        }
      },
      writeBundle(_options, bundle) {
        const cssOutput = Object.values(bundle).find(
          (output) => output.type === 'asset' && output.fileName.endsWith('.css'),
        );
        if (cssOutput) {
          const cssPath = path.resolve(__dirname, 'standalone-offline/.build', cssOutput.fileName);
          const css = readFileSync(cssPath, 'utf8');
          writeFileSync(
            cssPath,
            css.replaceAll(
              'font-family:Noto Sans TC,sans-serif',
              'font-family:Noto Sans TC,Microsoft JhengHei,Microsoft YaHei,PingFang TC,system-ui,sans-serif',
            ),
            'utf8',
          );
        }
      },
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'standalone-offline/.build',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'LifeMemoryDetective',
      formats: ['iife'],
      fileName: () => 'app.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
