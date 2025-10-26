import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/main.js',
      preserveEntrySignatures: true,
      output: {
        entryFileNames: 'home-mfe.js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        format: 'system',
      },
    },
  },
  base: "/",
  server: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["X-Requested-With", "content-type", "Authorization"],
    },
  },
  preview: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: '/src',
        },
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
});
