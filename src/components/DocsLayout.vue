<template>
  <div class="docs-layout">
    <HeaderNav 
      :config="config"
      @toggle-sidebar="toggleSidebar"
      @toggle-theme="toggleTheme"
    />
    
    <div class="docs-container">
      <SidebarNav 
        :config="config"
        :is-open="sidebarOpen"
        @close="closeSidebar"
      />
      
      <main class="docs-main">
        <div class="docs-content">
          <router-view @toc-updated="updateTocHeaders" />
        </div>
      </main>
      
      <TableOfContents 
        v-if="showToc && tocConfig.enabled"
        :headers="tocHeaders"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, inject, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from './HeaderNav.vue'
import SidebarNav from './SidebarNav.vue'
import TableOfContents from './TableOfContents.vue'
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

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark')
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
}

.docs-container {
  display: flex;
  flex: 1;
  position: relative;
}

.docs-main {
  flex: 1;
  min-width: 0;
  padding-left: 280px;
  padding-right: 240px;
  
  @media (max-width: 1200px) {
    padding-right: 0;
  }
  
  @media (max-width: 768px) {
    padding-left: 0;
  }
}

.docs-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}
</style> 