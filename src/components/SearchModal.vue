<template>
  <div v-if="isOpen" class="search-modal-overlay" @click="closeSearch">
    <div class="search-modal" @click.stop>
      <div class="search-header">
        <div class="search-input-wrapper">
          <Search :size="20" class="search-icon" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            @input="performSearch"
            @keydown="handleKeydown"
            placeholder="搜索文档..."
            class="search-input"
            autofocus
          />
          <kbd v-if="!searchQuery" class="search-shortcut">ESC</kbd>
        </div>
        <button @click="closeSearch" class="close-btn">
          <X :size="20" />
        </button>
      </div>
      
      <div class="search-content">
        <div v-if="isSearching" class="search-loading">
          <div class="loading-spinner"></div>
          <span>搜索中...</span>
        </div>
        
        <div v-else-if="searchQuery && searchResults.length === 0" class="no-results">
          <FileSearch :size="48" class="no-results-icon" />
          <h3>未找到结果</h3>
          <p>尝试使用不同的关键词搜索</p>
        </div>
        
        <div v-else-if="searchResults.length > 0" class="search-results">
          <div class="results-count">
            找到 {{ searchResults.length }} 个结果
          </div>
          <div 
            v-for="(result, index) in searchResults" 
            :key="result.id"
            :class="['search-result-item', { active: selectedIndex === index }]"
            @click="navigateToResult(result)"
            @mouseenter="selectedIndex = index"
          >
            <div class="result-title">
              <FileText :size="16" class="result-icon" />
              <span v-html="highlightMatch(result.title, searchQuery)"></span>
            </div>
            <div class="result-path">{{ result.path }}</div>
            <div v-if="result.content" class="result-content" v-html="highlightMatch(result.content, searchQuery)"></div>
          </div>
        </div>
        
        <div v-else class="search-suggestions">
          <h3>搜索建议</h3>
          <div class="suggestion-tags">
            <button 
              v-for="tag in searchSuggestions" 
              :key="tag"
              @click="searchQuery = tag; performSearch()"
              class="suggestion-tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="search-footer">
        <div class="search-tips">
          <kbd>↑</kbd><kbd>↓</kbd> 导航 
          <kbd>Enter</kbd> 选择 
          <kbd>ESC</kbd> 关闭
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, FileSearch, FileText } from 'lucide-vue-next'

const router = useRouter()
const docsConfig = inject('docsConfig', {})

// 响应式数据
const isOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const selectedIndex = ref(0)
const isSearching = ref(false)
const searchInput = ref(null)

// 搜索建议
const searchSuggestions = ref([
  '安装', '配置', '快速开始', 'API', '组件', '主题'
])

// 搜索索引
const searchIndex = ref([])

// 方法
const openSearch = () => {
  isOpen.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
}

// 构建搜索索引
const buildSearchIndex = async () => {
  const index = []
  
  // 从侧边栏配置构建索引
  const sidebar = docsConfig.sidebar || {}
  const sections = sidebar.sections || []
  
  for (const section of sections) {
    // 添加章节
    index.push({
      id: `section-${section.title}`,
      title: section.title,
      path: section.path || '',
      type: 'section',
      content: section.description || ''
    })
    
    // 添加子页面
    if (section.children) {
      for (const child of section.children) {
        index.push({
          id: `page-${child.title}`,
          title: child.title,
          path: child.path || '',
          type: 'page',
          content: ''
        })
      }
    }
  }
  
  searchIndex.value = index
  console.log('Search index built:', index.length, 'items')
}

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  isSearching.value = true
  selectedIndex.value = 0
  
  // 模拟搜索延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const query = searchQuery.value.toLowerCase()
  const results = []
  
  for (const item of searchIndex.value) {
    let score = 0
    let matchedContent = ''
    
    // 标题匹配（高权重）
    if (item.title.toLowerCase().includes(query)) {
      score += 10
    }
    
    // 路径匹配（中权重）
    if (item.path.toLowerCase().includes(query)) {
      score += 5
    }
    
    // 内容匹配（低权重）
    if (item.content && item.content.toLowerCase().includes(query)) {
      score += 1
      
      // 提取匹配的内容片段
      const index = item.content.toLowerCase().indexOf(query)
      const start = Math.max(0, index - 50)
      const end = Math.min(item.content.length, index + query.length + 50)
      matchedContent = item.content.substring(start, end)
      if (start > 0) matchedContent = '...' + matchedContent
      if (end < item.content.length) matchedContent = matchedContent + '...'
    }
    
    if (score > 0) {
      results.push({
        ...item,
        score,
        content: matchedContent || item.content
      })
    }
  }
  
  // 按得分排序
  results.sort((a, b) => b.score - a.score)
  
  searchResults.value = results
  isSearching.value = false
}

// 高亮搜索关键词
const highlightMatch = (text, query) => {
  if (!query || !text) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 导航到搜索结果
const navigateToResult = (result) => {
  if (result.path) {
    router.push(result.path)
    closeSearch()
  }
}

// 键盘事件处理
const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (searchResults.value[selectedIndex.value]) {
        navigateToResult(searchResults.value[selectedIndex.value])
      }
      break
    case 'Escape':
      closeSearch()
      break
  }
}

// 全局键盘快捷键
const handleGlobalKeydown = (event) => {
  // Ctrl/Cmd + K 或者 / 键打开搜索
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    openSearch()
  } else if (event.key === '/' && !isOpen.value) {
    event.preventDefault()
    openSearch()
  } else if (event.key === 'Escape' && isOpen.value) {
    closeSearch()
  }
}

// 生命周期
onMounted(async () => {
  await buildSearchIndex()
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

// 暴露方法
defineExpose({
  openSearch,
  closeSearch,
  isOpen
})
</script>

<style lang="scss" scoped>
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 1rem 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.search-modal {
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  background: var(--bg-color);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
  background: var(--bg-color);
  
  // 确保header在滚动时保持固定
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-light);
    z-index: 1;
  }
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0.75rem 4rem 0.75rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color-secondary);
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--text-color-light);
  }
}

.search-shortcut {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem 0.5rem;
  background: var(--bg-color-hover);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-color-light);
  z-index: 1;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-color-light);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: var(--bg-color-hover);
    color: var(--text-color);
  }
  
  // 移动端优化
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    &:active {
      background: var(--bg-color-hover);
      transform: scale(0.95);
    }
  }
}

.search-content {
  max-height: 50vh;
  overflow-y: auto;
  padding: 1rem;
}

.search-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--text-color-light);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-color-light);
  
  .no-results-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
}

.results-count {
  font-size: 0.85rem;
  color: var(--text-color-light);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.search-result-item {
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  
  &:hover,
  &.active {
    background: var(--bg-color-hover);
  }
  
  &.active {
    border-left: 3px solid var(--primary-color);
  }
}

.result-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  
  .result-icon {
    color: var(--text-color-light);
  }
  
  :deep(mark) {
    background: var(--primary-color);
    color: white;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
  }
}

.result-path {
  font-size: 0.8rem;
  color: var(--text-color-light);
  margin-bottom: 0.25rem;
}

.result-content {
  font-size: 0.85rem;
  color: var(--text-color-light);
  line-height: 1.4;
  
  :deep(mark) {
    background: rgba(59, 130, 246, 0.2);
    color: var(--primary-color);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
  }
}

.search-suggestions {
  text-align: center;
  padding: 2rem 1rem;
  
  h3 {
    margin: 0 0 1rem 0;
    color: var(--text-color);
  }
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.suggestion-tag {
  padding: 0.5rem 1rem;
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

.search-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-color-light);
  
  kbd {
    padding: 0.125rem 0.375rem;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-size: 0.75rem;
    margin: 0 0.25rem;
  }
}

// 移动端优化
@media (max-width: 768px) {
  .search-modal-overlay {
    padding: 5vh 0.5rem 1rem;
  }
  
  .search-modal {
    max-height: 90vh;
  }
  
  .search-header {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .search-input-wrapper {
    .search-icon {
      left: 0.75rem;
    }
  }
  
  .search-input {
    height: 44px;
    padding: 0.625rem 3.5rem 0.625rem 2.75rem;
    font-size: 16px; // 防止iOS缩放
  }
  
  .search-shortcut {
    right: 0.75rem;
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
  }
  
  .search-content {
    padding: 0.75rem;
    max-height: 60vh;
  }
  
  .search-tips {
    font-size: 0.75rem;
    gap: 0.5rem;
  }
}
</style> 