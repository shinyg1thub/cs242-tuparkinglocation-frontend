import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,             // รองรับการเข้าถึงจาก Docker container
        port: 5173,
        proxy: {
            '/api': {
                // ถ้ารันใน Docker → ใช้ชื่อ service "backend"
                // ถ้ารันใน Local  → ใช้ 127.0.0.1:5000
                target: process.env.VITE_API_URL || 'http://127.0.0.1:5000',
                changeOrigin: true,
            },
        },
    },
})