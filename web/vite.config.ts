import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/cascade/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      target: path.resolve(__dirname, '../target'),
      buffer: 'buffer/',
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
});
