/**
 * Configuration Vite pour Tailwind CSS v4.1
 * Utilise le plugin officiel @tailwindcss/vite
 */
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  publicDir: '../public',
  base: './',
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        contact: path.resolve(__dirname, 'src/contact.html'),
        app: path.resolve(__dirname, 'src/main.js'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info.pop();
          
          if (ext === 'css') {
            return `assets/css/main.css`;
          }
          
          return `assets/[name][extname]`;
        },
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
