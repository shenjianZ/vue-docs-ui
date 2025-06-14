<template>
  <header class="header-nav">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-logo">
            <img 
              v-if="isImageLogo(siteInfo.logo)" 
              :src="siteInfo.logo" 
              :alt="siteInfo.title"
              class="logo-image"
            />
            <span v-else class="logo-text">{{ siteInfo.logo }}</span>
          </div>
          <span class="brand-title">{{ siteInfo.title }}</span>
        </router-link>
      </div>
      
      <!-- 主导航菜单 -->
      <nav class="nav-menu">
        <ul class="nav-items">
          <li 
            v-for="item in navItems" 
            :key="item.title"
            class="nav-item"
          >
            <a 
              :href="item.external ? item.link : undefined"
              :class="['nav-link', { active: isActiveNavItem(item) }]"
              :target="item.external ? '_blank' : undefined"
              @click="!item.external && handleNavClick(item)"
            >
              <span v-if="item.icon" class="nav-icon">
                <Github v-if="item.icon === 'github'" :size="20" />
              </span>
              {{ item.title }}
            </a>
          </li>
        </ul>
      </nav>
      
      <!-- 右侧操作区域 -->
      <div class="nav-actions">
        <button class="search-btn" @click="toggleSearch" :title="t('common.search')">
          <Search :size="20" />
        </button>
        <button class="ai-btn" @click="toggleAI" :title="t('ai.assistant')">
          <Bot :size="20" />
        </button>
        <LanguageSwitcher />
        <ThemeSwitcher 
          v-if="shouldShowThemeSwitcher"
          :visible="shouldShowThemeSwitcher"
          :allowThemeToggle="allowThemeToggle"
          :allowModeToggle="allowModeToggle"
        />
        <button class="mobile-menu-btn" @click="toggleMobileMenu" :title="t('common.menu')">
          <Menu :size="24" />
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Search, Sun, Moon, Menu, Github, Bot } from 'lucide-vue-next'
import { loadConfig, getSiteInfo, getNavbarConfig } from '../utils/config'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  name: 'HeaderNav',
  components: {
    Search,
    Sun,
    Moon,
    Menu,
    Github,
    Bot,
    LanguageSwitcher,
    ThemeSwitcher,
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['toggle-sidebar', 'toggle-ai', 'toggle-search'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const siteInfo = reactive({})
    const navItems = ref([])
    const isDark = ref(false)
    
    // 从props或inject获取配置
    const docsConfig = props.config || inject('docsConfig', {})
    
    // 计算主题切换器相关配置
    const themeConfig = computed(() => docsConfig.theme || {})
    
    const shouldShowThemeSwitcher = computed(() => {
      // 如果配置中明确设置了不显示，则不显示
      if (themeConfig.value.showThemeSwitcher === false) return false
      // 如果配置中设置了不允许切换，则不显示
      if (themeConfig.value.allowToggle === false) return false
      // 默认显示
      return true
    })
    
    const allowThemeToggle = computed(() => {
      return themeConfig.value.allowToggle !== false
    })
    
    const allowModeToggle = computed(() => {
      return themeConfig.value.allowToggle !== false
    })
    
    // 判断logo是否为图片链接
    const isImageLogo = (logo) => {
      if (!logo || typeof logo !== 'string') {
        return false
      }
      // 检查是否为图片URL（http/https开头或相对路径且包含图片扩展名）
      const isUrl = logo.match(/^(https?:\/\/|\/|\.\/|\.\.\/)/i)
      const hasImageExt = logo.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)(\?.*)?$/i)
      return !!isUrl && !!hasImageExt
    }
    
    // 初始化配置
    const initConfig = async () => {
      await loadConfig()
      Object.assign(siteInfo, getSiteInfo())
      navItems.value = getNavbarConfig().items || []
    }
    
    // 监听语言切换事件
    const handleLocaleChange = () => {
      initConfig()
    }
    
    // 初始化
    onMounted(async () => {
      await initConfig()
      
      // 初始化主题状态
      isDark.value = document.documentElement.classList.contains('dark')
      
      // 监听语言切换事件
      window.addEventListener('locale-changed', handleLocaleChange)
    })
    
    // 清理事件监听器
    onUnmounted(() => {
      window.removeEventListener('locale-changed', handleLocaleChange)
    })
    
    // 处理导航点击
    const handleNavClick = (item) => {
      if (!item.external) {
        router.push(item.link)
      }
    }
    
    // 切换搜索
    const toggleSearch = () => {
      emit('toggle-search')
    }
    
    // 切换AI助手
    const toggleAI = () => {
      // 发送事件给父组件处理AI助手
      emit('toggle-ai')
    }
    
    // 旧的主题切换逻辑已由ThemeSwitcher组件处理
    
    // 切换移动菜单
    const toggleMobileMenu = () => {
      emit('toggle-sidebar')
    }
    
    // 判断导航项是否为活动项
    const isActiveNavItem = (item) => {
      if (!item.link || item.external) return false
      const currentPath = route.path
      
      // 添加调试信息
      console.log('检查导航项:', {
        title: item.title,
        link: item.link,
        currentPath: currentPath,
        external: item.external
      })
      
      // 1. 精确匹配
      if (currentPath === item.link) {
        console.log('精确匹配成功:', item.title)
        return true
      }
      
      // 2. 首页特殊处理
      if (item.link === '/' && currentPath === '/') {
        console.log('首页匹配成功')
        return true
      }
      
      // 3. 对于非首页导航项，检查是否需要通过sidebar配置进行匹配
      if (item.link !== '/' && docsConfig.sidebar) {
        const isInSection = checkIfPathBelongsToNavItem(currentPath, item, docsConfig.sidebar)
        if (isInSection) {
          console.log('通过sidebar配置匹配成功:', item.title)
          return true
        }
      }
      
      // 4. 简单的前缀匹配（作为fallback）
      if (item.link !== '/' && currentPath.startsWith(item.link)) {
        console.log('前缀匹配成功:', item.title)
        return true
      }
      
      return false
    }
    
    // 检查当前路径是否属于某个导航项的范畴
    const checkIfPathBelongsToNavItem = (currentPath, navItem, sidebarConfig) => {
      if (!sidebarConfig.sections) return false
      
      // 遍历sidebar的每个section，看当前路径是否属于与navItem相关的section
      for (const section of sidebarConfig.sections) {
        // 检查section的路径是否与navItem匹配
        if (isNavItemRelatedToSection(navItem, section)) {
          // 检查当前路径是否在这个section中
          if (isPathInSection(currentPath, section)) {
            return true
          }
        }
      }
      return false
    }
    
    // 判断导航项是否与sidebar section相关
    const isNavItemRelatedToSection = (navItem, section) => {
      // 如果导航项的链接以section的路径开头，或者section的路径以导航项链接开头
      if (section.path) {
        return navItem.link.startsWith(section.path) || section.path.startsWith(navItem.link)
      }
      
      // 检查section的children中是否有与导航项匹配的路径
      if (section.children) {
        return section.children.some(child => 
          child.path === navItem.link || navItem.link.startsWith(child.path)
        )
      }
      
      return false
    }
    
    // 检查路径是否在section中
    const isPathInSection = (currentPath, section) => {
      // 检查section本身的路径
      if (section.path && currentPath.startsWith(section.path)) {
        return true
      }
      
      // 检查section的children
      if (section.children) {
        return section.children.some(child => 
          child.path && (currentPath === child.path || currentPath.startsWith(child.path + '/'))
        )
      }
      
      return false
    }
    
    return {
      siteInfo,
      navItems,
      isDark,
      shouldShowThemeSwitcher,
      allowThemeToggle,
      allowModeToggle,
      isImageLogo,
      handleNavClick,
      toggleSearch,
      toggleAI,
      toggleMobileMenu,
      isActiveNavItem,
      checkIfPathBelongsToNavItem,
      isNavItemRelatedToSection,
      isPathInSection,
      t
    }
  }
}
</script>

<style lang="scss" scoped>
.header-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  height: var(--header-height);
  width: 100%;
  
  .dark & {
    background: rgba(15, 23, 42, 0.95);
  }
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  height: 100%;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.nav-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  
  .brand-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 600;
    
    .brand-logo {
      display: flex;
      align-items: center;
      margin-right: 0.5rem;
      
      .logo-image {
        height: 32px;
        width: auto;
        max-width: 40px;
        object-fit: contain;
        border-radius: 4px;
      }
      
      .logo-text {
        font-size: 1.5rem;
      }
    }
    
    .brand-title {
      font-size: 1.2rem;
      
      @media (max-width: 480px) {
        display: none;
      }
    }
  }
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }
}

.nav-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-item {
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--text-color-light);
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    
    &:hover {
      color: var(--primary-color);
      background-color: var(--bg-color-hover);
    }
    
    &.active {
      color: var(--primary-color);
      background-color: var(--bg-color-hover);
      
      // 添加底部横线效果
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background-color: var(--primary-color);
        border-radius: 1px;
      }
    }
    
    .nav-icon {
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    color: var(--text-color-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    
    &:hover {
      color: var(--primary-color);
      background-color: var(--bg-color-hover);
    }
  }
  
  .search-btn {
    // 搜索按钮在所有屏幕尺寸都显示
    display: flex;
  }
  
  .ai-btn {
    @media (max-width: 640px) {
      display: none;
    }
  }
  
  // ThemeSwitcher组件的响应式处理
  .theme-switcher {
    @media (max-width: 640px) {
      // 在小屏幕上确保主题切换器仍然可见
      .theme-button .theme-label {
        display: none;
      }
    }
  }
  
  // 语言切换器在所有屏幕尺寸都显示
  .language-switcher {
    display: flex;
    align-items: center;
  }
  
  .mobile-menu-btn {
    // 在桌面端隐藏，移动端显示
    @media (min-width: 769px) {
      display: none;
    }
    
    // 确保在移动端可见并突出显示
    @media (max-width: 768px) {
      display: flex !important;
      background-color: var(--bg-color-secondary);
      border: 1px solid var(--border-color);
      width: 44px;
      height: 44px;
      
      &:hover {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
    }
  }
}

// 确保在所有屏幕尺寸下HeaderNav都可见
@media (max-width: 768px) {
  .header-nav {
    display: block;
    position: sticky;
    background: white;
    border-bottom: 1px solid #e2e8f0;
  }
}
</style> 