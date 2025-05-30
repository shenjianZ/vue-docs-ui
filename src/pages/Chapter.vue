<template>
  <div class="chapter-page">
    <div class="chapter-content">
      <div class="chapter-header">
        <h1 class="chapter-title">{{ chapterTitle }}</h1>
        <div class="chapter-breadcrumb">
          <router-link to="/books" class="breadcrumb-link">首页</router-link>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{{ chapterTitle }}</span>
        </div>
      </div>
      
      <div class="chapter-body">
        <div class="content-placeholder">
          <p>这里是 {{ chapterTitle }} 的内容。</p>
          <p>当前路由参数：{{ $route.params.chapter }}</p>
          
          <!-- 章节导航 -->
          <div class="chapter-sections" v-if="chapterSections.length > 0">
            <h3>本章内容</h3>
            <div class="sections-list">
              <router-link 
                v-for="section in chapterSections" 
                :key="section.path"
                :to="section.path"
                class="section-card"
              >
                <h4>{{ section.title }}</h4>
                <p v-if="section.description">{{ section.description }}</p>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- 页面导航 -->
        <div class="page-navigation">
          <router-link 
            v-if="prevChapter" 
            :to="prevChapter.path" 
            class="nav-btn prev-btn"
          >
            ← {{ prevChapter.title }}
          </router-link>
          <router-link 
            v-if="nextChapter" 
            :to="nextChapter.path" 
            class="nav-btn next-btn"
          >
            {{ nextChapter.title }} →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadConfig, getSidebarConfig } from '../utils/config'

export default {
  name: 'Chapter',
  setup() {
    const route = useRoute()
    const chapters = ref([])
    const chapterSections = ref([])
    
    const chapterTitle = computed(() => {
      const chapterParam = route.params.chapter
      const chapter = chapters.value.find(c => c.path === `/books/${chapterParam}`)
      return chapter ? chapter.title : `第${chapterParam}章`
    })
    
    const currentChapterIndex = computed(() => {
      const chapterParam = route.params.chapter
      return chapters.value.findIndex(c => c.path === `/books/${chapterParam}`)
    })
    
    const prevChapter = computed(() => {
      const index = currentChapterIndex.value
      return index > 0 ? chapters.value[index - 1] : null
    })
    
    const nextChapter = computed(() => {
      const index = currentChapterIndex.value
      return index >= 0 && index < chapters.value.length - 1 ? chapters.value[index + 1] : null
    })
    
    const loadChapterData = async () => {
      try {
        await loadConfig()
        const sidebarConfig = getSidebarConfig()
        
        if (sidebarConfig?.sections) {
          chapters.value = sidebarConfig.sections.filter(section => section.path !== '/books')
          
          // 获取当前章节的子部分
          const chapterParam = route.params.chapter
          const currentChapter = sidebarConfig.sections.find(s => s.path === `/books/${chapterParam}`)
          chapterSections.value = currentChapter?.children || []
        }
      } catch (error) {
        console.error('Failed to load chapter data:', error)
      }
    }
    
    onMounted(() => {
      loadChapterData()
    })
    
    watch(() => route.params.chapter, () => {
      loadChapterData()
    })
    
    return {
      chapterTitle,
      chapterSections,
      prevChapter,
      nextChapter
    }
  }
}
</script>

<style lang="scss" scoped>
.chapter-page {
  width: 100%;
  max-width: 100%;
  margin: 0;
  overflow: hidden;
}

.chapter-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.chapter-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-color-light);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 640px) {
    padding: 1rem;
  }
  
  .chapter-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 700;
    color: var(--text-color);
    margin: 0 0 1rem 0;
    line-height: 1.2;
    overflow-wrap: break-word;
  }
  
  .chapter-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-color-light);
    flex-wrap: wrap;
    
    .breadcrumb-link {
      color: var(--primary-color);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .breadcrumb-separator {
      color: var(--text-color-muted);
    }
    
    .breadcrumb-current {
      color: var(--text-color);
      font-weight: 500;
      overflow-wrap: break-word;
    }
  }
}

.chapter-body {
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 640px) {
    padding: 1rem;
  }
}

.content-placeholder {
  margin-bottom: 3rem;
  
  p {
    line-height: 1.6;
    color: var(--text-color-light);
  }
}

.chapter-sections {
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 1rem 0;
  }
}

.sections-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.section-card {
  padding: 1.25rem;
  border: 1px solid var(--border-color-light);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
  }
  
  p {
    font-size: 0.875rem;
    color: var(--text-color-light);
    margin: 0;
    line-height: 1.4;
  }
}

.page-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color-light);
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.nav-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--bg-color-secondary);
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
  
  &.next-btn {
    margin-left: auto;
  }
}
</style> 