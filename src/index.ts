import type { App } from 'vue'
import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import DocsLayout from './components/DocsLayout.vue'
import DefaultHome from './views/DefaultHome.vue'
import DefaultArticle from './views/DefaultArticle.vue'
import HeaderNav from './components/HeaderNav.vue'
import SidebarNav from './components/SidebarNav.vue'
import TableOfContents from './components/TableOfContents.vue'
import MarkdownRenderer from './components/MarkdownRenderer.vue'

// 导入工具函数
import { loadConfig, generateRoutesFromSidebar, getNormalizedSidebar, getNormalizedNavbar } from './utils/index'

// 导入样式
import './styles/main.scss'

// 导入类型定义
export type { DocsConfig, NavItem, SidebarSection, ThemeConfig } from './types'

// 导出组件（供高级用法使用）
export {
  DocsLayout,
  HeaderNav,
  SidebarNav,
  TableOfContents,
  MarkdownRenderer,
  DefaultHome,
  DefaultArticle
}

// 导出工具函数
export {
  loadConfig,
  generateRoutesFromSidebar,
  getNormalizedSidebar,
  getNormalizedNavbar
}

// 简化的应用创建函数 - 开箱即用
export async function createDocsApp(options: {
  configPath?: string
  el?: string
  customComponents?: {
    home?: any
    article?: any
  }
} = {}) {
  const {
    configPath = '/config/site.yaml',
    el = '#app',
    customComponents = {}
  } = options

  try {
    // 检查目标元素是否存在
    const targetElement = document.querySelector(el)
    if (!targetElement) {
      throw new Error(`目标元素 "${el}" 不存在，请确保DOM已加载完成`)
    }

    // 清空目标元素，避免重复挂载
    targetElement.innerHTML = ''

    // 加载配置
    console.log('Loading config from:', configPath)
    const config = await loadConfig(configPath)
    console.log('Config loaded:', config)
    
    // 创建路由
    const routes = [
      {
        path: '/',
        name: 'Home',
        component: customComponents.home || DefaultHome,
        props: { config }
      },
      ...generateRoutesFromSidebar(config.sidebar, customComponents.article || DefaultArticle)
    ]

    const router = createRouter({
      history: createWebHistory(),
      routes
    })

    // 创建Vue应用
    const app = createApp({
      render() {
        return h(DocsLayout, { 
          config: config,
          showToc: true 
        })
      },
      setup() {
        return { config }
      }
    })

    // 注册全局组件
    app.component('DocsLayout', DocsLayout)
    app.component('HeaderNav', HeaderNav)
    app.component('SidebarNav', SidebarNav)
    app.component('TableOfContents', TableOfContents)
    app.component('MarkdownRenderer', MarkdownRenderer)

    // 使用路由
    app.use(router)

    // 提供全局配置
    app.provide('docsConfig', config)

    // 挂载应用
    console.log('Mounting app to:', el)
    const mountedApp = app.mount(el)

    return { app, router, config, mountedApp }
  } catch (error) {
    console.error('创建文档应用失败:', error)
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    const errorStack = error instanceof Error ? error.stack : String(error)
    
    // 检查目标元素是否存在
    const targetElement = document.querySelector(el)
    if (targetElement) {
      // 显示错误信息
      const errorApp = createApp({
        render() {
          return h('div', {
            style: {
              padding: '2rem',
              textAlign: 'center',
              color: '#ef4444'
            }
          }, [
            h('h2', '❌ 加载失败'),
            h('p', errorMessage),
            h('details', [
              h('summary', '详细信息'),
              h('pre', { style: { textAlign: 'left', fontSize: '12px' } }, errorStack)
            ])
          ])
        }
      })
      
      errorApp.mount(el)
    }
    throw error
  }
}

// 高级配置选项（向后兼容）
export interface DocsUIOptions {
  config?: any
  router?: any
}

export function createDocsUI(options: DocsUIOptions = {}) {
  return {
    install(app: App) {
      // 注册全局组件
      app.component('DocsLayout', DocsLayout)
      app.component('HeaderNav', HeaderNav)
      app.component('SidebarNav', SidebarNav)
      app.component('TableOfContents', TableOfContents)
      app.component('MarkdownRenderer', MarkdownRenderer)

      // 提供配置
      if (options.config) {
        app.provide('docsConfig', options.config)
      }

      // 配置路由
      if (options.router) {
        app.use(options.router)
      }
    }
  }
}

// 默认导出 - 简化版本
export default createDocsApp 