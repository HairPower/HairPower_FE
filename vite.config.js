import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: 'http://54.180.120.177:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/user/, '')
      }
    }
  }
});