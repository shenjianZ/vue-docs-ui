<template>
  <div class="ai-assistant" :class="{ 'ai-assistant--open': isOpen }">
    <!-- AI按钮 -->
    <button 
      class="ai-trigger-btn" 
      @click="toggleAI"
      :title="isOpen ? t('ai.close') : t('ai.open')"
    >
      <Bot :size="20" />
      <span v-if="hasUnreadMessages" class="notification-dot"></span>
    </button>
    
    <!-- AI面板 -->
    <div 
      v-if="isOpen" 
      class="ai-panel"
      :style="panelStyle"
      @wheel.stop
    >
      <div 
        class="ai-header"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="ai-title">
          <Bot :size="18" />
          <span>{{ t('ai.assistant') }}</span>
          <span class="drag-hint">{{ t('common.draggable') }}</span>
        </div>
        <div class="ai-actions">
          <button 
            class="settings-btn" 
            @click="showSettings = !showSettings"
            :title="t('ai.settings')"
          >
            <Settings :size="16" />
          </button>
          <button 
            class="close-btn" 
            @click="closeAI"
            :title="t('common.close')"
          >
            <X :size="16" />
          </button>
        </div>
      </div>
      
      <!-- 设置面板 -->
      <div v-if="showSettings" class="ai-settings">
        <div class="setting-group">
          <label>{{ t('settings.provider') }}</label>
          <select v-model="currentConfig.provider" @change="onProviderChange">
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
            <option value="deepseek-v3">DeepSeek V3</option>
            <option value="deepseek-reasoner">DeepSeek Reasoner</option>
            <option value="custom">{{ t('common.custom') }}</option>
          </select>
        </div>
        
        <div class="setting-group">
          <label>{{ t('settings.model') }}</label>
          <input 
            v-model="currentProviderConfig.modelId" 
            type="text" 
            :placeholder="t('settings.modelPlaceholder')"
          />
        </div>
        
        <div class="setting-group">
          <label>{{ t('settings.apiKey') }}</label>
          <input 
            v-model="currentProviderConfig.apiKey" 
            type="password" 
            :placeholder="t('settings.apiKeyPlaceholder')"
          />
        </div>
        
        <div class="setting-group">
          <label>{{ t('settings.baseUrl') }}</label>
          <input 
            v-model="currentProviderConfig.baseUrl" 
            type="text" 
            :placeholder="t('settings.baseUrlPlaceholder')"
          />
        </div>
        
        <div class="setting-actions">
          <button class="test-btn" @click="testConnection" :disabled="testing">
            <Zap :size="14" />
            {{ testing ? t('settings.testing') : t('settings.testConnection') }}
          </button>
          <button class="save-btn" @click="saveSettings">
            <Save :size="14" />
            {{ t('settings.closeSettings') }}
          </button>
        </div>
        
        <div v-if="testResult" class="test-result" :class="testResult.success ? 'success' : 'error'">
          {{ formatErrorMessage(testResult.message) }}
        </div>
      </div>
      
              <!-- 聊天区域 -->
        <div v-else class="ai-chat">
          <div 
            class="chat-messages" 
            ref="messagesContainer"
            @mousedown.stop
            @wheel="handleChatWheel"
          >
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message"
              :class="message.type"
            >
              <div class="message-content">
                <div 
                  class="message-text"
                  v-html="message.type === 'ai' ? renderMarkdown(message.text) : escapeHtml(message.text)"
                ></div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>
          
          <div v-if="isLoading" class="message ai loading">
            <div class="message-content">
              <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-input">
          <div class="input-wrapper">
            <textarea
              v-model="currentMessage"
              @keydown="handleKeydown"
              :placeholder="t('ai.placeholder')"
              rows="1"
              ref="messageInput"
              :disabled="!isConfigured || isLoading"
            ></textarea>
            <button 
              class="send-btn" 
              @click="sendMessage"
              :disabled="!canSend"
            >
              <Send :size="16" />
            </button>
          </div>
          
          <div v-if="!isConfigured" class="config-notice">
            <AlertCircle :size="14" />
            {{ t('ai.configNotice') }}
          </div>
        </div>
      </div>
      
      <!-- 拉伸手柄 -->
      <div class="resize-handles">
        <div class="resize-handle resize-handle-n" @mousedown="startResize('n', $event)"></div>
        <div class="resize-handle resize-handle-s" @mousedown="startResize('s', $event)"></div>
        <div class="resize-handle resize-handle-w" @mousedown="startResize('w', $event)"></div>
        <div class="resize-handle resize-handle-e" @mousedown="startResize('e', $event)"></div>
        <div class="resize-handle resize-handle-nw" @mousedown="startResize('nw', $event)"></div>
        <div class="resize-handle resize-handle-ne" @mousedown="startResize('ne', $event)"></div>
        <div class="resize-handle resize-handle-sw" @mousedown="startResize('sw', $event)"></div>
        <div class="resize-handle resize-handle-se" @mousedown="startResize('se', $event)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bot, Settings, X, Send, Save, Zap, AlertCircle } from 'lucide-vue-next'
import { getAIConfig, updateAIConfig, testAIConnection, validateAIConfig } from '../config/ai.js'
import { marked } from 'marked'

export default {
  name: 'AIAssistant',
  components: {
    Bot,
    Settings,
    X,
    Send,
    Save,
    Zap,
    AlertCircle
  },
  setup() {
    const { t } = useI18n()
    const isOpen = ref(false)
    const showSettings = ref(false)
    const currentMessage = ref('')
    const messages = ref([])
    const isLoading = ref(false)
    const testing = ref(false)
    const testResult = ref(null)
    const hasUnreadMessages = ref(false)
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    
    // 拖拽相关
    const isDragging = ref(false)
    const dragOffset = reactive({ x: 0, y: 0 })
    const panelPosition = reactive({ x: 0, y: 0 })
    
    // 拉伸相关
    const isResizing = ref(false)
    const resizeDirection = ref('')
    const resizeStartPos = reactive({ x: 0, y: 0 })
    const resizeStartSize = reactive({ width: 0, height: 0 })
    const panelSize = reactive({ width: 430, height: 770 })
    
    // 面板样式
    const panelStyle = computed(() => ({
      transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
      width: `${panelSize.width}px`,
      height: `${panelSize.height}px`,
      cursor: isDragging.value ? 'grabbing' : 'default'
    }))
    
    // AI配置
    const currentConfig = reactive({})
    const currentProviderConfig = computed(() => {
      return currentConfig.models?.[currentConfig.provider] || {}
    })
    
    const isConfigured = computed(() => {
      const validation = validateAIConfig(currentConfig)
      return validation.isValid
    })
    
    const canSend = computed(() => {
      return currentMessage.value.trim() && isConfigured.value && !isLoading.value
    })
    
    // 监听配置变化，实时更新
    watch(
      () => currentProviderConfig.value,
      (newConfig) => {
        if (newConfig && currentConfig.provider) {
          // 实时更新配置到全局
          updateAIConfig(currentConfig)
          // 清除之前的测试结果
          testResult.value = null
        }
      },
      { deep: true }
    )
    
    // 监听提供商变化
    watch(
      () => currentConfig.provider,
      () => {
        // 提供商变化时也更新配置
        updateAIConfig(currentConfig)
        testResult.value = null
      }
    )
    
    // 初始化示例消息
    const initDemoMessages = () => {
      // 清空现有消息
      messages.value = []
      
      // 添加欢迎消息和示例对话
      addMessage('ai', t('ai.welcome'))
      // 添加一些测试消息来验证滚动功能（从locales加载）
      addMessage('user', t('ai.demoMessages.user1'))
      addMessage('ai', t('ai.demoMessages.ai1'))
      addMessage('user', t('ai.demoMessages.user2'))
      addMessage('ai', t('ai.demoMessages.ai2'))
    }
    
    // 监听语言切换事件
    const handleLocaleChange = () => {
      console.log('AIAssistant: 语言切换事件触发')
      // 重新加载示例消息
      initDemoMessages()
    }
    
    // 初始化
    onMounted(async () => {
      const config = getAIConfig()
      Object.assign(currentConfig, config)
      
      // 初始化示例消息
      initDemoMessages()
      
      // 监听语言切换事件
      window.addEventListener('locale-changed', handleLocaleChange)
    })
    
    // 切换AI面板
    const toggleAI = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        hasUnreadMessages.value = false
        showSettings.value = false
        nextTick(() => {
          messageInput.value?.focus()
        })
      }
    }
    
    const closeAI = () => {
      isOpen.value = false
      showSettings.value = false
    }
    
    // 提供商变更
    const onProviderChange = () => {
      // 提供商变更时的处理已经通过 watch 自动完成
      // 这里保留函数以防模板中有引用
    }
    
    // 测试连接
    const testConnection = async () => {
      testing.value = true
      testResult.value = null
      
      try {
        // 临时更新配置进行测试
        const tempConfig = { ...currentConfig }
        tempConfig.models[tempConfig.provider] = { ...currentProviderConfig.value }
        
        const result = await testAIConnection()
        testResult.value = result
      } catch (error) {
        testResult.value = {
          success: false,
          message: `${t('settings.errors.connectionFailed')}: ${error.message}`
        }
      } finally {
        testing.value = false
      }
    }
    
    // 保存设置
    const saveSettings = () => {
      // 配置已经通过 watch 实时更新，这里只需要关闭设置面板
      showSettings.value = false
      
      // 添加保存成功提示
      addMessage('ai', t('settings.saveSuccess'))
    }
    
    // 发送消息
    const sendMessage = async () => {
      if (!canSend.value) return
      
      const text = currentMessage.value.trim()
      currentMessage.value = ''
      
      // 添加用户消息
      addMessage('user', text)
      
      // 发送给AI服务
      await sendAIRequest(text)
    }
    
    // 处理键盘事件
    const handleKeydown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    }
    
    // 添加消息
    const addMessage = (type, text) => {
      const message = {
        id: Date.now() + Math.random(),
        type,
        text,
        timestamp: new Date()
      }
      messages.value.push(message)
      
      nextTick(() => {
        scrollToBottom()
      })
      
      if (type === 'ai' && !isOpen.value) {
        hasUnreadMessages.value = true
      }
    }
    
    // 滚动到底部
    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }
    
    // 发送消息给AI服务
    const sendAIRequest = async (userMessage) => {
      isLoading.value = true
      
      try {
        if (!isConfigured.value) {
          throw new Error('AI配置不完整，请先完成配置')
        }

        // 动态导入AI服务
        const { sendAIMessage } = await import('../services/aiService.js')
        
        // 准备上下文信息
        const context = {
          history: messages.value.slice(-6), // 最近6条消息作为上下文
          currentPage: window.location.pathname
        }
        
        // 发送消息
        const response = await sendAIMessage(userMessage, context)
        
        if (!response) {
          throw new Error('AI返回了空响应')
        }
        
        addMessage('ai', response)
        
      } catch (error) {
        console.error('AI请求失败:', error)
        let errorMessage = 'AI服务暂时不可用，请稍后重试。'
        
        if (error.message.includes('API密钥')) {
          errorMessage = '请检查API密钥配置是否正确。'
        } else if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络设置。'
        } else if (error.message.includes('配额')) {
          errorMessage = 'API配额不足，请检查账户余额。'
        } else if (error.message.includes('频率')) {
          errorMessage = '请求过于频繁，请稍后重试。'
        }
        
        addMessage('ai', `抱歉，${errorMessage}\n\n错误详情：${error.message}`)
      } finally {
        isLoading.value = false
      }
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    // 格式化错误信息
    const formatErrorMessage = (message) => {
      if (!message) return ''
      
      // 检查是否是翻译键
      if (message.startsWith('settings.errors.')) {
        return t(message)
      }
      
      // 检查是否包含多个翻译键（用逗号分隔）
      if (message.includes('settings.errors.')) {
        const parts = message.split(', ')
        return parts.map(part => {
          if (part.startsWith('settings.errors.')) {
            return t(part)
          }
          return part
        }).join(', ')
      }
      
      // 处理连接测试失败的特殊情况
      if (message.startsWith('settings.errors.connectionFailed:')) {
        const [keyPart, errorPart] = message.split(': ')
        return `${t(keyPart)}: ${errorPart}`
      }
      
      // 直接返回原始消息
      return message
    }
    
    // 渲染Markdown
    const renderMarkdown = (text) => {
      try {
        // 配置marked选项
        marked.setOptions({
          breaks: true, // 支持换行
          gfm: true, // GitHub风格markdown
          sanitize: false,
          highlight: function(code, lang) {
            // 简单的代码高亮
            return `<code class="hljs language-${lang}">${escapeHtml(code)}</code>`
          }
        })
        return marked(text)
      } catch (error) {
        console.error('Markdown渲染失败:', error)
        return escapeHtml(text)
      }
    }
    
    // HTML转义
    const escapeHtml = (text) => {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }
    
    // 处理聊天区域的滚轮事件，防止穿透到背景页面
    const handleChatWheel = (event) => {
      const container = messagesContainer.value
      if (!container) {
        event.stopPropagation()
        return
      }
      
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtTop = scrollTop <= 2 // 允许2px的误差
      const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 2 // 允许2px的误差
      
      // 检查滚动方向
      const isScrollingUp = event.deltaY < 0
      const isScrollingDown = event.deltaY > 0
      
      // 如果在边界且试图继续滚动，阻止事件
      if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      
      // 内容不足以滚动时，也阻止事件穿透
      if (scrollHeight <= clientHeight) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      
      // 其他情况允许正常滚动，但阻止事件冒泡到背景
      event.stopPropagation()
    }
    
    // 拖拽开始
    const startDrag = (event) => {
      // 移动端禁用拖拽
      if (window.innerWidth <= 768) {
        return
      }
      
      if (isResizing.value) return
      event.preventDefault()
      isDragging.value = true
      
      const clientX = event.clientX || event.touches?.[0]?.clientX || 0
      const clientY = event.clientY || event.touches?.[0]?.clientY || 0
      
      dragOffset.x = clientX - panelPosition.x
      dragOffset.y = clientY - panelPosition.y
      
      // 明确指定 passive 选项以避免浏览器警告
      document.addEventListener('mousemove', onDrag, { passive: false })
      document.addEventListener('mouseup', stopDrag, { passive: true })
      document.addEventListener('touchmove', onDrag, { passive: false })
      document.addEventListener('touchend', stopDrag, { passive: true })
      
      document.body.style.userSelect = 'none'
    }
    
    // 拖拽中
    const onDrag = (event) => {
      if (!isDragging.value) return
      
      const clientX = event.clientX || event.touches?.[0]?.clientX || 0
      const clientY = event.clientY || event.touches?.[0]?.clientY || 0
      
      panelPosition.x = clientX - dragOffset.x
      panelPosition.y = clientY - dragOffset.y
      
      // 移除位置限制，允许自由移动
    }
    
    // 拖拽结束
    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag, { passive: false })
      document.removeEventListener('mouseup', stopDrag, { passive: true })
      document.removeEventListener('touchmove', onDrag, { passive: false })
      document.removeEventListener('touchend', stopDrag, { passive: true })
      
      document.body.style.userSelect = ''
    }
    
    // 开始拉伸
    const startResize = (direction, event) => {
      // 移动端禁用拉伸
      if (window.innerWidth <= 768) {
        return
      }
      
      isResizing.value = true
      resizeDirection.value = direction
      
      resizeStartPos.x = event.clientX
      resizeStartPos.y = event.clientY
      resizeStartSize.width = panelSize.width
      resizeStartSize.height = panelSize.height
      
      // 保存初始位置，这对于向左和向上拉伸很重要
      resizeStartPos.panelX = panelPosition.x
      resizeStartPos.panelY = panelPosition.y
      
      document.addEventListener('mousemove', onResize, { passive: false })
      document.addEventListener('mouseup', stopResize, { passive: true })
      document.body.style.userSelect = 'none'
      document.body.style.cursor = getCursorForDirection(direction)
      
      event.preventDefault()
      event.stopPropagation()
    }
    
    // 拉伸中
    const onResize = (event) => {
      if (!isResizing.value) return
      
      const deltaX = event.clientX - resizeStartPos.x
      const deltaY = event.clientY - resizeStartPos.y
      
      const direction = resizeDirection.value
      let newWidth = resizeStartSize.width
      let newHeight = resizeStartSize.height
      let newX = resizeStartPos.panelX
      let newY = resizeStartPos.panelY
      
      // 处理不同方向的拉伸
      if (direction.includes('e')) {
        // 向右拉伸：只改变宽度
        newWidth = Math.max(300, Math.min(window.innerWidth - 50, resizeStartSize.width + deltaX))
      }
      if (direction.includes('w')) {
        // 向左拉伸：改变宽度并调整位置
        const maxWidth = resizeStartPos.panelX + resizeStartSize.width - 50 // 确保不超出左边界
        newWidth = Math.max(300, Math.min(maxWidth, resizeStartSize.width - deltaX))
        newX = resizeStartPos.panelX + resizeStartSize.width - newWidth
      }
      if (direction.includes('s')) {
        // 向下拉伸：只改变高度
        newHeight = Math.max(400, Math.min(window.innerHeight - 50, resizeStartSize.height + deltaY))
      }
      if (direction.includes('n')) {
        // 向上拉伸：改变高度并调整位置
        const maxHeight = resizeStartPos.panelY + resizeStartSize.height - 50 // 确保不超出上边界
        newHeight = Math.max(400, Math.min(maxHeight, resizeStartSize.height - deltaY))
        newY = resizeStartPos.panelY + resizeStartSize.height - newHeight
      }
      
      panelSize.width = newWidth
      panelSize.height = newHeight
      panelPosition.x = newX
      panelPosition.y = newY
    }
    
    // 拉伸结束
    const stopResize = () => {
      isResizing.value = false
      resizeDirection.value = ''
      document.removeEventListener('mousemove', onResize, { passive: false })
      document.removeEventListener('mouseup', stopResize, { passive: true })
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    
    // 获取拉伸方向对应的光标
    const getCursorForDirection = (direction) => {
      const cursors = {
        'n': 'n-resize',
        's': 's-resize',
        'w': 'w-resize',
        'e': 'e-resize',
        'nw': 'nw-resize',
        'ne': 'ne-resize',
        'sw': 'sw-resize',
        'se': 'se-resize'
      }
      return cursors[direction] || 'default'
    }
    
    // 组件卸载时清理事件监听
    onUnmounted(() => {
      stopDrag()
      stopResize()
      // 清理语言切换监听器
      window.removeEventListener('locale-changed', handleLocaleChange)
    })
    
    // 暴露方法给父组件
    const expose = {
      toggleAI,
      closeAI,
      isOpen
    }
    
    return {
      isOpen,
      showSettings,
      currentMessage,
      messages,
      isLoading,
      testing,
      testResult,
      hasUnreadMessages,
      messagesContainer,
      messageInput,
      currentConfig,
      currentProviderConfig,
      isConfigured,
      canSend,
      toggleAI,
      closeAI,
      onProviderChange,
      testConnection,
      saveSettings,
      sendMessage,
      handleKeydown,
      formatTime,
      formatErrorMessage,
      renderMarkdown,
      escapeHtml,
      handleChatWheel,
      startDrag,
      startResize,
      panelStyle,
      t,
      ...expose
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-assistant {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    
    // 确保按钮在移动端不被遮挡
    z-index: 1002;
  }
}

.ai-trigger-btn {
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
  
  // 为触摸设备增加更大的点击区域
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  // 移动端优化
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    
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
    
    // 移动端按下效果
    &:active {
      transform: scale(0.95);
    }
  }
  
  .notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 12px;
    height: 12px;
    background: #ff4444;
    border-radius: 50%;
    border: 2px solid white;
    
    @media (max-width: 768px) {
      top: 10px;
      right: 10px;
      width: 14px;
      height: 14px;
    }
  }
}

.ai-panel {
  position: fixed;
  bottom: 70px;
  right: 0;
  min-width: 300px;
  min-height: 400px;
  max-width: 90vw;
  max-height: 90vh;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  // 移动端全屏模式
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    transform: none !important;
    z-index: 1003;
    
    // 滑入动画
    animation: slideInFromBottom 0.3s ease-out;
  }
  
  @media (max-width: 480px) {
    min-width: unset;
  }
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-color-secondary);
  border-bottom: 1px solid var(--border-color);
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
  
  // 移动端优化
  @media (max-width: 768px) {
    padding: 1rem 1rem;
    cursor: default;
    
    // 移动端禁用拖拽提示
    .drag-hint {
      display: none;
    }
  }
}

.ai-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
  
  .drag-hint {
    font-size: 0.75rem;
    color: var(--text-color-light);
    margin-left: 0.5rem;
    opacity: 0.7;
  }
}

.ai-actions {
  display: flex;
  gap: 0.5rem;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: var(--text-color-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    // 触摸优化
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:hover {
      background: var(--bg-color-hover);
      color: var(--text-color);
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      width: 44px;
      height: 44px;
      
      // 增加点击区域
      &::before {
        content: '';
        position: absolute;
        top: -6px;
        right: -6px;
        bottom: -6px;
        left: -6px;
        border-radius: 6px;
      }
      
      &:active {
        background: var(--bg-color-hover);
        transform: scale(0.95);
      }
    }
  }
}

.ai-settings {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-color);
    font-size: 0.9rem;
  }
  
  select,
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-color);
    color: var(--text-color);
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: 1rem;
      font-size: 16px; // 防止iOS缩放
      min-height: 48px;
      
      // 触摸优化
      -webkit-tap-highlight-color: transparent;
    }
  }
}

  .setting-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    
    // 触摸优化
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: 1rem;
      font-size: 1rem;
      min-height: 48px;
      
      &:active:not(:disabled) {
        transform: scale(0.98);
      }
    }
  }
  
  .test-btn {
    background: var(--bg-color-secondary);
    color: var(--text-color);
    
    &:hover:not(:disabled) {
      background: var(--bg-color-hover);
    }
  }
  
  .save-btn {
    background: var(--primary-color);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-color-dark);
    }
  }
}

.test-result {
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  
  &.success {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  
  &.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
}

.ai-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
  
  .dark & {
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.message {
  display: flex;
  
  &.user {
    justify-content: flex-end;
    
    .message-content {
      background: var(--primary-color);
      color: white;
      max-width: 80%;
    }
  }
  
  &.ai {
    justify-content: flex-start;
    
    .message-content {
      background: var(--bg-color-secondary);
      color: var(--text-color);
      max-width: 85%;
    }
  }
  
  &.loading .message-content {
    background: var(--bg-color-secondary);
    color: var(--text-color);
  }
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  word-wrap: break-word;
  
  // Markdown样式
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin: 0.5rem 0 0.25rem 0;
    font-weight: 600;
    line-height: 1.3;
  }
  
  :deep(p) {
    margin: 0.5rem 0;
    line-height: 1.5;
  }
  
  :deep(ul), :deep(ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    
    li {
      margin: 0.25rem 0;
      line-height: 1.4;
    }
  }
  
  :deep(code) {
    background: var(--code-bg-color);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-size: 0.875rem;
    font-family: 'Consolas', 'Monaco', monospace;
  }
  
  :deep(pre) {
    background: var(--code-bg-color);
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 0.5rem 0;
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  :deep(blockquote) {
    border-left: 3px solid var(--primary-color);
    padding-left: 0.75rem;
    margin: 0.5rem 0;
    font-style: italic;
    color: var(--text-color-light);
  }
  
  :deep(strong) {
    font-weight: 600;
    color: var(--text-color);
  }
  
  :deep(em) {
    font-style: italic;
  }
  
  :deep(a) {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
    font-size: 0.875rem;
    
    th, td {
      border: 1px solid var(--border-color);
      padding: 0.5rem;
      text-align: left;
    }
    
    th {
      background: var(--bg-color-secondary);
      font-weight: 600;
    }
  }
}

.message-text {
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.loading-dots {
  display: flex;
  gap: 0.25rem;
  
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0; }
  }
}

@keyframes pulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  
  // 移动端键盘适配
  @media (max-width: 768px) {
    padding: 1rem;
    
    // 确保在虚拟键盘弹出时仍可见
    position: sticky;
    bottom: 0;
    background: var(--bg-color);
    z-index: 10;
  }
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  
  textarea {
    flex: 1;
    min-height: 40px;
    max-height: 100px;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color);
    color: var(--text-color);
    resize: none;
    font-family: inherit;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      padding: 1rem;
      font-size: 16px; // 防止iOS自动缩放
      min-height: 48px;
      max-height: 120px;
      
      // 触摸优化
      -webkit-tap-highlight-color: transparent;
      -webkit-appearance: none;
    }
  }
  
  .send-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: var(--primary-color);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: var(--primary-color-dark);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    // 移动端优化
    @media (max-width: 768px) {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      
      // 触摸优化
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      
      &:active:not(:disabled) {
        transform: scale(0.95);
      }
    }
  }
}

.config-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
  border-radius: 6px;
  font-size: 0.85rem;
}

// 滑入动画
@keyframes slideInFromBottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// 拉伸手柄样式
.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  // 移动端隐藏拉伸手柄
  @media (max-width: 768px) {
    display: none;
  }
}

.resize-handle {
  position: absolute;
  pointer-events: all;
  background: transparent;
  
  &::after {
    content: '';
    position: absolute;
    background: var(--primary-color);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 0.5;
  }
}

// 边缘拉伸手柄
.resize-handle-n {
  top: -3px;
  left: 8px;
  right: 8px;
  height: 6px;
  cursor: n-resize;
  
  &::after {
    top: 2px;
    left: 0;
    right: 0;
    height: 2px;
  }
}

.resize-handle-s {
  bottom: -3px;
  left: 8px;
  right: 8px;
  height: 6px;
  cursor: s-resize;
  
  &::after {
    bottom: 2px;
    left: 0;
    right: 0;
    height: 2px;
  }
}

.resize-handle-w {
  left: -3px;
  top: 8px;
  bottom: 8px;
  width: 6px;
  cursor: w-resize;
  
  &::after {
    left: 2px;
    top: 0;
    bottom: 0;
    width: 2px;
  }
}

.resize-handle-e {
  right: -3px;
  top: 8px;
  bottom: 8px;
  width: 6px;
  cursor: e-resize;
  
  &::after {
    right: 2px;
    top: 0;
    bottom: 0;
    width: 2px;
  }
}

// 角落拉伸手柄
.resize-handle-nw {
  top: -3px;
  left: -3px;
  width: 12px;
  height: 12px;
  cursor: nw-resize;
  
  &::after {
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

.resize-handle-ne {
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  cursor: ne-resize;
  
  &::after {
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

.resize-handle-sw {
  bottom: -3px;
  left: -3px;
  width: 12px;
  height: 12px;
  cursor: sw-resize;
  
  &::after {
    bottom: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}

.resize-handle-se {
  bottom: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  cursor: se-resize;
  
  &::after {
    bottom: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}
</style> 