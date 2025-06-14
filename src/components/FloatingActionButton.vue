<template>
  <div class="floating-action-buttons">
    <!-- 主按钮 -->
    <button 
      @click="toggleExpanded"
      class="fab-main"
      :class="{ expanded: isExpanded }"
      :title="isExpanded ? '收起' : '展开功能'"
    >
      <transition name="rotate" mode="out-in">
        <Plus v-if="!isExpanded" :size="20" />
        <X v-else :size="20" />
      </transition>
    </button>
    
    <!-- 子按钮们 -->
    <transition-group name="fab-items" tag="div" class="fab-items">
      <button 
        v-show="isExpanded"
        key="search"
        @click="handleSearchClick"
        class="fab-item search-button"
        title="搜索文档"
      >
        <Search :size="18" />
        <span class="fab-label">搜索</span>
      </button>
      
      <button 
        v-show="isExpanded"
        key="ai"
        @click="handleAIClick"
        class="fab-item ai-button"
        title="AI助手"
      >
                 <Bot :size="18" />
         <span class="fab-label">AI助手</span>
         <span v-if="hasAINotifications" class="notification-dot"></span>
       </button>
       
       <button 
         v-show="isExpanded"
         key="feedback"
         @click="handleFeedbackClick"
         class="fab-item feedback-button"
         title="文档反馈"
       >
         <MessageCircle :size="18" />
        <span class="fab-label">文档反馈</span>
        <span v-if="hasFeedbackNotifications" class="notification-dot"></span>
      </button>
    </transition-group>
    
    <!-- 背景遮罩 -->
    <div 
      v-if="isExpanded"
      class="fab-backdrop"
      @click="toggleExpanded"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Plus, X, Bot, MessageCircle, Search } from 'lucide-vue-next'

const props = defineProps({
  hasAINotifications: {
    type: Boolean,
    default: false
  },
  hasFeedbackNotifications: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ai-click', 'feedback-click', 'search-click'])

const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const handleAIClick = () => {
  emit('ai-click')
  // 点击后自动收起
  setTimeout(() => {
    isExpanded.value = false
  }, 200)
}

const handleFeedbackClick = () => {
  emit('feedback-click')
  // 点击后自动收起
  setTimeout(() => {
    isExpanded.value = false
  }, 200)
}

const handleSearchClick = () => {
  emit('search-click')
  // 点击后自动收起
  setTimeout(() => {
    isExpanded.value = false
  }, 200)
}

// 响应式计算
const hasNotifications = computed(() => {
  return props.hasAINotifications || props.hasFeedbackNotifications
})
</script>

<style lang="scss" scoped>
.floating-action-buttons {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    z-index: 1002;
  }
}

.fab-main {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  z-index: 1001;
  
  // 触摸优化
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &.expanded {
    transform: rotate(45deg);
    background: var(--danger-color, #ef4444);
    
    &:hover {
      transform: rotate(45deg) translateY(-2px);
    }
  }
  
  // 移动端优化
  @media (max-width: 768px) {
    width: 54px;
    height: 54px;
    
    // 增加点击区域
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      right: -8px;
      bottom: -8px;
      left: -8px;
      border-radius: 50%;
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    &.expanded:active {
      transform: rotate(45deg) scale(0.95);
    }
  }
}

.fab-items {
  position: absolute;
  bottom: 60px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 64px;
  }
  
      .fab-item {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: white;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    pointer-events: auto;
    
    // 触摸优化
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &.search-button {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
      }
    }
    
    &.ai-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b4693 100%);
      }
    }
    
    &.feedback-button {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      
      &:hover {
        background: linear-gradient(135deg, #e879f9 0%, #f43f5e 100%);
      }
    }
    
    // 标签
    .fab-label {
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--bg-color);
      color: var(--text-color);
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      opacity: 0;
      transform: translateY(-50%) translateX(10px);
      transition: all 0.3s ease;
      pointer-events: none;
      z-index: 1000;
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid var(--bg-color);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }
    }
    
    &:hover .fab-label {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
    
    // 通知点
    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 12px;
      height: 12px;
      background: #ff4444;
      border-radius: 50%;
      border: 2px solid white;
      animation: pulse-notification 2s infinite;
      
      @media (max-width: 768px) {
        top: 8px;
        right: 8px;
        width: 14px;
        height: 14px;
      }
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      width: 46px;
      height: 46px;
      
      &:active {
        transform: scale(0.95);
      }
      
      // 移动端隐藏标签
      .fab-label {
        display: none;
      }
    }
  }
}

.fab-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.05);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

// 动画
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}

.rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.fab-items-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fab-items-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fab-items-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fab-items-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

.fab-items-move {
  transition: transform 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse-notification {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

// 暗色主题适配
.dark {
  .fab-item {
    background: var(--bg-color-secondary);
    color: var(--text-color);
    border-color: var(--border-color);
    
    .fab-label {
      background: var(--bg-color-secondary);
      color: var(--text-color);
      border-color: var(--border-color);
      
      &::after {
        border-left-color: var(--bg-color-secondary);
      }
    }
  }
  
  .fab-backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style> 