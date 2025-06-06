<template>
  <div class="default-article">
    <!-- 面包屑导航 -->
    <nav v-if="breadcrumbs.length > 0" class="breadcrumb">
      <router-link to="/">{{ t('nav.home') }}</router-link>
      <span v-for="(crumb, index) in breadcrumbs" :key="index">
        <span class="separator"> / </span>
        <span v-if="index === breadcrumbs.length - 1" class="current">{{ crumb.title }}</span>
        <router-link v-else :to="crumb.path">{{ crumb.title }}</router-link>
      </span>
    </nav>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <p>{{ t('common.loading') }}</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <h2>⚠️ {{ t('common.error') }}</h2>
      <p>{{ error }}</p>
      <button @click="loadContent" class="retry-btn">{{ t('common.retry') }}</button>
    </div>
    
    <!-- Markdown内容 -->
    <div v-else class="article-content">
      <MarkdownRenderer 
        :content="markdownContent"
        :enable-toc="true"
        @toc-generated="onTocGenerated"
      />
    </div>
    
    <!-- 页面导航 -->
    <nav v-if="!loading && !error" class="page-nav">
      <router-link 
        v-if="prevPage" 
        :to="prevPage.link"
        class="nav-link prev"
      >
        <span class="nav-arrow">←</span>
        <div class="nav-content">
          <div class="nav-label">{{ t('common.prev') }}</div>
          <div class="nav-title">{{ prevPage.text }}</div>
        </div>
      </router-link>
      
      <router-link 
        v-if="nextPage" 
        :to="nextPage.link"
        class="nav-link next"
      >
        <div class="nav-content">
          <div class="nav-label">{{ t('common.next') }}</div>
          <div class="nav-title">{{ nextPage.text }}</div>
        </div>
        <span class="nav-arrow">→</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import type { DocsConfig, SidebarSection } from '../types'
import { getNormalizedSidebar } from '../utils'
// @ts-ignore
import { loadConfig } from '../utils/config'

interface Props {
  config?: DocsConfig
}

const props = defineProps<Props>()
const route = useRoute()
const { t } = useI18n()
const injectedConfig = inject<DocsConfig>('docsConfig')
const updateTocHeaders = inject<(headers: any[]) => void>('updateTocHeaders')

// 响应式配置
const currentConfig = ref<DocsConfig | null>(null)
const config = computed(() => currentConfig.value || props.config || injectedConfig)

const markdownContent = ref('')
const loading = ref(true)
const error = ref('')

// 计算面包屑导航 - 基于配置文件的sidebar结构
const breadcrumbs = computed(() => {
  const path = route.path
  const configToUse = config.value
  if (!configToUse?.sidebar) return []

  const normalizedSidebar = getNormalizedSidebar(configToUse)
  const crumbs: Array<{title: string, path: string}> = []

  // 递归查找当前路径在sidebar中的位置
  function findPath(sections: SidebarSection[], targetPath: string): boolean {
    for (const section of sections) {
      // 检查当前section
      if (section.link === targetPath || section.path === targetPath) {
        crumbs.push({
          title: section.text || section.title || '',
          path: section.link || section.path || ''
        })
        return true
      }

      // 检查children
      if (section.children && section.children.length > 0) {
        // 先添加父级
        const parentCrumb = {
          title: section.text || section.title || '',
          path: section.link || section.path || ''
        }
        
        // 递归查找children
        if (findPath(section.children, targetPath)) {
          // 如果在children中找到了，在最前面插入父级
          crumbs.unshift(parentCrumb)
          return true
        }
      }
    }
    return false
  }

  findPath(normalizedSidebar, path)
  return crumbs
})

// 获取上一页和下一页
const pageNavigation = computed(() => {
  if (!config.value?.sidebar) return { prevPage: null, nextPage: null }
  
  const allPages: any[] = []
  
  function collectPages(sections: SidebarSection[], parentPath = '') {
    sections.forEach(section => {
      if (section.link || section.path) {
        allPages.push({
          text: section.text || section.title,
          link: section.link || section.path
        })
      }
      if (section.children) {
        collectPages(section.children, section.link || section.path || parentPath)
      }
    })
  }
  
  collectPages(getNormalizedSidebar(config.value))
  
  const currentIndex = allPages.findIndex(page => page.link === route.path)
  
  const result = {
    prevPage: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    nextPage: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null
  }
  
  console.log('DefaultArticle: 页面导航更新', {
    currentPath: route.path,
    allPages: allPages.map(p => ({ text: p.text, link: p.link })),
    prevPage: result.prevPage,
    nextPage: result.nextPage
  })
  
  return result
})

const prevPage = computed(() => pageNavigation.value.prevPage)
const nextPage = computed(() => pageNavigation.value.nextPage)

// 初始化配置
const initConfig = async () => {
  try {
    const loadedConfig = await loadConfig()
    currentConfig.value = loadedConfig
    console.log('DefaultArticle: 配置已加载', { sidebar: currentConfig.value?.sidebar })
  } catch (err) {
    console.error('DefaultArticle: 加载配置失败:', err)
    currentConfig.value = null
  }
}

async function loadContent() {
  loading.value = true
  error.value = ''
  
  try {
    const path = route.path
    
    // 获取当前语言
    function getCurrentLanguage() {
      const saved = localStorage.getItem('language') || localStorage.getItem('vue-docs-locale')
      if (saved) {
        return saved
      }
      const browserLang = navigator.language || (navigator as any).userLanguage
      return browserLang.startsWith('zh') ? 'zh' : 'en'
    }
    
    // 根据语言构建正确的文档路径
    const currentLang = getCurrentLanguage()
    const langFolder = currentLang === 'en' ? 'en' : 'zh-cn'
    const docPath = `/docs/${langFolder}${path}.md`
    
    console.log(`尝试加载文档: ${docPath}`)
    const response = await fetch(docPath)
    
    if (response.ok) {
      markdownContent.value = await response.text()
    } else if (response.status === 404) {
      // 如果没有找到对应的md文件，尝试生成默认内容
      const pageTitle = route.meta?.title || breadcrumbs.value[breadcrumbs.value.length - 1]?.title || t('common.articleTitle')
      markdownContent.value = `# ${pageTitle}\n\n${t('common.noContent')}\n\n${t('common.loadError')}`
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (err) {
    console.error('加载Markdown内容失败:', err)
    error.value = err instanceof Error ? err.message : t('common.error')
  } finally {
    loading.value = false
  }
}

function onTocGenerated(headers: any[]) {
  // 将目录信息传递给父组件
  if (updateTocHeaders) {
    updateTocHeaders(headers)
  }
  console.log('TOC生成:', headers)
}

// 监听语言切换事件
const handleLocaleChange = () => {
  console.log('DefaultArticle: 语言切换事件触发')
  // 重新加载配置和内容
  initConfig().then(() => {
    loadContent()
  })
}

// 监听路由变化，重新加载内容
watch(() => route.path, () => {
  loadContent()
}, { immediate: false })

onMounted(async () => {
  await initConfig()
  await loadContent()
  // 监听语言切换事件
  window.addEventListener('locale-changed', handleLocaleChange)
})

onUnmounted(() => {
  window.removeEventListener('locale-changed', handleLocaleChange)
})
</script>

<style lang="scss" scoped>
.default-article {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.breadcrumb {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: var(--text-color-light, #64748b);
  
  a {
    color: var(--primary-color, #3b82f6);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .separator {
    margin: 0 0.5rem;
    color: var(--text-color-light, #64748b);
  }
  
  .current {
    color: var(--text-color, #1e293b);
    font-weight: 500;
  }
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  
  p {
    color: var(--text-color-light, #64748b);
    margin: 0;
  }
}

.error {
  text-align: center;
  padding: 4rem 2rem;
  
  h2 {
    color: var(--error-color, #ef4444);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-color-light, #64748b);
    margin-bottom: 2rem;
  }
  
  .retry-btn {
    background: var(--primary-color, #3b82f6);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    
    &:hover {
      background: var(--primary-color-dark, #2563eb);
    }
  }
}

.article-content {
  margin-bottom: 4rem;
}

.page-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color, #e2e8f0);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--bg-color-secondary, #f8fafc);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-color, #1e293b);
    transition: all 0.2s;
    min-width: 0;
    flex: 1;
    max-width: 300px;
    
    &:hover {
      border-color: var(--primary-color, #3b82f6);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &.prev {
      margin-right: auto;
    }
    
    &.next {
      margin-left: auto;
      flex-direction: row-reverse;
      
      .nav-content {
        text-align: right;
      }
    }
  }
  
  .nav-arrow {
    font-size: 1.2rem;
    color: var(--primary-color, #3b82f6);
    flex-shrink: 0;
  }
  
  .nav-content {
    min-width: 0;
    
    .nav-label {
      font-size: 0.8rem;
      color: var(--text-color-light, #64748b);
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .nav-title {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// Dark mode support
.dark {
  .nav-link {
    background: var(--bg-color-secondary, #1e293b);
    border-color: var(--border-color, #374151);
  }
}
</style> 