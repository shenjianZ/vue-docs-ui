<template>
  <div class="language-switcher" ref="switcherRef">
    <button 
      class="language-btn" 
      @click="toggleDropdown"
      :title="t('nav.language')"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="current-flag">{{ currentLocaleInfo?.flag }}</span>
      <span class="current-name">{{ currentLocaleInfo?.name }}</span>
      <ChevronDown :size="14" class="dropdown-icon" :class="{ 'rotate': isOpen }" />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <div class="dropdown-header">
          <span>{{ t('nav.language') }}</span>
        </div>
        <ul class="language-list">
          <li 
            v-for="locale in SUPPORTED_LOCALES" 
            :key="locale.code"
            class="language-item"
            :class="{ 'active': locale.code === currentLocale }"
          >
            <button 
              class="language-option"
              @click="switchLanguage(locale.code)"
              :aria-pressed="locale.code === currentLocale"
            >
              <span class="locale-flag">{{ locale.flag }}</span>
              <span class="locale-name">{{ locale.name }}</span>
              <Check 
                v-if="locale.code === currentLocale" 
                :size="16" 
                class="check-icon"
              />
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check } from 'lucide-vue-next'
import { SUPPORTED_LOCALES, setLocale, getCurrentLocale, getLocaleInfo } from '../locales/index.js'

export default {
  name: 'LanguageSwitcher',
  components: {
    ChevronDown,
    Check
  },
  setup() {
    const { locale, t } = useI18n()
    const isOpen = ref(false)
    const switcherRef = ref(null)
    
    const currentLocale = computed(() => getCurrentLocale())
    const currentLocaleInfo = computed(() => getLocaleInfo(currentLocale.value))
    
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }
    
    const switchLanguage = (localeCode) => {
      setLocale(localeCode)
      isOpen.value = false
    }
    
    const handleClickOutside = (event) => {
      if (switcherRef.value && !switcherRef.value.contains(event.target)) {
        isOpen.value = false
      }
    }
    
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen.value) {
        isOpen.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    })
    
    return {
      isOpen,
      switcherRef,
      currentLocale,
      currentLocaleInfo,
      SUPPORTED_LOCALES,
      toggleDropdown,
      switchLanguage,
      t
    }
  }
}
</script>

<style lang="scss" scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  color: var(--text-color-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  height: 40px;
  min-width: 80px;
  
  &:hover {
    color: var(--primary-color);
    background-color: var(--bg-color-hover);
  }
  
  .current-flag {
    font-size: 1rem;
    line-height: 1;
  }
  
  .current-name {
    font-weight: 500;
    white-space: nowrap;
    
    @media (max-width: 640px) {
      display: none;
    }
  }
  
  .dropdown-icon {
    transition: transform 0.2s ease;
    
    &.rotate {
      transform: rotate(180deg);
    }
  }
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 180px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  
  .dark & {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
}

.dropdown-header {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.language-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.language-item {
  &.active .language-option {
    background-color: var(--primary-color);
    color: white;
    
    .locale-flag,
    .locale-name,
    .check-icon {
      color: white;
    }
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
  border: none;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.875rem;
  
  &:hover {
    background-color: var(--bg-color-hover);
    color: var(--primary-color);
  }
  
  &:has(.check-icon):hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  .locale-flag {
    font-size: 1rem;
    line-height: 1;
  }
  
  .locale-name {
    flex: 1;
    font-weight: 500;
  }
  
  .check-icon {
    color: var(--primary-color);
    opacity: 0.8;
  }
}

// 下拉动画
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1) translateY(0);
}

// 响应式处理
@media (max-width: 640px) {
  .language-dropdown {
    right: -1rem;
    min-width: 160px;
  }
  
  .language-btn {
    min-width: 60px;
    padding: 0.5rem;
  }
}
</style> 