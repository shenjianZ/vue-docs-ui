import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 使用包含编译器的Vue版本以支持运行时模板编译
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 3000,
    open: true,
    // 配置响应头，确保所有文件都使用UTF-8编码
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        
        // 为不同文件类型设置正确的Content-Type和charset
        if (url.match(/\.md$/)) {
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        } else if (url.match(/\.(yaml|yml)$/)) {
          res.setHeader('Content-Type', 'text/yaml; charset=utf-8')
        } else if (url.match(/\.json$/)) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
        } else if (url.match(/\.js$/)) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        } else if (url.match(/\.ts$/)) {
          res.setHeader('Content-Type', 'text/typescript; charset=utf-8')
        }
        
        next()
      })
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}) 