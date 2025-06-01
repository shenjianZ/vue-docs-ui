<template>
  <aside class="table-of-contents">
    <div class="toc-header">
      <h3>{{ t('common.toc') }}</h3>
    </div>
    
    <nav class="toc-nav" v-if="hasHeaders">
      <!-- 直接渲染，不使用递归组件 -->
      <div v-for="header in filteredHeaders" :key="header.anchor" class="toc-item" :class="'toc-level-' + header.level">
        <a 
          :href="'#' + header.anchor"
          :class="{ active: activeAnchor === header.anchor }"
          @click.prevent="scrollToAnchor(header.anchor)"
          class="toc-link"
        >
          {{ header.text }}
        </a>
        <!-- 子级标题 -->
        <div v-if="header.children && header.children.length > 0" class="toc-children">
          <div v-for="child in header.children" :key="child.anchor" class="toc-item" :class="'toc-level-' + child.level">
            <a 
              :href="'#' + child.anchor"
              :class="{ active: activeAnchor === child.anchor }"
              @click.prevent="scrollToAnchor(child.anchor)"
              class="toc-link"
            >
              {{ child.text }}
            </a>
            <!-- 三级标题 -->
            <div v-if="child.children && child.children.length > 0" class="toc-children">
              <div v-for="grandchild in child.children" :key="grandchild.anchor" class="toc-item" :class="'toc-level-' + grandchild.level">
                <a 
                  :href="'#' + grandchild.anchor"
                  :class="{ active: activeAnchor === grandchild.anchor }"
                  @click.prevent="scrollToAnchor(grandchild.anchor)"
                  class="toc-link"
                >
                  {{ grandchild.text }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <div v-else class="toc-empty">
      <p>{{ t('common.noContent') }}</p>
    </div>
  </aside>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTocConfig } from '../utils/config'
import { filterTOCByLevel } from '../utils/markdown'

export default {
  name: 'TableOfContents',
  props: {
    headers: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { t } = useI18n()
    const activeAnchor = ref('')

    // 使用computed来处理过滤后的headers
    const filteredHeaders = computed(() => {
      if (!props.headers || !Array.isArray(props.headers)) {
        return []
      }
      
      const tocConfig = getTocConfig()
      const maxLevel = tocConfig.maxLevel || 2
      return filterTOCByLevel(props.headers, maxLevel)
    })

    // 使用computed来正确处理响应式数组
    const hasHeaders = computed(() => {
      return filteredHeaders.value && filteredHeaders.value.length > 0
    })

    // 获取目录标题
    const tocTitle = computed(() => {
      const tocConfig = getTocConfig()
      return tocConfig.title || "目录"
    })

    function scrollToAnchor(anchor) {
      const element = document.getElementById(anchor)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
        activeAnchor.value = anchor
        // 更新URL hash
        history.pushState(null, '', `#${anchor}`)
      }
    }

    function updateActiveAnchor() {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let current = ''
      
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 100) {
          current = heading.id
        }
      }
      
      activeAnchor.value = current
    }

    let scrollListener

    onMounted(() => {
      // 初始化当前激活的锚点
      const hash = location.hash.slice(1)
      if (hash) {
        activeAnchor.value = hash
      }
      
      // 监听滚动事件，更新激活的锚点
      scrollListener = () => updateActiveAnchor()
      window.addEventListener('scroll', scrollListener, { passive: true })
      
      // 初始更新
      updateActiveAnchor()
    })

    onUnmounted(() => {
      if (scrollListener) {
        window.removeEventListener('scroll', scrollListener)
      }
    })

    return {
      activeAnchor,
      scrollToAnchor,
      hasHeaders,
      filteredHeaders,
      tocTitle,
      t
    }
  }
}
</script>

<style lang="scss" scoped>
.table-of-contents {
  position: sticky;
  top: calc(var(--header-height, 60px) + 2rem);
  width: 240px;
  max-height: calc(100vh - var(--header-height, 60px) - 4rem);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow-y: auto;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
}

.toc-header {
  padding: 1.5rem 1rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.toc-nav {
  padding: 1rem 0;
}

.toc-empty {
  padding: 1rem;
  text-align: center;
  
  p {
    color: var(--text-color-light);
    font-size: 0.875rem;
    margin: 0;
  }
}

.toc-item {
  margin-bottom: 2px;
}

.toc-link {
  display: block;
  padding: 0.375rem 1rem;
  color: var(--text-color-light);
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 1.4;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
    background: rgba(59, 130, 246, 0.05);
  }
  
  &.active {
    color: var(--primary-color);
    border-left-color: var(--primary-color);
    background: rgba(59, 130, 246, 0.1);
    font-weight: 500;
  }
}

// 不同层级的缩进
.toc-level-1 .toc-link {
  padding-left: 1rem;
  font-weight: 500;
}

.toc-level-2 .toc-link {
  padding-left: 1.5rem;
  font-size: 0.8rem;
}

.toc-level-3 .toc-link {
  padding-left: 2rem;
  font-size: 0.75rem;
}

.toc-level-4 .toc-link {
  padding-left: 2.5rem;
  font-size: 0.75rem;
}

.toc-level-5 .toc-link {
  padding-left: 3rem;
  font-size: 0.75rem;
}

.toc-level-6 .toc-link {
  padding-left: 3.5rem;
  font-size: 0.75rem;
}

.toc-children {
  // 子项目的样式由父级控制
}

// 自定义滚动条
.table-of-contents {
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 2px;
    
    &:hover {
      background: var(--text-color-light);
    }
  }
}
</style> 