<template>
  <div class="docs-layout">
    <HeaderNav 
      :config="config"
      @toggle-sidebar="toggleSidebar"
      @toggle-theme="toggleTheme"
      @toggle-ai="toggleAI"
    />
    
    <div class="docs-container">
      <SidebarNav 
        :config="config"
        :is-open="sidebarOpen"
        @close="closeSidebar"
      />
      
      <!-- 移动端遮罩层 -->
      <div 
        v-if="sidebarOpen" 
        class="sidebar-overlay" 
        @click="closeSidebar"
      ></div>
      
      <main class="docs-main">
        <div class="docs-content">
          <router-view @toc-updated="updateTocHeaders" />
        </div>
      </main>
      
      <TableOfContents 
        v-if="showToc && tocConfig.enabled"
        :headers="tocHeaders"
        class="docs-toc"
      />
    </div>
    
    <!-- AI助手 -->
    <AIAssistant ref="aiAssistant" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, inject, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from './HeaderNav.vue'
import SidebarNav from './SidebarNav.vue'
import TableOfContents from './TableOfContents.vue'
import AIAssistant from './AIAssistant.vue'
import { getDefaultTocConfig } from '../utils'
import type { DocsConfig, TocItem } from '../types'

interface Props {
  config: DocsConfig
  showToc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToc: true
})

const route = useRoute()
const sidebarOpen = ref(false)
const tocHeaders = ref<TocItem[]>([])
const aiAssistant = ref<any>(null)

// 计算TOC配置
const tocConfig = computed(() => getDefaultTocConfig(props.config))

// 提供配置给子组件
provide('docsConfig', props.config)
provide('updateTocHeaders', updateTocHeaders)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

function toggleTheme() {
  const html = document.documentElement
  const isDark = html.classList.contains('dark')
  
  if (isDark) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}

function updateTocHeaders(headers: TocItem[]) {
  tocHeaders.value = headers
}

function toggleAI() {
  aiAssistant.value?.toggleAI()
}

// 初始化主题
onMounted(() => {
  const themeConfig = props.config?.theme
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  let shouldUseDark = false
  
  // 根据配置决定默认主题
  if (savedTheme) {
    // 如果用户之前保存了主题设置，优先使用
    shouldUseDark = savedTheme === 'dark'
  } else if (themeConfig?.defaultMode) {
    // 使用配置文件中的默认模式
    switch (themeConfig.defaultMode) {
      case 'dark':
        shouldUseDark = true
        break
      case 'light':
        shouldUseDark = false
        break
      case 'auto':
      default:
        shouldUseDark = prefersDark
        break
    }
  } else {
    // 如果没有配置，使用系统偏好
    shouldUseDark = prefersDark
  }
  
  if (shouldUseDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

// 导出函数供外部使用
defineExpose({
  updateTocHeaders
})
</script>

<style lang="scss">
.docs-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  
  // 确保header始终显示
  .header-nav {
    flex-shrink: 0;
    display: block !important;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    
    @media (max-width: 768px) {
      background: var(--bg-color);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

.docs-container {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr var(--toc-width);
  flex: 1;
  height: calc(100vh - var(--header-height));
  overflow: hidden;
  position: relative;
  
  @media (max-width: 1200px) {
    grid-template-columns: var(--sidebar-width) 1fr;
    
    .docs-toc {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: calc(100vh - var(--header-height));
    
    .sidebar-nav {
      position: fixed;
      top: var(--header-height);
      left: -100%;
      z-index: 999;
      transition: left 0.3s ease;
      width: var(--sidebar-width);
      height: calc(100vh - var(--header-height));
      
      &.mobile-open {
        left: 0;
      }
    }
  }
}

.docs-main {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  min-width: 0; // 防止grid item溢出
  width: 100%;
  max-width: 100%;
}

.docs-content {
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  min-height: 100%;
  
  // 确保内容不会超出容器
  overflow-wrap: break-word;
  word-wrap: break-word;
  
  @media (max-width: 1200px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
  
  // 处理长文本和表格
  * {
    max-width: 100%;
    box-sizing: border-box;
  }
  
  // 响应式表格
  table {
    width: 100%;
    overflow-x: auto;
    display: block;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      font-size: 0.875rem;
    }
  }
  
  // 响应式图片
  img {
    max-width: 100%;
    height: auto;
  }
  
  // 代码块处理
  pre {
    overflow-x: auto;
    max-width: 100%;
  }
}

.docs-toc {
  position: sticky;
  top: 0;
  height: 100%;
  overflow-y: auto;
  
  @media (max-width: 1200px) {
    display: none;
  }
}

.sidebar-overlay {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  
  @media (min-width: 769px) {
    display: none;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

// 防止溢出的工具类
.prevent-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.break-words {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
</style> 