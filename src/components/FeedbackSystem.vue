<template>
  <div class="feedback-system">
    <!-- 浮动反馈按钮 -->
    <button 
      v-if="!showFeedbackPanel && !hideButton"
      @click="toggleFeedbackPanel"
      class="feedback-trigger"
      :title="t('feedback.triggerTitle')"
    >
      <MessageCircle :size="20" />
      <span v-if="hasNewNotifications" class="notification-dot"></span>
    </button>
    
    <!-- 反馈面板 -->
    <div v-if="showFeedbackPanel" class="feedback-panel">
      <div class="feedback-header">
        <h3>📝 {{ t('feedback.title') }}</h3>
        <button @click="toggleFeedbackPanel" class="close-btn">
          <X :size="18" />
        </button>
      </div>
      
      <!-- 快速评价 -->
      <div class="quick-rating">
        <p>{{ t('feedback.quickQuestion') }}</p>
        <div class="rating-buttons">
          <button 
            @click="submitQuickRating('helpful')"
            :class="['rating-btn', 'helpful', { active: quickRating === 'helpful' }]"
          >
            <ThumbsUp :size="16" />
            <span>{{ t('feedback.helpful') }}</span>
          </button>
          <button 
            @click="submitQuickRating('not-helpful')"
            :class="['rating-btn', 'not-helpful', { active: quickRating === 'not-helpful' }]"
          >
            <ThumbsDown :size="16" />
            <span>{{ t('feedback.notHelpful') }}</span>
          </button>
        </div>
      </div>
      
      <!-- 详细反馈表单 -->
      <div v-if="showDetailedForm" class="detailed-feedback">
        <div class="feedback-type">
          <label>{{ t('feedback.feedbackType') }}：</label>
          <select v-model="feedbackForm.type" class="feedback-select">
            <option value="">{{ t('feedback.selectType') }}</option>
            <option value="content">{{ t('feedback.types.content') }}</option>
            <option value="typo">{{ t('feedback.types.typo') }}</option>
            <option value="missing">{{ t('feedback.types.missing') }}</option>
            <option value="suggestion">{{ t('feedback.types.suggestion') }}</option>
            <option value="bug">{{ t('feedback.types.bug') }}</option>
            <option value="question">{{ t('feedback.types.question') }}</option>
            <option value="other">{{ t('feedback.types.other') }}</option>
          </select>
        </div>
        
        <div class="feedback-content">
          <label>{{ t('feedback.detailLabel') }}：</label>
          <textarea 
            v-model="feedbackForm.content"
            :placeholder="t('feedback.detailPlaceholder')"
            class="feedback-textarea"
            rows="4"
          ></textarea>
        </div>
        
        <div class="feedback-contact">
          <label>
            <input 
              type="checkbox" 
              v-model="feedbackForm.allowContact"
            />
            {{ t('feedback.contactLabel') }}
          </label>
          <input 
            v-if="feedbackForm.allowContact"
            v-model="feedbackForm.email"
            type="email"
            :placeholder="t('feedback.emailPlaceholder')"
            class="feedback-email"
          />
        </div>
        
        <div class="feedback-actions">
          <button 
            @click="submitDetailedFeedback"
            :disabled="!canSubmitDetailed"
            class="submit-btn"
          >
            <Send :size="16" />
            {{ t('feedback.submit') }}
          </button>
          <button @click="cancelDetailedFeedback" class="cancel-btn">
            {{ t('feedback.cancel') }}
          </button>
        </div>
      </div>
      
      <!-- 页面统计 -->
      <div class="page-stats">
        <div class="stats-grid">
          <div class="stat-item">
            <Users :size="16" />
            <span>{{ pageStats.visitors || 0 }} {{ t('feedback.stats.visitors') }}</span>
          </div>
          <div class="stat-item">
            <ThumbsUp :size="16" />
            <span>{{ pageStats.helpful || 0 }} {{ t('feedback.stats.helpful') }}</span>
          </div>
          <div class="stat-item">
            <MessageCircle :size="16" />
            <span>{{ pageStats.feedback || 0 }} {{ t('feedback.stats.feedback') }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 反馈成功提示 -->
    <div v-if="showSuccessMessage" class="success-toast">
      <CheckCircle :size="16" />
      <span>{{ t('feedback.successMessage') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  hideButton: {
    type: Boolean,
    default: false
  }
})
import {
  MessageCircle,
  X,
  ThumbsUp,
  ThumbsDown,
  Send,
  CheckCircle,
  Users
} from 'lucide-vue-next'

const route = useRoute()
const { t } = useI18n()
const docsConfig = inject('docsConfig', {})

// 响应式数据
const showFeedbackPanel = ref(false)
const quickRating = ref('')
const showDetailedForm = ref(false)
const showSuccessMessage = ref(false)
const hasNewNotifications = ref(false)

// 反馈表单
const feedbackForm = ref({
  type: '',
  content: '',
  allowContact: false,
  email: ''
})

// 页面统计
const pageStats = ref({
  visitors: 0,
  helpful: 0,
  feedback: 0
})

// 计算属性
const canSubmitDetailed = computed(() => {
  return feedbackForm.value.type && feedbackForm.value.content.trim().length >= 10
})

// 方法
const toggleFeedbackPanel = () => {
  showFeedbackPanel.value = !showFeedbackPanel.value
  if (showFeedbackPanel.value) {
    loadPageStats()
  }
}

const submitQuickRating = async (rating) => {
  quickRating.value = rating
  
  try {
    // 提交快速评价
    await submitFeedback({
      type: 'quick-rating',
      rating: rating,
      page: route.path,
      timestamp: Date.now()
    })
    
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
    // 如果是负面评价，显示详细表单
    if (rating === 'not-helpful') {
      setTimeout(() => {
        showDetailedForm.value = true
      }, 1000)
    }
    
    // 更新统计
    pageStats.value.helpful += rating === 'helpful' ? 1 : 0
    
  } catch (error) {
    console.error('Failed to submit quick rating:', error)
  }
}

const submitDetailedFeedback = async () => {
  if (!canSubmitDetailed.value) return
  
  try {
    const feedback = {
      type: feedbackForm.value.type,
      content: feedbackForm.value.content,
      page: route.path,
      timestamp: Date.now(),
      allowContact: feedbackForm.value.allowContact,
      email: feedbackForm.value.email,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    await submitFeedback(feedback)
    
    // 重置表单
    feedbackForm.value = {
      type: '',
      content: '',
      allowContact: false,
      email: ''
    }
    
    showDetailedForm.value = false
    showSuccessMessage.value = true
    
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
    // 更新统计
    pageStats.value.feedback += 1
    
  } catch (error) {
    console.error('Failed to submit detailed feedback:', error)
  }
}

const cancelDetailedFeedback = () => {
  showDetailedForm.value = false
  feedbackForm.value = {
    type: '',
    content: '',
    allowContact: false,
    email: ''
  }
}

const submitFeedback = async (feedback) => {
  // 这里可以连接到实际的反馈 API
  const existingFeedback = JSON.parse(localStorage.getItem('docs-feedback') || '[]')
  existingFeedback.push(feedback)
  localStorage.setItem('docs-feedback', JSON.stringify(existingFeedback))
  
  console.log('Feedback submitted:', feedback)
  
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500))
}

const loadPageStats = () => {
  try {
    const allFeedback = JSON.parse(localStorage.getItem('docs-feedback') || '[]')
    const pageFeedback = allFeedback.filter(item => item.page === route.path)
    
    pageStats.value = {
      visitors: Math.floor(Math.random() * 1000) + 100,
      helpful: pageFeedback.filter(item => item.rating === 'helpful').length,
      feedback: pageFeedback.filter(item => item.type !== 'quick-rating').length
    }
  } catch (error) {
    console.error('Failed to load page stats:', error)
  }
}

// 键盘快捷键
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showFeedbackPanel.value) {
    toggleFeedbackPanel()
  }
}

// 监听路由变化
watch(() => route.path, () => {
  showFeedbackPanel.value = false
  quickRating.value = ''
  showDetailedForm.value = false
})

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  setTimeout(() => {
    hasNewNotifications.value = Math.random() > 0.8
  }, 2000)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  toggleFeedbackPanel,
  submitQuickRating,
  hasNewNotifications
})
</script>

<style lang="scss" scoped>
.feedback-system {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1500;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
}

.feedback-trigger {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: var(--primary-color-dark);
    transform: scale(1.05);
  }
  
  .notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 12px;
    height: 12px;
    background: #ff4757;
    border-radius: 50%;
    border: 2px solid white;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.feedback-panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 360px;
  max-height: 500px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideInUp 0.3s ease-out;
  
  @media (max-width: 480px) {
    width: calc(100vw - 2rem);
    right: -1rem;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
  
  h3 {
    margin: 0;
    font-size: 1rem;
    color: var(--text-color);
  }
}

.close-btn {
  padding: 0.25rem;
  border: none;
  background: none;
  color: var(--text-color-light);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-color-hover);
    color: var(--text-color);
  }
}

.quick-rating {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  p {
    margin: 0 0 0.75rem 0;
    color: var(--text-color);
    font-size: 0.9rem;
  }
}

.rating-buttons {
  display: flex;
  gap: 0.5rem;
}

.rating-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color-hover);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  &.helpful.active {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
  }
  
  &.not-helpful.active {
    background: var(--warning-color);
    color: white;
    border-color: var(--warning-color);
  }
}

.detailed-feedback {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.feedback-type,
.feedback-content,
.feedback-contact {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-color);
    font-weight: 500;
  }
}

.feedback-select,
.feedback-textarea,
.feedback-email {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.85rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.feedback-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.feedback-contact {
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    
    input[type="checkbox"] {
      width: auto;
    }
  }
}

.feedback-email {
  margin-top: 0.5rem;
}

.feedback-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.submit-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.submit-btn {
  background: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
  
  &:hover:not(:disabled) {
    background: var(--primary-color-dark);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.cancel-btn {
  background: var(--bg-color-hover);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--bg-color-secondary);
  }
}

.page-stats {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: var(--bg-color-secondary);
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--text-color-light);
  
  svg {
    color: var(--primary-color);
  }
}

.success-toast {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  background: var(--success-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideInUp 0.3s ease-out;
  z-index: 1600;
  
  @media (max-width: 768px) {
    right: 1rem;
    bottom: 5rem;
  }
}

@media print {
  .feedback-system {
    display: none !important;
  }
}
</style> 