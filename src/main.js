import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.scss'
import { loadConfig, getSiteInfo, loadAllConfigs, updatePageMeta } from './utils/config'
import { loadAIConfig } from './config/ai'
import { i18n } from './locales/index.js'
import './utils/debug'

// 导入页面组件
import Home from './pages/Home.vue'
import Chapter from './pages/Chapter.vue'
import Article from './pages/Article.vue'

// 配置路由
const routes = [
  { path: '/', redirect: '/chapter1/ai-basics' },
  { path: '/chapter1', redirect: '/chapter1/ai-basics' },
  { path: '/chapter1/:article', component: Article },
  { path: '/chapter2/:article', component: Article },
  { path: '/chapter3/:article', component: Article },
  // 兼容旧的路由格式
  { path: '/books', redirect: '/chapter1/ai-basics' },
  { path: '/books/:chapter', component: Chapter },
  { path: '/books/:chapter/:article', component: Article },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 初始化应用
async function initApp() {
  try {
    // 加载所有配置（包括AI配置）
    await loadAllConfigs()
    const siteInfo = getSiteInfo()
    
    // 更新页面meta信息
    updatePageMeta(siteInfo)
    
    const app = createApp(App)
    app.use(router)
    app.use(i18n)
    app.mount('#app')
    
    console.log('✅ 应用初始化完成，AI功能已就绪')
  } catch (error) {
    console.error('❌ 应用初始化失败:', error)
    // 即使配置加载失败，也继续启动应用
    const app = createApp(App)
    app.use(router)
    app.use(i18n)
    app.mount('#app')
  }
}

// 启动应用
initApp() 