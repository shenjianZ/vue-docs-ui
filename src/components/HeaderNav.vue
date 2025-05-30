<template>
  <header class="header-nav">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-logo">{{ siteInfo.logo }}</span>
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
              :class="['nav-link', { active: item.active }]"
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
        <button class="search-btn" @click="toggleSearch">
          <Search :size="20" />
        </button>
        <button class="theme-toggle" @click="toggleTheme">
          <Sun v-if="isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <Menu :size="24" />
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Sun, Moon, Menu, Github } from 'lucide-vue-next'
import { loadConfig, getSiteInfo, getNavbarConfig } from '../utils/config'

export default {
  name: 'HeaderNav',
  components: {
    Search,
    Sun,
    Moon,
    Menu,
    Github,
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const router = useRouter()
    const siteInfo = reactive({})
    const navItems = ref([])
    const isDark = ref(false)
    
    // 初始化
    onMounted(async () => {
      await loadConfig()
      Object.assign(siteInfo, getSiteInfo())
      navItems.value = getNavbarConfig().items || []
    })
    
    // 处理导航点击
    const handleNavClick = (item) => {
      if (!item.external) {
        router.push(item.link)
      }
    }
    
    // 切换搜索
    const toggleSearch = () => {
      console.log('Toggle search')
    }
    
    // 切换主题
    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
    }
    
    // 切换移动菜单
    const toggleMobileMenu = () => {
      emit('toggle-sidebar')
    }
    
    return {
      siteInfo,
      navItems,
      isDark,
      handleNavClick,
      toggleSearch,
      toggleTheme,
      toggleMobileMenu,
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
      font-size: 1.5rem;
      margin-right: 0.5rem;
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
    
    &:hover {
      color: var(--primary-color);
      background-color: var(--bg-color-hover);
    }
    
    &.active {
      color: var(--primary-color);
      background-color: var(--bg-color-hover);
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
  
  .search-btn,
  .theme-toggle {
    @media (max-width: 640px) {
      display: none;
    }
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