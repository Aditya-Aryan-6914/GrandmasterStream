import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Sets the base path for assets to match the GitHub Pages repository name
  base: '/GrandmasterStream/', 
  define: {
    // Only include specific environment variables needed by the app
    // NEVER expose all of process.env as it may contain secrets
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  }
});