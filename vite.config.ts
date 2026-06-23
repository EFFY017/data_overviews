import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 部署在 /data_overviews/ 子路径下；本地 dev / preview 同样适用。
export default defineConfig({
  base: '/data_overviews/',
  plugins: [react()],
});
