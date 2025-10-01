import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },  optimizeDeps: {
    include: ['crypto-browserify'],
  },  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 3000,
  },
  // Garantir que as variáveis de ambiente sejam expostas
  envPrefix: 'VITE_',
});
