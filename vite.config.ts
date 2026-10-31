import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5001 },
  test: {
    globals: true,
    environment: 'jsdom',
    // Same origin as the fake API (src/test/handlers.ts), so requests skip CORS checks.
    environmentOptions: { jsdom: { url: 'http://localhost:5000' } },
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
