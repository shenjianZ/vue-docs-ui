<template>
  <div class="default-home">
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <div class="hero-logo">
            <img 
              v-if="isImageLogo(siteInfo.logo)" 
              :src="siteInfo.logo" 
              :alt="siteInfo.title"
              class="logo-image"
            />
            <span v-else class="logo-text">{{ siteInfo.logo }}</span>
          </div>
          {{ siteInfo.title }}
        </h1>
        <p class="hero-description">{{ siteInfo.description }}</p>
      </div>
    </div>
    
    <div class="chapters">
      <h2>{{ t('nav.tableOfContents') }}</h2>
      <div class="chapter-grid">
        <div 
          v-for="chapter in normalizedSidebar" 
          :key="chapter.text || chapter.title"
          class="chapter-card"
          @click="navigateToChapter(chapter)"
        >
          <h3>{{ chapter.text || chapter.title }}</h3>
          <div class="chapter-sections">
            <div 
              v-for="section in chapter.children?.slice(0, 3)" 
              :key="section.text || section.title"
              class="section-item"
            >
              <router-link v-if="section.link || section.path" :to="(section.link || section.path)!" class="section-link">
                {{ section.text || section.title }}
              </router-link>
            </div>
            <div v-if="chapter.children && chapter.children.length > 3" class="more-sections">
              +{{ chapter.children.length - 3 }} {{ t('nav.more') }}...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { DocsConfig } from '../types'
import { getNormalizedSidebar } from '../utils'
// @ts-ignore
import { loadConfig, getSiteInfo } from '../utils/config'

interface Props {
  config?: DocsConfig
}

const props = defineProps<Props>()
const injectedConfig = inject<DocsConfig>('docsConfig')
const config = computed(() => props.config || injectedConfig)

const { t } = useI18n()
const router = useRouter()

// 响应式的站点信息
const siteInfo = reactive({
  title: '',
  description: '',
  logo: '',
  author: ''
})

// 响应式的配置数据
const currentConfig = ref<DocsConfig | null>(null)

// 使用标准化的sidebar - 从配置文件加载
const normalizedSidebar = computed(() => {
  const configToUse = currentConfig.value || config.value
  return configToUse ? getNormalizedSidebar(configToUse) : []
})

// 判断logo是否为图片链接
const isImageLogo = (logo: string | undefined) => {
  if (!logo || typeof logo !== 'string') {
    return false
  }
  // 检查是否为图片URL（http/https开头或相对路径且包含图片扩展名）
  const isUrl = logo.match(/^(https?:\/\/|\/|\.\/|\.\.\/)/i)
  const hasImageExt = logo.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)(\?.*)?$/i)
  return !!isUrl && !!hasImageExt
}

// 初始化配置 - 根据当前语言加载对应的配置文件
const initConfig = async () => {
  try {
    // 重新加载配置，确保获取最新的语言版本
    const loadedConfig = await loadConfig()
    currentConfig.value = loadedConfig
    
    // 获取站点信息并更新响应式对象
    const newSiteInfo = getSiteInfo()
    Object.assign(siteInfo, newSiteInfo)
    
    console.log('DefaultHome: 配置已加载', { 
      siteInfo: siteInfo, 
      sidebar: currentConfig.value?.sidebar 
    })
  } catch (error) {
    console.error('DefaultHome: 加载配置失败:', error)
    // 设置默认值
    Object.assign(siteInfo, {
      title: 'Documentation',
      description: 'Welcome to our documentation',
      logo: '📚',
      author: ''
    })
    currentConfig.value = null
  }
}

// 监听语言切换事件
const handleLocaleChange = () => {
  console.log('DefaultHome: 语言切换事件触发')
  // 重新加载配置以获取对应语言的内容
  initConfig()
}

function navigateToChapter(chapter: any) {
  const link = chapter.link || chapter.path
  // 直接跳转到章节本身，不自动跳转到第一个子项
  if (link) {
    router.push(link)
  } else if (chapter.children && chapter.children.length > 0) {
    // 只有当章节本身没有链接时，才跳转到第一个子项
    const firstChild = chapter.children[0]
    const firstChildLink = firstChild.link || firstChild.path
    if (firstChildLink) {
      router.push(firstChildLink)
    }
  }
}

// 初始化
onMounted(async () => {
  await initConfig()
  // 监听语言切换事件
  window.addEventListener('locale-changed', handleLocaleChange)
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('locale-changed', handleLocaleChange)
})
</script>

<style lang="scss" scoped>
.default-home {
  min-height: 100vh;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 4rem;
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    
    .hero-logo {
      display: flex;
      align-items: center;
      
      .logo-image {
        height: 64px;
        width: auto;
        max-width: 80px;
        object-fit: contain;
        border-radius: 8px;
      }
      
      .logo-text {
        font-size: 3.5rem;
      }
    }
    
    @media (max-width: 768px) {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
      
      .hero-logo {
        .logo-image {
          height: 48px;
          max-width: 60px;
        }
        
        .logo-text {
          font-size: 2.5rem;
        }
      }
    }
  }
  
  .hero-description {
    font-size: 1.25rem;
    color: var(--text-color-light);
    margin: 0;
  }
}

.chapters {
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
    color: var(--text-color);
  }
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.chapter-card {
  background: var(--bg-color-secondary, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color, #3b82f6);
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--primary-color, #3b82f6);
  }
}

.chapter-sections {
  .section-item {
    margin-bottom: 0.75rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .section-link {
    display: block;
    color: var(--text-color, #1e293b);
    text-decoration: none;
    padding: 0.5rem 0;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      color: var(--primary-color, #3b82f6);
      background: var(--bg-color-hover, rgba(59, 130, 246, 0.05));
      padding-left: 1rem;
    }
  }
  
  .more-sections {
    color: var(--text-color-light, #64748b);
    font-size: 0.9rem;
    font-style: italic;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color, #e2e8f0);
  }
}

// Dark mode support
.dark {
  .chapter-card {
    background: var(--bg-color-secondary, #1e293b);
    border-color: var(--border-color, #374151);
  }
  
  .section-link:hover {
    background: var(--bg-color-hover, rgba(59, 130, 246, 0.1));
  }
}
</style> 