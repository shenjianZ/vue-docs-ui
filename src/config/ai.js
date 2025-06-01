// AI 配置管理
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  CLAUDE: 'claude',
  GEMINI: 'gemini',
  DEEPSEEK: 'deepseek',
  DEEPSEEK_V3: 'deepseek-v3',
  DEEPSEEK_R1: 'deepseek-r1',
  CUSTOM: 'custom'
}

export const DEFAULT_AI_CONFIG = {
  enabled: false,
  provider: AI_PROVIDERS.OPENAI,
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
    [AI_PROVIDERS.DEEPSEEK_R1]: {
      modelId: 'deepseek-r1',
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
    return aiConfig
  }
  
  try {
    // 尝试从localStorage获取配置
    const stored = localStorage.getItem('vue-docs-ai-config')
    if (stored) {
      aiConfig = { ...DEFAULT_AI_CONFIG, ...JSON.parse(stored) }
      return aiConfig
    }
    
    // 尝试从配置文件加载
    const response = await fetch('/config/ai.json')
    if (response.ok) {
      const config = await response.json()
      aiConfig = { ...DEFAULT_AI_CONFIG, ...config }
      return aiConfig
    }
  } catch (error) {
    console.warn('AI配置加载失败，使用默认配置:', error)
  }
  
  aiConfig = DEFAULT_AI_CONFIG
  return aiConfig
}

// 获取AI配置
export function getAIConfig() {
  return aiConfig || DEFAULT_AI_CONFIG
}

// 更新AI配置
export function updateAIConfig(newConfig) {
  aiConfig = { ...aiConfig, ...newConfig }
  localStorage.setItem('vue-docs-ai-config', JSON.stringify(aiConfig))
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