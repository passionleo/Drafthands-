import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify('pk_live_471bce6179279093b5f31fcc7e0a099210aa72c1'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: false,
  },
});
