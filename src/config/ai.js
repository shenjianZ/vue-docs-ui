// AI 配置管理
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  CLAUDE: 'claude',
  GEMINI: 'gemini',
  DEEPSEEK: 'deepseek',
  DEEPSEEK_V3: 'deepseek-v3',
  DEEPSEEK_REASONER: 'deepseek-reasoner',
  CUSTOM: 'custom'
}

export const DEFAULT_AI_CONFIG = {
  enabled: false,
  provider: AI_PROVIDERS.OPENAI,
  systemPrompt: '你是Vue Docs UI文档网站的AI助手。你的任务是帮助用户理解文档内容，回答技术问题，并提供有用的指导。\n\n请遵循以下原则：\n1. 提供准确、有用的技术信息\n2. 保持友好、专业的语调\n3. 如果不确定答案，请诚实地说明\n4. 尽量给出具体的代码示例或步骤\n5. 使用中文回答问题\n\n你特别擅长回答关于：\n- Vue.js 开发\n- 组件库使用\n- 文档编写和维护\n- 前端开发最佳实践\n- 技术概念解释',
  models: {
    [AI_PROVIDERS.OPENAI]: {
      modelId: 'gpt-3.5-turbo',
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      maxTokens: 4000,
      temperature: 0.7
    },
    [AI_PROVIDERS.CLAUDE]: {
      modelId: 'claude-3-sonnet-20240229',
      apiKey: '',
      baseUrl: 'https://api.anthropic.com',
      maxTokens: 4000,
      temperature: 0.7
    },
    [AI_PROVIDERS.GEMINI]: {
      modelId: 'gemini-pro',
      apiKey: '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      maxTokens: 4000,
      temperature: 0.7
    },
    [AI_PROVIDERS.DEEPSEEK]: {
      modelId: 'deepseek-chat',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com',
      maxTokens: 4000,
      temperature: 0.7
    },
    [AI_PROVIDERS.DEEPSEEK_V3]: {
      modelId: 'deepseek-chat',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com',
      maxTokens: 4000,
      temperature: 0.7
    },
    [AI_PROVIDERS.DEEPSEEK_REASONER]: {
      modelId: 'deepseek-reasoner',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com',
      maxTokens: 4000,
      temperature: 0.7
    },
    [AI_PROVIDERS.CUSTOM]: {
      modelId: '',
      apiKey: '',
      baseUrl: '',
      maxTokens: 4000,
      temperature: 0.7
    }
  },
  features: {
    chatAssistant: true,
    documentSummary: true,
    codeExplanation: true,
    searchEnhancement: false
  },
  ui: {
    position: 'bottom-right', // bottom-right, bottom-left, sidebar
    theme: 'auto', // auto, light, dark
    size: 'medium' // small, medium, large
  }
}

// AI配置缓存
let aiConfig = null

// 加载AI配置
export async function loadAIConfig() {
  if (aiConfig) {
    console.log('🔄 使用缓存的AI配置:', aiConfig)
    return aiConfig
  }
  
  console.log('🔄 loadAIConfig 被调用，开始加载配置...')
  
  try {
    // 首先从配置文件加载基础配置
    let baseConfig = DEFAULT_AI_CONFIG
    console.log('📋 默认配置中的systemPrompt:', DEFAULT_AI_CONFIG.systemPrompt.substring(0, 50) + '...')
    
    console.log('🌐 尝试获取 /config/ai.json...')
    const response = await fetch('/config/ai.json')
    console.log('🌐 fetch响应状态:', response.status, response.statusText)
    
    if (response.ok) {
      const config = await response.json()
      console.log('📁 从ai.json加载的配置对象:', config)
      console.log('📁 ai.json中的systemPrompt存在:', !!config.systemPrompt)
      console.log('📁 ai.json中的systemPrompt长度:', config.systemPrompt?.length || 0)
      console.log('📁 ai.json中的systemPrompt内容预览:', config.systemPrompt ? config.systemPrompt.substring(0, 100) + '...' : '无')
      
      baseConfig = { ...DEFAULT_AI_CONFIG, ...config }
      console.log('🔀 合并后的baseConfig systemPrompt存在:', !!baseConfig.systemPrompt)
      console.log('🔀 合并后的baseConfig systemPrompt长度:', baseConfig.systemPrompt?.length || 0)
      console.log('🔀 合并后的baseConfig systemPrompt预览:', baseConfig.systemPrompt.substring(0, 100) + '...')
      console.log('✅ AI配置文件加载成功')
    } else {
      console.warn('⚠️ AI配置文件加载失败，状态码:', response.status)
      console.warn('⚠️ 使用默认配置')
    }
    
    // 然后从localStorage获取用户自定义配置（仅覆盖API密钥等用户设置）
    const stored = localStorage.getItem('vue-docs-ai-config')
    if (stored) {
      const storedConfig = JSON.parse(stored)
      console.log('💾 localStorage中的配置:', storedConfig)
      console.log('💾 localStorage中的systemPrompt:', storedConfig.systemPrompt ? storedConfig.systemPrompt.substring(0, 50) + '...' : '无')
      
      // 只合并models配置（API密钥等），保留配置文件中的systemPrompt等
      if (storedConfig.models) {
        Object.keys(storedConfig.models).forEach(provider => {
          if (baseConfig.models[provider]) {
            baseConfig.models[provider] = {
              ...baseConfig.models[provider],
              ...storedConfig.models[provider]
            }
          }
        })
      }
      // 合并provider选择
      if (storedConfig.provider) {
        baseConfig.provider = storedConfig.provider
      }
      
      // 明确排除systemPrompt，确保使用配置文件中的版本
      // 注意：即使localStorage中有systemPrompt，也不合并，以保留配置文件中的设置
      if (storedConfig.systemPrompt) {
        console.log('⚠️ 检测到localStorage中有systemPrompt，但将保留配置文件中的版本')
      }
      
      console.log('🔀 localStorage合并后的systemPrompt存在:', !!baseConfig.systemPrompt)
      console.log('🔀 localStorage合并后的systemPrompt长度:', baseConfig.systemPrompt?.length || 0)
      console.log('🔀 localStorage合并后的systemPrompt预览:', baseConfig.systemPrompt.substring(0, 100) + '...')
      console.log('✅ 用户自定义AI配置已合并')
    }
    
    console.log('🎯 最终配置的systemPrompt存在:', !!baseConfig.systemPrompt)
    console.log('🎯 最终配置的systemPrompt长度:', baseConfig.systemPrompt?.length || 0)
    console.log('🎯 最终配置的systemPrompt完整内容:', baseConfig.systemPrompt)
    aiConfig = baseConfig
    return aiConfig
  } catch (error) {
    console.error('❌ AI配置加载失败，使用默认配置:', error)
  }
  
  aiConfig = DEFAULT_AI_CONFIG
  return aiConfig
}

// 获取AI配置
export function getAIConfig() {
  return aiConfig || DEFAULT_AI_CONFIG
}

// 重新加载AI配置（清除缓存）
export function reloadAIConfig() {
  console.log('🔄 清除AI配置缓存，重新加载...')
  aiConfig = null
  return loadAIConfig()
}

// 更新AI配置
export function updateAIConfig(newConfig) {
  aiConfig = { ...aiConfig, ...newConfig }
  
  // 创建要保存到localStorage的配置副本，排除systemPrompt
  const configToStore = { ...aiConfig }
  delete configToStore.systemPrompt // 永远不保存systemPrompt到localStorage
  
  console.log('💾 保存配置到localStorage（已排除systemPrompt）:', configToStore)
  localStorage.setItem('vue-docs-ai-config', JSON.stringify(configToStore))
  return aiConfig
}

// 获取当前AI提供商的配置
export function getCurrentAIProvider() {
  const config = getAIConfig()
  return {
    provider: config.provider,
    ...config.models[config.provider]
  }
}

// 验证AI配置
export function validateAIConfig(config) {
  const errors = []
  
  // 检查提供商是否有效
  const validProviders = Object.values(AI_PROVIDERS)
  if (!config.provider || !validProviders.includes(config.provider)) {
    errors.push('settings.errors.invalidProvider')
  }
  
  const providerConfig = config.models?.[config.provider]
  if (!providerConfig) {
    errors.push('settings.errors.missingProviderConfig')
  } else {
    if (!providerConfig.apiKey || providerConfig.apiKey.trim() === '') {
      errors.push('settings.errors.missingApiKey')
    }
    if (!providerConfig.modelId || providerConfig.modelId.trim() === '') {
      errors.push('settings.errors.missingModelId')
    }
    if (!providerConfig.baseUrl || providerConfig.baseUrl.trim() === '') {
      errors.push('settings.errors.missingBaseUrl')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 测试AI连接
export async function testAIConnection() {
  const validation = validateAIConfig(getAIConfig())
  
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.errors.join(', ')
    }
  }
  
  try {
    // 动态导入AI服务以避免循环依赖
    const { testAIConnection: testService } = await import('../services/aiService.js')
    return await testService()
  } catch (error) {
    return {
      success: false,
      message: `settings.errors.connectionFailed: ${error.message}`
    }
  }
}

// 添加全局调试方法
if (typeof window !== 'undefined') {
  window.debugAI = {
    async reloadConfig() {
      console.log('🔧 手动重新加载AI配置...')
      const config = await reloadAIConfig()
      console.log('🔧 重新加载后的配置:', config)
      return config
    },
    
    async testSystemPrompt() {
      console.log('🔧 测试systemPrompt加载...')
      const config = await loadAIConfig()
      console.log('🔧 当前systemPrompt:', config.systemPrompt)
      return config.systemPrompt
    },
    
    getCurrentConfig() {
      console.log('🔧 当前缓存的配置:', getAIConfig())
      return getAIConfig()
    },
    
    clearCache() {
      console.log('🔧 清除AI配置缓存...')
      aiConfig = null
      console.log('🔧 缓存已清除')
    },
    
    checkLocalStorage() {
      console.log('🔧 检查localStorage中的AI配置...')
      const stored = localStorage.getItem('vue-docs-ai-config')
      if (stored) {
        const config = JSON.parse(stored)
        console.log('🔧 localStorage中的配置:', config)
        console.log('🔧 localStorage中是否包含systemPrompt:', !!config.systemPrompt)
        if (config.systemPrompt) {
          console.log('🔧 localStorage中的systemPrompt:', config.systemPrompt)
        }
        return config
      } else {
        console.log('🔧 localStorage中没有AI配置')
        return null
      }
    },
    
    cleanLocalStorage() {
      console.log('🔧 清理localStorage中的AI配置...')
      localStorage.removeItem('vue-docs-ai-config')
      console.log('🔧 localStorage已清理')
    },
    
    async fullReset() {
      console.log('🔧 执行完整重置...')
      this.cleanLocalStorage()
      this.clearCache()
      const config = await this.reloadConfig()
      console.log('🔧 重置完成，当前systemPrompt长度:', config.systemPrompt?.length || 0)
      return config
    }
  }
} 