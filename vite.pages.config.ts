import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const pagesBasePath = '/life-memory-detective/';

/**
 * Pages-only build transform. The sealed question data keeps its original
 * offline-compatible paths; this build injects Vite's project-site base URL
 * without changing application source or the standalone build.
 */
const pagesQuestionAssetBase = {
  name: 'pages-question-asset-base',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    const normalizedId = id.replaceAll('\\', '/');
    if (!normalizedId.endsWith('/src/data/questions.ts')) {
      return null;
    }

    const transformedCode = code
      .replaceAll("'/assets/questions/", "import.meta.env.BASE_URL + 'assets/questions/")
      .replaceAll('"/assets/questions/', 'import.meta.env.BASE_URL + "assets/questions/');

    return transformedCode === code ? null : {code: transformedCode, map: null};
  },
};

export default defineConfig({
  base: pagesBasePath,
  plugins: [pagesQuestionAssetBase, react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
