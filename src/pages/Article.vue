<template>
  <div class="article-page">
    <article class="content-article">
      <!-- 面包屑导航 -->
      <nav class="breadcrumb" v-if="breadcrumb.length > 0">
        <router-link 
          v-for="(item, index) in breadcrumb" 
          :key="item.path"
          :to="item.path"
          :class="['breadcrumb-item', { active: index === breadcrumb.length - 1 }]"
        >
          {{ item.title }}
          <span v-if="index < breadcrumb.length - 1" class="breadcrumb-separator">›</span>
        </router-link>
      </nav>
      
      <!-- 文章标题 -->
      <header class="article-header">
        <h1 class="article-title">{{ articleTitle }}</h1>
      </header>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载文档...</p>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <button @click="loadArticle" class="retry-button">重试</button>
      </div>
      
      <!-- 文章内容 -->
      <div v-else class="article-content" v-html="articleContent"></div>
      
      <!-- 导航按钮 -->
      <nav class="article-nav" v-if="!loading && !error">
        <router-link 
          v-if="prevArticle" 
          :to="prevArticle.path"
          class="nav-button prev"
        >
          <span class="nav-direction">← 上一节</span>
        </router-link>
        
        <router-link 
          v-if="nextArticle" 
          :to="nextArticle.path"
          class="nav-button next"
        >
          <span class="nav-direction">下一节 →</span>
        </router-link>
      </nav>
    </article>
    
    <!-- 右侧目录 -->
    <TableOfContents :headers="tocHeaders" v-if="!loading && !error" />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { loadConfig, getBreadcrumb, getSidebarConfig } from '../utils/config'
import { loadMarkdownFile, getMarkdownPath, extractTOCFromHTML } from '../utils/markdown'
import TableOfContents from '../components/TableOfContents.vue'

export default {
  name: 'Article',
  components: {
    TableOfContents,
  },
  setup() {
    const route = useRoute()
    const articleTitle = ref('')
    const articleContent = ref('')
    const breadcrumb = ref([])
    const prevArticle = ref(null)
    const nextArticle = ref(null)
    const tocHeaders = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    // 从内容中提取标题生成目录
    const extractHeaders = () => {
      nextTick(() => {
        // 等待DOM更新后再提取标题
        setTimeout(() => {
          const headers = extractTOCFromHTML(articleContent.value)
          
          // 确保是真正的数组
          tocHeaders.value = Array.isArray(headers) ? [...headers] : []
          
          // 确保DOM中的标题元素也有正确的ID
          const headingElements = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6')
          
          headingElements.forEach((element) => {
            if (!element.id) {
              const text = element.textContent?.trim() || ''
              const anchor = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                .replace(/^-|-$/g, '')
              element.id = anchor || `heading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }
          })
        }, 100)
      })
    }
    
    // 加载文章内容
    const loadArticle = async () => {
      const { chapter, article } = route.params
      
      // 处理新的URL结构 - 如果没有chapter参数，从路径中提取
      let actualChapter = chapter
      let actualArticle = article
      
      if (!chapter && route.path.includes('/chapter')) {
        // 从路径 /chapter1/ai-basics 中提取 chapter1 和 ai-basics
        const pathParts = route.path.split('/').filter(part => part)
        if (pathParts.length >= 2) {
          actualChapter = pathParts[0] // chapter1
          actualArticle = pathParts[1] // ai-basics
        }
      }
      
      loading.value = true
      error.value = null
      
      try {
        // 根据路径生成标题
        articleTitle.value = getArticleTitle(actualChapter, actualArticle)
        
        // 从markdown文件加载内容
        const markdownPath = getMarkdownPath(actualChapter, actualArticle)
        articleContent.value = await loadMarkdownFile(markdownPath)
        
        // 加载配置并设置导航
        await loadConfig()
        breadcrumb.value = getBreadcrumb(route.path)
        setNavigation()
        
        // 提取标题生成目录
        extractHeaders()
        
      } catch (err) {
        console.error('Failed to load article:', err)
        error.value = `加载文章失败: ${err.message}`
        articleContent.value = `<p class="error">无法加载文章内容，请稍后重试。</p>`
      } finally {
        loading.value = false
      }
    }
    
    // 设置上一篇和下一篇文章
    const setNavigation = () => {
      const sidebar = getSidebarConfig()
      const allArticles = []
      
      // 收集所有文章
      sidebar.sections?.forEach(section => {
        allArticles.push(section)
        if (section.children) {
          allArticles.push(...section.children)
        }
      })
      
      // 找到当前文章的位置
      const currentIndex = allArticles.findIndex(item => item.path === route.path)
      
      if (currentIndex > 0) {
        prevArticle.value = allArticles[currentIndex - 1]
      } else {
        prevArticle.value = null
      }
      
      if (currentIndex < allArticles.length - 1) {
        nextArticle.value = allArticles[currentIndex + 1]
      } else {
        nextArticle.value = null
      }
    }
    
    // 根据路径获取文章标题
    const getArticleTitle = (chapter, article) => {
      const titles = {
        'ai-basics': '1.1 人工智能的"两只手和四条腿"',
        'what-is-ml': '1.2 机器学习是什么',
        'era-of-ml': '1.3 时代造就机器学习',
        'generalization': '1.4 泛化能力：机器学习的核心',
        'inductive-bias': '1.5 归纳偏置：机器学习的灵魂',
        'limitations': '1.6 机器学习的限制',
        'summary': '1.7 本章小结',
      }
      return titles[article] || '文章标题'
    }
    
    onMounted(() => {
      loadArticle()
    })
    
    watch(() => route.params, () => {
      loadArticle()
    })
    
    return {
      articleTitle,
      articleContent,
      breadcrumb,
      prevArticle,
      nextArticle,
      tocHeaders,
      loading,
      error,
      loadArticle,
    }
  }
}
</script>

<style lang="scss" scoped>
.article-page {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  @media (max-width: 768px) {
    gap: 0;
  }
}

.content-article {
  min-width: 0; // 防止Grid item溢出
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  padding: 0;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
  
  .breadcrumb-item {
    color: var(--text-color-light);
    text-decoration: none;
    
    &:hover {
      color: var(--primary-color);
    }
    
    &.active {
      color: var(--text-color);
      font-weight: 500;
    }
    
    .breadcrumb-separator {
      margin: 0 0.5rem;
      color: var(--border-color);
    }
  }
}

.article-header {
  margin-bottom: 2rem;
  
  .article-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    line-height: 1.2;
    overflow-wrap: break-word;
  }
}

.article-content {
  line-height: 1.7;
  color: var(--text-color);
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  
  :deep(h2) {
    font-size: clamp(1.2rem, 3vw, 1.75rem);
    font-weight: 600;
    margin: 2.5rem 0 1rem 0;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
    overflow-wrap: break-word;
  }
  
  :deep(h3) {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    color: var(--text-color);
    overflow-wrap: break-word;
  }
  
  :deep(p) {
    margin: 1rem 0;
    line-height: 1.8;
    overflow-wrap: break-word;
    word-wrap: break-word;
    max-width: 100%;
  }
  
  :deep(ul), :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
    max-width: 100%;
    
    li {
      margin: 0.5rem 0;
      line-height: 1.6;
      overflow-wrap: break-word;
    }
  }
  
  :deep(strong) {
    font-weight: 600;
    color: var(--text-color);
  }
  
  :deep(code) {
    background: var(--bg-color-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: var(--font-family-mono, 'Courier New', monospace);
    font-size: 0.875rem;
    overflow-wrap: break-word;
  }
  
  :deep(.code-block-wrapper) {
    position: relative;
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    
    .code-lang {
      background: var(--bg-color-secondary);
      color: var(--text-color-light);
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--border-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  :deep(pre) {
    background: var(--bg-color-secondary);
    padding: 1.25rem;
    margin: 0;
    overflow-x: auto;
    border-radius: 0;
    border: none;
    
    code {
      background: none;
      padding: 0;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }
  
  // 独立代码块（没有语言标识的）
  :deep(pre:not(.code-block-wrapper pre)) {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin: 1.5rem 0;
  }
  
  :deep(blockquote) {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    background: var(--bg-color-secondary);
    border-left: 4px solid var(--primary-color);
    border-radius: 0 8px 8px 0;
    
    p {
      margin: 0;
      font-style: italic;
    }
    
    strong {
      color: var(--primary-color);
    }
  }
  
  :deep(table) {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    
    th {
      background: var(--bg-color-secondary);
      font-weight: 600;
      color: var(--text-color);
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    @media (max-width: 768px) {
      font-size: 0.875rem;
      
      th, td {
        padding: 0.5rem 0.75rem;
      }
    }
  }
  
  // 处理图片
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

.article-nav {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  
  // 只在极小屏幕上才垂直排列
  @media (max-width: 360px) {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    padding-top: 1.5rem;
    gap: 0.75rem;
  }
  
  .nav-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--bg-color-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
    min-width: 0;
    width: 120px;
    height: 50px;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 120px;
      height: 44px;
      padding: 0.5rem 0.75rem;
    }
    
    @media (max-width: 360px) {
      width: 100%;
      height: 44px;
    }
    
    &:hover {
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }
    
    &.prev {
      .nav-direction {
        color: var(--text-color);
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
      }
    }
    
    &.next {
      .nav-direction {
        color: var(--text-color);
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
      }
    }
    
    // 当只有一个按钮时的处理
    &.prev:only-child {
      margin-right: auto;
      
      @media (max-width: 360px) {
        margin-right: 0;
      }
    }
    
    &.next:only-child {
      margin-left: auto;
      
      @media (max-width: 360px) {
        margin-left: 0;
      }
    }
  }
}

// 确保右侧目录在移动端隐藏
@media (max-width: 1024px) {
  .article-page :deep(.table-of-contents) {
    display: none;
  }
}

// 加载状态样式
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-color-light);
    font-size: 0.9rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 错误状态样式
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  
  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.2);
    border-radius: 8px;
    max-width: 500px;
  }
  
  .retry-button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--primary-color-dark, #2563eb);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}
</style> 