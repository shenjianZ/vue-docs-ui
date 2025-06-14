import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import removeConsole from 'vite-plugin-remove-console'
import { getBuildConfig } from './build.config.js'

export default defineConfig(({ command, mode }) => {
  const plugins = [vue()]
  const config = getBuildConfig(mode)
  
  // 根据配置决定是否移除 console
  if (command === 'build' && config.removeConsole) {
    plugins.push(
      removeConsole({
        includes: config.consoleIncludes,
        excludes: config.excludeFiles,
      })
    )
  }
  
  return {
    plugins,
    base: process.env.GITHUB_PAGES === 'true' ? '/vue-docs-ui/' : '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      open: true,
      fs: {
        // 允许访问src目录下的文件
        allow: ['..', '.'],
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
        },
      },
    },
    // 确保yaml文件被正确处理
    assetsInclude: ['**/*.yaml', '**/*.yml'],
  }
}) 