import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { contentMediaPlugin } from './src/cms/media-plugin';
import { localCmsPlugin } from './src/cms/plugin';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [localCmsPlugin(), contentMediaPlugin()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
