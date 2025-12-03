import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: '@astrojs/node',
  server: {
    port: 3000
  },
  vite: {
    ssr: {
      noExternal: ['@astrojs/react']
    }
  }
});
