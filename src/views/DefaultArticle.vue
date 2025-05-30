<template>
  <div class="default-article">
    <!-- 面包屑导航 -->
    <nav v-if="breadcrumbs.length > 0" class="breadcrumb">
      <router-link to="/">首页</router-link>
      <span v-for="(crumb, index) in breadcrumbs" :key="index">
        <span class="separator"> / </span>
        <span v-if="index === breadcrumbs.length - 1" class="current">{{ crumb }}</span>
        <router-link v-else :to="getBreadcrumbLink(index)">{{ crumb }}</router-link>
      </span>
    </nav>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在加载内容...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <h2>⚠️ 加载失败</h2>
      <p>{{ error }}</p>
      <button @click="loadContent" class="retry-btn">重试</button>
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
          <div class="nav-label">上一页</div>
          <div class="nav-title">{{ prevPage.text }}</div>
        </div>
      </router-link>
      
      <router-link 
        v-if="nextPage" 
        :to="nextPage.link"
        class="nav-link next"
      >
        <div class="nav-content">
          <div class="nav-label">下一页</div>
          <div class="nav-title">{{ nextPage.text }}</div>
        </div>
        <span class="nav-arrow">→</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import type { DocsConfig, SidebarSection } from '../types'

interface Props {
  config?: DocsConfig
}

const props = defineProps<Props>()
const route = useRoute()
const injectedConfig = inject<DocsConfig>('docsConfig')
const updateTocHeaders = inject<(headers: any[]) => void>('updateTocHeaders')
const config = props.config || injectedConfig

const markdownContent = ref('')
const loading = ref(true)
const error = ref('')

// 计算面包屑导航
const breadcrumbs = computed(() => {
  const path = route.path
  const parts = path.split('/').filter(Boolean)
  return parts.map(part => {
    // 简单的标题转换，可以根据需要优化
    return part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  })
})

function getBreadcrumbLink(index: number) {
  const path = route.path
  const parts = path.split('/').filter(Boolean)
  return '/' + parts.slice(0, index + 1).join('/')
}

// 获取上一页和下一页
const pageNavigation = computed(() => {
  if (!config?.sidebar) return { prevPage: null, nextPage: null }
  
  const allPages: any[] = []
  
  function collectPages(sections: SidebarSection[], parentPath = '') {
    sections.forEach(section => {
      if (section.link) {
        allPages.push({
          text: section.text,
          link: section.link
        })
      }
      if (section.children) {
        collectPages(section.children, section.link || parentPath)
      }
    })
  }
  
  collectPages(config.sidebar)
  
  const currentIndex = allPages.findIndex(page => page.link === route.path)
  
  return {
    prevPage: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    nextPage: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null
  }
})

const prevPage = computed(() => pageNavigation.value.prevPage)
const nextPage = computed(() => pageNavigation.value.nextPage)

async function loadContent() {
  loading.value = true
  error.value = ''
  
  try {
    const path = route.path
    const response = await fetch(`/docs${path}.md`)
    
    if (response.ok) {
      markdownContent.value = await response.text()
    } else if (response.status === 404) {
      // 如果没有找到对应的md文件，尝试生成默认内容
      const pageTitle = route.meta?.title || breadcrumbs.value[breadcrumbs.value.length - 1] || '页面'
      markdownContent.value = `# ${pageTitle}\n\n此页面的内容正在编写中...\n\n请稍后查看更新。`
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (err) {
    console.error('加载Markdown内容失败:', err)
    error.value = err instanceof Error ? err.message : '未知错误'
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

// 监听路由变化，重新加载内容
watch(() => route.path, () => {
  loadContent()
}, { immediate: true })

onMounted(() => {
  if (!markdownContent.value) {
    loadContent()
  }
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
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color, #e2e8f0);
    border-top: 4px solid var(--primary-color, #3b82f6);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  p {
    color: var(--text-color-light, #64748b);
    margin: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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