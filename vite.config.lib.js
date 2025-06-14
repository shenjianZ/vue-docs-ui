import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import removeConsole from 'vite-plugin-remove-console'
import { getBuildConfig } from './build.config.js'

export default defineConfig(({ command, mode }) => {
  const plugins = [
    vue(),
    dts({
      include: ['src/**/*'],
      outDir: 'dist/types',
      exclude: ['src/**/*.test.*']
    })
  ]
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
    build: {
      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        name: 'VueDocsUI',
        fileName: (format) => `vue-docs-ui.${format}.js`,
        formats: ['es', 'umd']
      },
      rollupOptions: {
        external: ['vue', 'vue-router'],
        output: {
          globals: {
            vue: 'Vue',
            'vue-router': 'VueRouter'
          }
        }
      },
      cssCodeSplit: false
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js'
      },
    },
  }
}) 