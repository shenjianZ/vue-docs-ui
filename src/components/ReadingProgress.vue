<template>
  <div class="reading-progress-container" :class="{ 
    'is-mobile': isMobile,
    'mobile-scrolling': isMobile && isScrolling,
    'mobile-hidden': isMobile && mobileInitialized && !isScrolling
  }">
    <!-- 阅读进度条 -->
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>
    
    <!-- 阅读信息面板 -->
    <div class="reading-info" :class="{ visible: showInfo }">
      <div class="reading-stats">
        <div class="stat-item">
          <Clock :size="16" />
          <span>{{ t('readingProgress.estimatedTime') }}: {{ readingTime }} {{ t('readingProgress.minutes') }}</span>
        </div>
        <div class="stat-item">
          <TrendingUp :size="16" />
          <span>{{ t('readingProgress.progress') }}: {{ Math.round(scrollProgress) }}%</span>
        </div>
        <div class="stat-item">
          <FileText :size="16" />
          <span>{{ wordCount }} {{ t('readingProgress.words') }}</span>
        </div>
      </div>
      
      <div class="reading-controls">
        <button 
          @click="toggleAutoScroll" 
          :class="['control-btn', { active: autoScrollEnabled }]"
          :title="autoScrollEnabled ? t('readingProgress.stopAutoScroll') : t('readingProgress.startAutoScroll')"
        >
          <Play v-if="!autoScrollEnabled" :size="16" />
          <Pause v-else :size="16" />
        </button>
        
        <button 
          @click="scrollToTop" 
          class="control-btn"
          :title="t('readingProgress.backToTop')"
        >
          <ArrowUp :size="16" />
        </button>
        
        <button 
          @click="toggleInfo" 
          class="control-btn info-toggle"
          :title="showInfo ? t('readingProgress.hideInfo') : t('readingProgress.showInfo')"
        >
          <Eye v-if="!showInfo" :size="16" />
          <EyeOff v-else :size="16" />
        </button>
      </div>
    </div>
    
    <!-- 章节导航迷你图 -->
    <div v-if="chapters.length > 0" class="chapter-minimap">
      <div 
        v-for="(chapter, index) in chapters" 
        :key="chapter.id"
        class="chapter-dot"
        :class="{ 
          active: currentChapter === index,
          read: chapter.progress >= 100
        }"
        :style="{ top: `${chapter.position}%` }"
        @click="scrollToChapter(chapter)"
        :title="chapter.title"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  Clock, 
  TrendingUp, 
  FileText, 
  Play, 
  Pause, 
  ArrowUp, 
  Eye, 
  EyeOff 
} from 'lucide-vue-next'

const route = useRoute()
const { t } = useI18n()

// 响应式数据
const scrollProgress = ref(0)
const wordCount = ref(0)
const readingTime = ref(0)
const showInfo = ref(false)
const autoScrollEnabled = ref(false)
const currentChapter = ref(0)
const chapters = ref([])

// 移动端滚动显示相关
const isMobile = ref(false)
const isScrolling = ref(false)
const mobileInitialized = ref(false)
let scrollTimer = null

// 计算属性
const averageReadingSpeedWPM = 200 // 中文平均阅读速度（字/分钟）

// 自动滚动相关
let autoScrollInterval = null
const autoScrollSpeed = 50 // 像素/秒



// 方法
const calculateWordCount = () => {
  const content = document.querySelector('.docs-content')
  if (!content) return 0
  
  const text = content.innerText || content.textContent || ''
  // 中文字符计数（包括标点符号）
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  // 英文单词计数
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  
  // 混合计算：中文字符 + 英文单词
  return chineseChars + englishWords
}

const calculateReadingTime = (words) => {
  return Math.ceil(words / averageReadingSpeedWPM)
}

const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  if (scrollHeight <= 0) {
    scrollProgress.value = 0
    return
  }
  
  const progress = (scrollTop / scrollHeight) * 100
  scrollProgress.value = Math.min(100, Math.max(0, progress))
  
  // 更新当前章节
  updateCurrentChapter(scrollTop)
  
  // 移动端滚动时显示进度条
  handleMobileScroll()
}

const updateCurrentChapter = (scrollTop) => {
  for (let i = chapters.value.length - 1; i >= 0; i--) {
    if (scrollTop >= chapters.value[i].offsetTop - 100) {
      currentChapter.value = i
      
      // 更新章节阅读进度
      const chapter = chapters.value[i]
      const nextChapter = chapters.value[i + 1]
      
      if (nextChapter) {
        const chapterHeight = nextChapter.offsetTop - chapter.offsetTop
        const chapterProgress = Math.min(100, 
          ((scrollTop + 100 - chapter.offsetTop) / chapterHeight) * 100
        )
        chapter.progress = Math.max(0, chapterProgress)
      } else {
        // 最后一个章节
        const remainingHeight = document.documentElement.scrollHeight - chapter.offsetTop
        const chapterProgress = Math.min(100, 
          ((scrollTop + 100 - chapter.offsetTop) / remainingHeight) * 100
        )
        chapter.progress = Math.max(0, chapterProgress)
      }
      
      break
    }
  }
}

const findChapters = () => {
  const content = document.querySelector('.docs-content')
  if (!content) return
  
  const headings = content.querySelectorAll('h1, h2, h3')
  const totalHeight = document.documentElement.scrollHeight
  
  chapters.value = Array.from(headings).map((heading, index) => ({
    id: `chapter-${index}`,
    title: heading.textContent || '',
    element: heading,
    offsetTop: heading.offsetTop,
    position: (heading.offsetTop / totalHeight) * 100,
    progress: 0
  }))
}

const scrollToChapter = (chapter) => {
  chapter.element.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleInfo = () => {
  showInfo.value = !showInfo.value
}

const toggleAutoScroll = () => {
  if (autoScrollEnabled.value) {
    stopAutoScroll()
  } else {
    startAutoScroll()
  }
}

const startAutoScroll = () => {
  if (autoScrollInterval) return
  
  autoScrollEnabled.value = true
  autoScrollInterval = setInterval(() => {
    const currentScroll = window.pageYOffset
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    
    if (currentScroll >= maxScroll) {
      stopAutoScroll()
      return
    }
    
    window.scrollBy(0, autoScrollSpeed / 10) // 每100ms滚动一次
  }, 100)
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
  autoScrollEnabled.value = false
}

// 检测移动设备
const checkMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768
  
  const result = isMobileUA || (isTouchDevice && isSmallScreen)
  console.log('Mobile device detection:', {
    userAgent: userAgent.substring(0, 50) + '...',
    isMobileUA,
    isTouchDevice,
    isSmallScreen,
    result
  })
  
  return result
}

// 处理移动端滚动显示
const handleMobileScroll = () => {
  // 简化判断：直接使用屏幕宽度
  const isCurrentlyMobile = window.innerWidth <= 768
  
  if (!isCurrentlyMobile) {
    console.log('Not mobile, skipping mobile scroll logic')
    return
  }
  
  // 更新移动端状态
  if (!isMobile.value) {
    isMobile.value = true
    console.log('Updated isMobile to true')
  }
  
  // 标记已初始化
  if (!mobileInitialized.value) {
    mobileInitialized.value = true
    console.log('Mobile initialized')
  }
  
  // 显示进度条
  isScrolling.value = true
  
  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  
  // 1秒后隐藏进度条
  scrollTimer = setTimeout(() => {
    isScrolling.value = false
    console.log('Mobile progress hidden after scroll timeout')
  }, 1000)
  
  console.log('Mobile scroll detected:', {
    screenWidth: window.innerWidth,
    isMobile: isMobile.value,
    isScrolling: isScrolling.value,
    mobileInitialized: mobileInitialized.value
  })
}

// 处理移动端触摸事件（防止意外触发）
const handleTouchStart = (event) => {
  if (!isMobile.value) return
  
  // 如果触摸的是进度条区域，阻止事件冒泡
  const target = event.target
  const progressContainer = target.closest('.reading-progress-container')
  if (progressContainer && !target.closest('.reading-controls')) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const initializeReadingProgress = async () => {
  await nextTick()
  
  // 检测移动设备
  isMobile.value = checkMobileDevice()
  
  // 等待内容加载
  setTimeout(() => {
    const words = calculateWordCount()
    wordCount.value = words
    readingTime.value = calculateReadingTime(words)
    
    findChapters()
    updateScrollProgress()
    
    console.log('Reading Progress initialized:', {
      words,
      readingTime: readingTime.value,
      chapters: chapters.value.length,
      isMobile: isMobile.value,
      isScrolling: isScrolling.value,
      mobileInitialized: mobileInitialized.value
    })
  }, 500)
}



// 清理定时器
const clearTimers = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
}

// 监听路由变化
watch(() => route.path, () => {
  // 路由变化时重新初始化
  stopAutoScroll()
  clearTimers()
  setTimeout(initializeReadingProgress, 100)
})

// 键盘快捷键
const handleKeydown = (event) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'j':
        event.preventDefault()
        toggleAutoScroll()
        break
      case 'Home':
        event.preventDefault()
        scrollToTop()
        break
    }
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', findChapters, { passive: true })
  document.addEventListener('keydown', handleKeydown)
  
  // 移动端添加触摸事件监听
  document.addEventListener('touchstart', handleTouchStart, { passive: false })
  
  initializeReadingProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', findChapters)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('touchstart', handleTouchStart)
  stopAutoScroll()
  clearTimers()
})

// 测试方法：强制显示移动端进度条
const forceShowMobile = () => {
  console.log('Force show mobile progress called')
  isMobile.value = true
  mobileInitialized.value = true
  isScrolling.value = true
  
  setTimeout(() => {
    isScrolling.value = false
    console.log('Force show timeout completed')
  }, 3000)
  
  console.log('强制显示移动端进度条:', { 
    isMobile: isMobile.value, 
    isScrolling: isScrolling.value,
    mobileInitialized: mobileInitialized.value
  })
}

// 暴露方法
defineExpose({
  initializeReadingProgress,
  scrollToTop,
  toggleAutoScroll,
  forceShowMobile
})
</script>

<style lang="scss" scoped>
.reading-progress-container {
  position: fixed;
  top: var(--header-height, 64px);
  left: 0;
  right: 0;
  z-index: 999;
  transition: all 0.3s ease;
  
  // PC端hover效果
  @media (min-width: 769px) {
    &:hover .reading-info {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.progress-bar {
  height: 2px;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  
  .dark & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-color-light));
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 8px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.reading-info {
  position: absolute;
  top: 100%;
  right: 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    right: 0.5rem;
    left: 0.5rem;
    padding: 0.5rem;
  }
}

.reading-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-color-light);
  
  svg {
    color: var(--primary-color);
  }
}

.reading-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.control-btn {
  padding: 0.375rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color-hover);
  color: var(--text-color-light);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  &.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  &.info-toggle {
    margin-left: 0.5rem;
    
    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
}

.chapter-minimap {
  position: fixed;
  right: 1rem;
  top: calc(50% + var(--header-height, 64px) / 2);
  transform: translateY(-50%);
  width: 6px;
  height: 200px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  z-index: 998;
  
  .dark & {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
}

.chapter-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--text-color-light);
  border-radius: 50%;
  left: -1px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    width: 12px;
    height: 12px;
    left: -3px;
    background: var(--primary-color);
  }
  
  &.active {
    background: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-color);
  }
  
  &.read {
    background: var(--success-color);
  }
}

// 移动端优化
@media (max-width: 768px) {
  .reading-progress-container {
    // 移动端禁用所有交互，防止点击触发
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    
    // 移动端默认状态：正常显示
    &.is-mobile {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.3s ease;
      
      // 只有明确隐藏时才隐藏
      &.mobile-hidden {
        opacity: 0;
        transform: translateY(-100%);
      }
      
      // 滚动时确保显示
      &.mobile-scrolling {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    // 移动端不使用hover，只通过visible类控制
    .reading-info.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    // 进度条区域完全禁用交互
    .progress-bar {
      pointer-events: none;
      touch-action: none;
    }
    
    // 为按钮重新启用点击事件
    .reading-controls .control-btn {
      pointer-events: auto;
      touch-action: manipulation;
    }
  }
  
  .progress-bar {
    height: 3px; // 移动端稍微加粗一点
  }
}

// 打印时隐藏
@media print {
  .reading-progress-container {
    display: none !important;
  }
}
</style> 