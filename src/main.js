import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.scss'
import { loadConfig, getSiteInfo } from './utils/config'
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
  // 加载配置
  await loadConfig()
  const siteInfo = getSiteInfo()
  
  // 更新页面title
  if (siteInfo.title) {
    document.title = siteInfo.title
    const titleElement = document.getElementById('page-title')
    if (titleElement) {
      titleElement.textContent = siteInfo.title
    }
  }
  
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

// 启动应用
initApp() 