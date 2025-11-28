import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['lucide-react', 'framer-motion', 'clsx', 'tailwind-merge'],
            'data-vendor': ['@supabase/supabase-js'],
            'charts': ['recharts'],
            '3d': ['@react-three/fiber', 'three', '@shadergradient/react'],
            'markdown': ['react-markdown'],
            'validation': ['zod']
          }
        }
      }
    }
  };
});
