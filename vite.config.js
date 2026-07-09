import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 請將 reader-app 替換成您的 GitHub 儲存庫名稱
  base: '/reader-app/' 
})
