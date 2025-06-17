import OpenAI from 'openai'
import { getAIConfig, getCurrentAIProvider, loadAIConfig } from '../config/ai.js'

// AI服务类
class AIService {
  constructor() {
    this.clients = new Map() // 缓存不同提供商的客户端
  }

  // 获取或创建AI客户端
  getClient(provider, config) {
    const clientKey = `${provider}-${config.baseUrl}-${config.apiKey?.slice(-8)}`
    
    if (!this.clients.has(clientKey)) {
      let client
      
      switch (provider) {
        case 'openai':
        case 'deepseek':
        case 'deepseek-v3':
        case 'deepseek-reasoner':
        case 'custom':
          // 使用OpenAI SDK，支持DeepSeek和其他兼容API
          client = new OpenAI({
            baseURL: config.baseUrl,
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true // 允许在浏览器中使用
          })
          break
          
        case 'claude':
          // Anthropic Claude API (暂时使用OpenAI格式兼容)
          client = new OpenAI({
            baseURL: config.baseUrl,
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          })
          break
          
        case 'gemini':
          // Google Gemini API (暂时使用OpenAI格式兼容)
          client = new OpenAI({
            baseURL: config.baseUrl,
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true
          })
          break
          
        default:
          throw new Error(`不支持的AI提供商: ${provider}`)
      }
      
      this.clients.set(clientKey, client)
    }
    
    return this.clients.get(clientKey)
  }

  // 发送聊天消息
  async sendMessage(message, context = {}) {
    try {
      const aiConfig = getAIConfig()
      const providerConfig = getCurrentAIProvider()
      
      if (!providerConfig.apiKey) {
        throw new Error('未配置API密钥')
      }

      const client = this.getClient(aiConfig.provider, providerConfig)
      
      // 构建消息数组
      const messages = [
        {
          role: 'system',
          content: await this.getSystemPrompt(context)
        },
        {
          role: 'user',
          content: message
        }
      ]

      // 添加历史消息上下文（如果有的话）
      if (context.history && context.history.length > 0) {
        const historyMessages = context.history.slice(-4).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
        messages.splice(1, 0, ...historyMessages)
      }

      console.log('🤖 发送AI请求:', {
        provider: aiConfig.provider,
        model: providerConfig.modelId,
        messageCount: messages.length
      })

      // 发送请求
      const completion = await client.chat.completions.create({
        model: providerConfig.modelId,
        messages: messages,
        max_tokens: providerConfig.maxTokens,
        temperature: providerConfig.temperature,
        stream: false
      })

      const response = completion.choices[0]?.message?.content
      
      if (!response) {
        throw new Error('AI响应为空')
      }

      console.log('✅ AI响应成功')
      return response

    } catch (error) {
      console.error('❌ AI调用失败:', error)
      throw this.handleError(error)
    }
  }

  // 获取系统提示词
  async getSystemPrompt(context = {}) {
    // 确保从配置文件加载最新的AI配置
    const aiConfig = await loadAIConfig()
    
    console.log('🎯 获取系统提示词, AI配置:', {
      hasSystemPrompt: !!aiConfig.systemPrompt,
      systemPromptLength: aiConfig.systemPrompt?.length || 0,
      systemPromptPreview: aiConfig.systemPrompt?.substring(0, 50) || '无'
    })
    
    // 优先使用配置文件中的systemPrompt
    let basePrompt = aiConfig.systemPrompt
    
    // 如果配置中没有systemPrompt或为空，使用默认的
    if (!basePrompt || basePrompt.trim() === '') {
      basePrompt = `你是Vue Docs UI文档网站的AI助手。你的任务是帮助用户理解文档内容，回答技术问题，并提供有用的指导。

请遵循以下原则：
1. 提供准确、有用的技术信息
2. 保持友好、专业的语调
3. 如果不确定答案，请诚实地说明
4. 尽量给出具体的代码示例或步骤
5. 使用中文回答问题

你特别擅长回答关于：
- Vue.js 开发
- 组件库使用
- 文档编写和维护
- 前端开发最佳实践
- 技术概念解释`
      console.log('⚠️ 使用默认系统提示词')
    } else {
      console.log('✅ 使用配置文件中的系统提示词')
    }

    // 如果有当前页面上下文，添加相关信息
    if (context.currentPage) {
      return `${basePrompt}\n\n当前用户正在查看页面：${context.currentPage}`
    }

    if (context.documentContent) {
      return `${basePrompt}\n\n相关文档内容：\n${context.documentContent.slice(0, 1000)}`
    }

    return basePrompt
  }

  // 测试连接
  async testConnection() {
    try {
      const response = await this.sendMessage('你好，请回复一个简短的测试消息。', {})
      return {
        success: true,
        message: '连接测试成功',
        response: response
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  // 错误处理
  handleError(error) {
    if (error.code === 'invalid_api_key') {
      return new Error('API密钥无效，请检查配置')
    }
    
    if (error.code === 'insufficient_quota') {
      return new Error('API配额不足，请检查账户余额')
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return new Error('请求频率过高，请稍后重试')
    }
    
    if (error.code === 'model_not_found') {
      return new Error('指定的模型不存在，请检查模型配置')
    }
    
    if (error.message?.includes('fetch')) {
      return new Error('网络连接失败，请检查网络和API端点')
    }
    
    if (error.message?.includes('CORS')) {
      return new Error('跨域请求被阻止，请检查API配置')
    }
    
    return new Error(`AI调用失败: ${error.message}`)
  }

  // 清理缓存的客户端
  clearClients() {
    this.clients.clear()
  }
}

// 创建单例实例
const aiService = new AIService()

export default aiService

// 导出便捷方法
export const sendAIMessage = (message, context) => aiService.sendMessage(message, context)
export const testAIConnection = () => aiService.testConnection()
export const clearAIClients = () => aiService.clearClients() 