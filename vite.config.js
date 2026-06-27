import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Absolute imports: import X from '@/components/...'  OR  import X from 'components/...'
        '@': path.resolve(__dirname, './src'),
        components: path.resolve(__dirname, './src/components'),
        features: path.resolve(__dirname, './src/features'),
        hooks: path.resolve(__dirname, './src/hooks'),
        services: path.resolve(__dirname, './src/services'),
        context: path.resolve(__dirname, './src/context'),
        routes: path.resolve(__dirname, './src/routes'),
        constants: path.resolve(__dirname, './src/constants'),
        utils: path.resolve(__dirname, './src/utils'),
        assets: path.resolve(__dirname, './src/assets'),
        styles: path.resolve(__dirname, './src/styles'),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'https://ebhguaykmc.execute-api.ap-southeast-1.amazonaws.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
