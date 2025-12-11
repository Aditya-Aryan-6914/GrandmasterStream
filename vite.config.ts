import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Sets the base path for assets to match the GitHub Pages repository name
  base: '/GrandmasterStream/', 
  define: {
    // Prevents "process is not defined" errors in browser if strict mode is on
    'process.env': process.env
  }
});