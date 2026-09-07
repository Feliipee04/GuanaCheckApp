import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base so GitHub Pages works automatically on subpaths
  base: './',
  server: {
    port: 3000,
    open: true
  }
});
