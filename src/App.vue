<template>
  <div id="app" class="app">
    <!-- 顶部导航栏 -->
    <HeaderNav @toggle-sidebar="toggleSidebar" />
    
    <!-- 主要内容区域 -->
    <div class="app-content">
      <!-- 侧边栏 -->
      <SidebarNav :isOpen="sidebarOpen" @close="closeSidebar" />
      
      <!-- 移动端遮罩层 -->
      <div 
        v-if="sidebarOpen" 
        class="sidebar-overlay" 
        @click="closeSidebar"
      ></div>
      
      <!-- 页面内容 -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import HeaderNav from './components/HeaderNav.vue'
import SidebarNav from './components/SidebarNav.vue'

export default {
  name: 'App',
  components: {
    HeaderNav,
    SidebarNav,
  },
  setup() {
    const sidebarOpen = ref(false)
    
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }
    
    const closeSidebar = () => {
      sidebarOpen.value = false
    }
    
    return {
      sidebarOpen,
      toggleSidebar,
      closeSidebar
    }
  }
}
</script>

<style lang="scss">
.app {
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
      background: white;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

.app-content {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  flex: 1;
  height: calc(100vh - var(--header-height));
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: calc(100vh - var(--header-height));
  }
}

.main-content {
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  min-width: 0; // 防止grid item溢出
  width: 100%;
  max-width: 100%;
}

.content-wrapper {
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

// 主题变量
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --accent-color: #06b6d4;
  --bg-color: #ffffff;
  --bg-color-secondary: #f8fafc;
  --surface-color: #f8fafc;
  --text-color: #1e293b;
  --text-color-light: #64748b;
  --text-color-muted: #94a3b8;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --border-color-light: #f1f5f9;
  --sidebar-width: 280px;
  --header-height: 60px;
  
  // 添加缺失的CSS变量
  --heading-color: #0f172a;
  --code-bg-color: #f1f5f9;
  --code-text-color: #334155;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #3b82f6;
  --border-radius: 6px;
  --border-radius-lg: 8px;
  --bg-color-hover: rgba(59, 130, 246, 0.05);
}

// 深色主题支持
.dark {
  --bg-color: #0f172a;
  --bg-color-secondary: #1e293b;
  --bg-color-hover: rgba(59, 130, 246, 0.1);
  
  --text-color: #f1f5f9;
  --text-color-light: #cbd5e1;
  --text-color-muted: #94a3b8;
  --heading-color: #f8fafc;
  
  --border-color: #334155;
  --border-color-light: #475569;
  
  --code-bg-color: #1e293b;
  --code-text-color: #e2e8f0;
}

// 全局响应式工具
.container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
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