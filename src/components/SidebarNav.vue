<template>
  <aside class="sidebar-nav" :class="{ 'mobile-open': isOpen }">
    <div class="sidebar-content">
      <nav class="nav-sections">
        <div 
          v-for="section in sections" 
          :key="section.title"
          class="nav-section"
        >
          <!-- 主要章节 -->
          <router-link 
            v-if="section.path"
            :to="section.path"
            :class="['section-link', { 
              active: isActive(section.path),
              'has-children': section.children?.length > 0
            }]"
            @click="toggleSection(section)"
          >
            <span class="section-title">{{ section.title }}</span>
            <ChevronIcon 
              v-if="section.children?.length > 0"
              :class="['chevron-icon', { expanded: expandedSections.has(section.title) }]"
            />
          </router-link>
          
          <!-- 没有链接的章节标题 -->
          <div 
            v-else
            :class="['section-link', 'section-header', { 
              'has-children': section.children?.length > 0
            }]"
            @click="toggleSection(section)"
          >
            <span class="section-title">{{ section.title }}</span>
            <ChevronIcon 
              v-if="section.children?.length > 0"
              :class="['chevron-icon', { expanded: expandedSections.has(section.title) }]"
            />
          </div>
          
          <!-- 子章节 -->
          <transition name="children-slide">
            <div 
              v-if="section.children?.length > 0 && expandedSections.has(section.title)"
              class="section-children"
            >
              <router-link
                v-for="child in section.children"
                :key="child.title"
                :to="child.path"
                :class="['child-link', { active: isActive(child.path) }]"
              >
                <span class="child-title">{{ child.title }}</span>
              </router-link>
            </div>
          </transition>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadConfig, getSidebarConfig } from '../utils/config'

// 图标组件
const ChevronIcon = { 
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  `
}

export default {
  name: 'SidebarNav',
  components: {
    ChevronIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    uniqueExpansion: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const route = useRoute()
    const sections = ref([])
    const expandedSections = reactive(new Set())
    
    // 检查路径是否激活
    const isActive = (path) => {
      if (!path) return false
      const currentPath = route.path
      
      // 精确匹配
      if (currentPath === path) return true
      
      // 对于章节路径，只有当前路径是该章节的子路径时才激活
      if (path !== '/books' && currentPath.startsWith(path + '/')) {
        return true
      }
      
      return false
    }
    
    // 切换章节展开状态
    const toggleSection = (section) => {
      if (section.children?.length > 0) {
        if (expandedSections.has(section.title)) {
          expandedSections.delete(section.title)
        } else {
          // 如果启用唯一展开模式，先清除其他展开的章节
          if (props.uniqueExpansion) {
            expandedSections.clear()
          }
          expandedSections.add(section.title)
        }
      }
    }
    
    // 自动展开当前路径所在的章节
    const autoExpandCurrentSection = () => {
      const currentPath = route.path
      
      // 清除之前的展开状态
      expandedSections.clear()
      
      sections.value.forEach(section => {
        // 检查当前路径是否属于该章节
        const isCurrentSection = (section.path && currentPath.startsWith(section.path)) ||
                                 section.children?.some(child => currentPath === child.path || currentPath.startsWith(child.path + '/'))
        
        if (isCurrentSection && section.children?.length > 0) {
          expandedSections.add(section.title)
        }
      })
    }
    
    // 初始化侧边栏配置
    const initSidebar = async () => {
      try {
        await loadConfig()
        const sidebarConfig = getSidebarConfig()
        
        if (sidebarConfig && sidebarConfig.sections) {
          sections.value = sidebarConfig.sections
          autoExpandCurrentSection()
        }
      } catch (error) {
        console.error('Failed to load sidebar config:', error)
      }
    }
    
    // 初始化
    onMounted(() => {
      initSidebar()
    })
    
    // 监听路由变化
    watch(() => route.path, () => {
      autoExpandCurrentSection()
    })
    
    return {
      sections,
      expandedSections,
      isActive,
      toggleSection,
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-nav {
  width: 100%;
  max-width: var(--sidebar-width);
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    position: fixed;
    top: var(--header-height);
    left: -100%;
    z-index: 999;
    transition: left 0.3s ease;
    width: 280px;
    max-width: 280px;
    height: calc(100vh - var(--header-height));
    
    &.mobile-open {
      left: 0;
    }
  }
}

.sidebar-content {
  padding: 1.5rem 0;
}

.nav-sections {
  .nav-section {
    margin-bottom: 0.25rem;
  }
}

.section-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  text-align: left;
  
  &:hover {
    background-color: var(--bg-color-secondary);
    color: var(--primary-color);
  }
  
  &.active {
    background-color: rgba(59, 130, 246, 0.1);
    color: var(--primary-color);
    border-left-color: var(--primary-color);
  }
  
  &.section-header {
    cursor: pointer;
    
    &:hover {
      background-color: var(--bg-color-secondary);
    }
  }
  
  .section-title {
    flex: 1;
    font-size: 0.95rem;
    text-align: left;
  }
  
  .chevron-icon {
    margin-left: auto;
    transition: transform 0.2s ease;
    color: var(--text-color-light);
    
    &.expanded {
      transform: rotate(180deg);
    }
  }
}

.section-children {
  background-color: var(--bg-color-secondary);
  border-left: 3px solid var(--border-color);
  margin-left: 0;
  
  .child-link {
    display: block;
    padding: 0.5rem 1rem 0.5rem 2rem;
    text-decoration: none;
    color: var(--text-color-light);
    font-size: 0.875rem;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    text-align: left;
    
    &:hover {
      background-color: rgba(59, 130, 246, 0.05);
      color: var(--primary-color);
    }
    
    &.active {
      background-color: rgba(59, 130, 246, 0.1);
      color: var(--primary-color);
      border-left-color: var(--primary-color);
    }
    
    .child-title {
      display: block;
      line-height: 1.4;
      text-align: left;
    }
  }
}

// 动画效果
.children-slide-enter-active,
.children-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.children-slide-enter-from {
  opacity: 0;
  max-height: 0;
}

.children-slide-enter-to {
  opacity: 1;
  max-height: 500px;
}

.children-slide-leave-from {
  opacity: 1;
  max-height: 500px;
}

.children-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

// 滚动条样式
.sidebar-nav {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--text-color-light);
    }
  }
}
</style> 