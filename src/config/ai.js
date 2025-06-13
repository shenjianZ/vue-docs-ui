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