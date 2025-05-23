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
        main: path.resolve(__dirname, 'src/main.js'),
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info.pop();
          
          if (ext === 'css') {
            return `assets/css/main-[hash].css`;
          }
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            if (assetInfo.name.includes('/')) {
              return `assets/${assetInfo.name}`;
            }
            return `assets/images/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
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
