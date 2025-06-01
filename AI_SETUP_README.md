# Vue Docs UI - AI 功能设置指南

## 概述

Vue Docs UI 现已集成AI助手功能，为用户提供智能文档问答、内容总结、代码解释等功能。

## 功能特性

- 🤖 **智能问答**: 基于文档内容回答用户问题
- 📝 **内容总结**: 自动总结文档章节内容
- 💻 **代码解释**: 解释代码片段和技术概念
- 🔧 **多模型支持**: 支持 OpenAI、Claude、Gemini、DeepSeek 等多种AI模型
- ⚙️ **灵活配置**: 可通过界面或配置文件进行设置

## 快速开始

### 1. 启用AI功能

AI助手默认以浮动按钮的形式出现在页面右下角。点击机器人图标即可打开AI面板。

### 2. 配置AI模型

首次使用需要配置AI模型参数：

1. 点击AI面板右上角的设置图标（⚙️）
2. 选择AI提供商（OpenAI、Claude、Gemini、DeepSeek或自定义）
3. 输入相应的API密钥和配置参数
4. 点击"测试连接"验证配置
5. 保存设置

### 3. 开始对话

配置完成后，即可在聊天界面中提问。AI助手能够：
- 回答关于文档内容的问题
- 解释技术概念和术语
- 提供学习建议和指导

## 配置方式

### 方式一：界面配置（推荐）

通过AI面板的设置界面进行配置，设置会自动保存到浏览器本地存储。

### 方式二：配置文件

在 `public/config/ai.json` 文件中预设配置：

```json
{
  "enabled": true,
  "provider": "deepseek",
  "models": {
    "openai": {
      "modelId": "gpt-3.5-turbo",
      "apiKey": "your-api-key-here",
      "baseUrl": "https://api.openai.com/v1",
      "maxTokens": 4000,
      "temperature": 0.7
    },
    "claude": {
      "modelId": "claude-3-sonnet-20240229",
      "apiKey": "your-claude-key-here",
      "baseUrl": "https://api.anthropic.com",
      "maxTokens": 4000,
      "temperature": 0.7
    },
    "deepseek": {
      "modelId": "deepseek-chat",
      "apiKey": "your-deepseek-key-here",
      "baseUrl": "https://api.deepseek.com",
      "maxTokens": 4000,
      "temperature": 0.7
    },
    "deepseek-r1": {
      "modelId": "deepseek-r1",
      "apiKey": "your-deepseek-key-here",
      "baseUrl": "https://api.deepseek.com",
      "maxTokens": 4000,
      "temperature": 0.7
    }
  },
  "features": {
    "chatAssistant": true,
    "documentSummary": true,
    "codeExplanation": true,
    "searchEnhancement": false
  },
  "ui": {
    "position": "bottom-right",
    "theme": "auto",
    "size": "medium"
  }
}
```

## 支持的AI提供商

### OpenAI
- **模型示例**: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`
- **API文档**: https://platform.openai.com/docs
- **获取API密钥**: https://platform.openai.com/api-keys

### Claude (Anthropic)
- **模型示例**: `claude-3-sonnet-20240229`, `claude-3-opus-20240229`
- **API文档**: https://docs.anthropic.com/claude/reference
- **获取API密钥**: https://console.anthropic.com

### Gemini (Google)
- **模型示例**: `gemini-pro`, `gemini-pro-vision`
- **API文档**: https://ai.google.dev/docs
- **获取API密钥**: https://makersuite.google.com/app/apikey

### DeepSeek
- **模型示例**: `deepseek-chat`, `deepseek-r1`
- **API文档**: https://platform.deepseek.com/api-docs
- **获取API密钥**: https://platform.deepseek.com/api_keys
- **特点**: 高性价比的中文友好AI模型，支持长上下文

### 自定义模型
支持任何兼容OpenAI API格式的模型服务，包括：
- Azure OpenAI
- 本地部署的模型（如Ollama、LM Studio等）
- 其他第三方API服务

## 配置参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `enabled` | 是否启用AI功能 | `false` |
| `provider` | AI提供商 | `openai` |
| `modelId` | 模型标识符 | `gpt-3.5-turbo` |
| `apiKey` | API密钥 | 空 |
| `baseUrl` | API基础URL | 提供商默认URL |
| `maxTokens` | 最大令牌数 | `4000` |
| `temperature` | 温度参数（0-1） | `0.7` |

## 使用技巧

1. **具体提问**: 提问时请尽量具体，这样AI能给出更准确的回答
2. **上下文引用**: 可以引用具体的章节或概念名称
3. **分步提问**: 复杂问题可以分步骤提问
4. **代码询问**: 可以直接粘贴代码片段询问解释

## 示例对话

```
用户: 什么是机器学习？
AI: 机器学习是人工智能的一个重要分支，它是一种让计算机系统能够通过数据学习和改进性能的方法...

用户: 监督学习和无监督学习有什么区别？
AI: 监督学习和无监督学习的主要区别在于训练数据是否包含标签...

用户: 如何选择合适的机器学习算法？
AI: 选择机器学习算法需要考虑以下几个因素：数据类型、数据量、问题类型...
```

## 故障排除

### 常见问题

**Q: AI助手不响应或响应很慢**
A: 检查网络连接和API密钥是否正确，某些模型可能需要较长响应时间。

**Q: 提示"请先配置AI设置"**
A: 需要先在设置面板中配置有效的API密钥和模型参数。

**Q: API密钥验证失败**
A: 确认API密钥是否正确，是否有足够的配额，以及API端点URL是否正确。

**Q: 模型回答不准确**
A: 可以尝试调整temperature参数，或更换更强大的模型。

### 调试模式

在浏览器开发者工具的控制台中，可以查看AI相关的日志信息：

```javascript
// 查看当前AI配置
console.log(window.aiConfig)

// 测试AI连接
window.testAIConnection()
```

## 安全注意事项

1. **API密钥安全**: 不要在公共代码仓库中提交包含真实API密钥的配置文件
2. **数据隐私**: AI提供商可能会记录对话内容，请避免输入敏感信息
3. **费用控制**: 设置合理的maxTokens限制，避免产生过高的API费用
4. **访问控制**: 在生产环境中考虑添加访问控制和使用限制

## 开发扩展

如需扩展AI功能，可以参考以下文件：
- `src/config/ai.js` - AI配置管理
- `src/components/AIAssistant.vue` - AI助手组件
- `src/utils/config.js` - 配置工具

## 技术支持

如遇到问题或需要技术支持，请：
1. 查看浏览器控制台的错误信息
2. 检查网络连接和API配置
3. 查阅相关AI提供商的官方文档
4. 在项目仓库中提交issue

---

*Vue Docs UI v1.0.6+ with AI Support* 