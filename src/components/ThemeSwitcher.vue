<template>
  <div v-if="shouldShowSwitcher" class="theme-switcher">
    <button
      class="theme-button"
      @click="toggleDropdown"
      :class="{ active: isOpen }"
      aria-label="切换主题"
    >
      <PaletteIcon :size="20" />
      <span class="theme-label">{{ currentThemeLabel }}</span>
      <ChevronDownIcon :size="16" :class="{ rotated: isOpen }" />
    </button>
    
    <div v-if="isOpen" class="theme-dropdown">
      <div v-if="props.allowThemeToggle" class="theme-options">
        <div 
          v-for="theme in themes" 
          :key="theme.id"
          class="theme-option"
          @click="selectTheme(theme.id)"
          :class="{ active: currentTheme === theme.id }"
        >
          <div class="theme-preview">
            <div 
              class="color-dot primary" 
              :style="{ backgroundColor: theme.colors.primary }"
            ></div>
            <div 
              class="color-dot accent" 
              :style="{ backgroundColor: theme.colors.accent }"
            ></div>
          </div>
          <div class="theme-info">
            <div class="theme-name">{{ theme.name }}</div>
            <div class="theme-desc">{{ theme.description }}</div>
          </div>
          <CheckIcon v-if="currentTheme === theme.id" :size="16" class="check-icon" />
        </div>
      </div>
      
      <div v-if="props.allowModeToggle" class="theme-modes">
        <button
          class="mode-button"
          @click="toggleDarkMode"
          :class="{ active: isDark }"
        >
          <SunIcon v-if="isDark" :size="16" />
          <MoonIcon v-else :size="16" />
          <span>{{ isDark ? t('theme.lightMode') : t('theme.darkMode') }}</span>
        </button>
      </div>
    </div>
    
    <!-- 点击外部关闭下拉菜单 -->
    <div v-if="isOpen" class="backdrop" @click="closeDropdown"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Palette as PaletteIcon, 
  ChevronDown as ChevronDownIcon,
  Check as CheckIcon,
  Sun as SunIcon,
  Moon as MoonIcon
} from 'lucide-vue-next'

// 国际化
const { t } = useI18n()

// 接收props
const props = defineProps({
  // 是否显示主题切换器
  visible: {
    type: Boolean,
    default: true
  },
  // 是否允许切换主题
  allowThemeToggle: {
    type: Boolean,
    default: true
  },
  // 是否允许切换深色模式
  allowModeToggle: {
    type: Boolean,
    default: true
  }
})

// 注入配置
const docsConfig = inject('docsConfig', {})

// 响应式数据
const isOpen = ref(false)
const currentTheme = ref('default')
const isDark = ref(false)

// 主题配置 - 使用computed来支持国际化
const themes = computed(() => [
  {
    id: 'default',
    name: t('theme.themes.default.name'),
    description: t('theme.themes.default.description'),
    colors: { primary: '#3b82f6', accent: '#10b981' }
  },
  {
    id: 'vue',
    name: t('theme.themes.vue.name'),
    description: t('theme.themes.vue.description'),
    colors: { primary: '#41b883', accent: '#35495e' }
  },
  {
    id: 'github',
    name: t('theme.themes.github.name'),
    description: t('theme.themes.github.description'),
    colors: { primary: '#0969da', accent: '#6f42c1' }
  },
  {
    id: 'purple',
    name: t('theme.themes.purple.name'),
    description: t('theme.themes.purple.description'),
    colors: { primary: '#8b5cf6', accent: '#ec4899' }
  },
  {
    id: 'orange',
    name: t('theme.themes.orange.name'),
    description: t('theme.themes.orange.description'),
    colors: { primary: '#ea580c', accent: '#dc2626' }
  },
  {
    id: 'emerald',
    name: t('theme.themes.emerald.name'),
    description: t('theme.themes.emerald.description'),
    colors: { primary: '#059669', accent: '#0d9488' }
  }
])

// 计算属性
const currentThemeLabel = computed(() => {
  const theme = themes.value.find(t => t.id === currentTheme.value)
  return theme ? theme.name : t('theme.themes.default.name')
})

// 判断是否应该显示主题切换器
const shouldShowSwitcher = computed(() => {
  // 如果props明确设置了不显示，则不显示
  if (!props.visible) return false
  
  // 如果配置中明确设置了不显示，则不显示
  const themeConfig = docsConfig?.theme || {}
  if (themeConfig.showThemeSwitcher === false) return false
  
  // 如果配置中设置了不允许切换，但两个功能都不允许，则不显示
  if (themeConfig.allowToggle === false && !props.allowThemeToggle && !props.allowModeToggle) {
    return false
  }
  
  // 默认显示
  return true
})

// 方法
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectTheme = (themeId) => {
  currentTheme.value = themeId
  applyTheme()
  closeDropdown()
  
  // 保存到localStorage
  localStorage.setItem('vue-docs-theme', themeId)
}

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  applyTheme()
  
  // 保存到localStorage
  localStorage.setItem('vue-docs-dark', isDark.value.toString())
}

const applyTheme = () => {
  const body = document.body
  
  // 移除所有主题类
  body.classList.remove('theme-vue', 'theme-github', 'theme-purple', 'theme-orange', 'theme-emerald')
  
  // 添加当前主题类
  if (currentTheme.value !== 'default') {
    body.classList.add(`theme-${currentTheme.value}`)
  }
  
  // 切换深色模式
  if (isDark.value) {
    body.classList.add('dark')
  } else {
    body.classList.remove('dark')
  }
}

const initTheme = () => {
  // 优先使用配置文件中的设置
  const themeConfig = docsConfig?.theme || {}
  
  // 从localStorage恢复主题设置
  const savedTheme = localStorage.getItem('vue-docs-theme')
  const savedDark = localStorage.getItem('vue-docs-dark')
  
  // 主题选择优先级：localStorage > 配置文件 > 默认值
  if (savedTheme && themes.value.find(t => t.id === savedTheme)) {
    currentTheme.value = savedTheme
  } else if (themeConfig.theme && themes.value.find(t => t.id === themeConfig.theme)) {
    currentTheme.value = themeConfig.theme
  }
  
  // 深色模式优先级：localStorage > 配置文件 > 系统偏好
  if (savedDark !== null) {
    isDark.value = savedDark === 'true'
  } else if (themeConfig.defaultMode) {
    if (themeConfig.defaultMode === 'dark') {
      isDark.value = true
    } else if (themeConfig.defaultMode === 'light') {
      isDark.value = false
    } else if (themeConfig.defaultMode === 'auto') {
      // 检测系统主题偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  } else {
    // 检测系统主题偏好
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  applyTheme()
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown()
  }
}

// 监听语言切换事件
const handleLocaleChange = () => {
  console.log('ThemeSwitcher: 语言切换事件触发')
  // 由于使用了computed属性，主题信息会自动更新
  // 这里可以添加其他需要在语言切换时执行的逻辑
}

// 生命周期
onMounted(() => {
  initTheme()
  document.addEventListener('keydown', handleKeydown)
  // 监听语言切换事件
  window.addEventListener('locale-changed', handleLocaleChange)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  // 清理语言切换监听器
  window.removeEventListener('locale-changed', handleLocaleChange)
})
</script>

<style lang="scss" scoped>
.theme-switcher {
  position: relative;
  display: inline-block;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-color-hover);
    border-color: var(--primary-color);
  }
  
  &.active {
    background: var(--bg-color-hover);
    border-color: var(--primary-color);
  }
  
  .theme-label {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .rotated {
    transform: rotate(180deg);
  }
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 280px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
}

.theme-options {
  padding: 0.5rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-color-hover);
  }
  
  &.active {
    background: var(--bg-color-hover);
    
    .theme-name {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
}

.theme-preview {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.theme-info {
  flex: 1;
  min-width: 0;
}

.theme-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.125rem;
}

.theme-desc {
  font-size: 0.75rem;
  color: var(--text-color-muted);
}

.check-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.theme-modes {
  border-top: 1px solid var(--border-color);
  padding: 0.5rem;
}

.mode-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  
  &:hover {
    background: var(--bg-color-hover);
    border-color: var(--primary-color);
  }
  
  &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

// 响应式设计
@media (max-width: 768px) {
  .theme-dropdown {
    right: auto;
    left: 0;
    min-width: 250px;
  }
  
  .theme-button {
    .theme-label {
      display: none;
    }
  }
}
</style> 