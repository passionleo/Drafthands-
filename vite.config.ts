import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const envPaystackKey = process.env.VITE_PAYSTACK_PUBLIC_KEY?.trim();
  const validPaystackKey = (envPaystackKey && envPaystackKey.startsWith('pk_'))
    ? envPaystackKey
    : 'pk_live_471bce6179279093b5f31fcc7e0a099210aa72c1';

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify(validPaystackKey),
      'process.env.VITE_PAYSTACK_PUBLIC_KEY': JSON.stringify(validPaystackKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
