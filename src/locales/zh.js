export default {
  nav: {
    home: '首页',
    guide: '指南',
    api: 'API',
    examples: '示例',
    about: '关于',
    language: '语言',
    tableOfContents: '目录',
    more: '更多'
  },
  sidebar: {
    gettingStarted: '快速开始',
    introduction: '介绍',
    installation: '安装',
    quickStart: '快速上手',
    configuration: '配置说明',
    advancedGuide: '进阶指南',
    customThemes: '自定义主题',
    componentDevelopment: '组件开发',
    apiReference: 'API 参考',
    deployment: '部署',
    examples: '示例',
    basicExample: '基础示例'
  },
  common: {
    search: '搜索',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    menu: '菜单',
    close: '关闭',
    back: '返回',
    next: '下一页',
    prev: '上一页',
    toc: '目录',
    edit: '编辑此页',
    lastUpdated: '最后更新',
    contributors: '贡献者',
    custom: '自定义',
    draggable: '可拖拽',
    loading: '正在加载内容...',
    error: '加载失败',
    retry: '重试',
    prevSection: '← 上一节',
    nextSection: '下一节 →',
    articleTitle: '页面',
    noContent: '此页面的内容正在编写中...',
    loadError: '无法加载文章内容，请稍后重试。'
  },
  ai: {
    assistant: 'AI助手',
    open: '打开AI助手',
    close: '关闭AI助手',
    settings: '设置',
    test: '测试连接',
    save: '保存设置',
    placeholder: '问我任何关于文档的问题...',
    configNotice: '请先配置AI设置',
    welcome: '您好！我是AI助手，可以帮助您解答文档相关的问题。',
    demoMessages: {
      user1: '你好，我想了解一下这个文档系统的功能。',
      ai1: '很高兴为您介绍！这个文档系统包含以下主要功能：\n\n1. **多语言支持** - 支持中文和英文切换\n2. **AI助手** - 可以回答文档相关问题\n3. **响应式设计** - 支持各种设备尺寸\n4. **主题切换** - 支持亮色和暗色主题\n5. **搜索功能** - 快速查找文档内容',
      user2: '这些功能很棒，可以详细介绍一下AI助手的功能吗？',
      ai2: 'AI助手具备以下能力：\n\n**对话功能**\n- 实时对话交流\n- 支持markdown格式回复\n- 保存对话历史\n\n**技术特性**\n- 支持多种AI模型（OpenAI、Claude、Gemini等）\n- 可配置API密钥和端点\n- 连接测试功能\n\n**用户体验**\n- 可拖拽移动窗口\n- 可调整窗口大小\n- 平滑滚动体验'
    }
  },
  settings: {
    title: '设置',
    provider: 'AI提供商',
    model: '模型ID',
    apiKey: 'API密钥',
    baseUrl: 'API基础URL',
    testing: '测试中...',
    testConnection: '测试连接',
    saveSettings: '保存设置',
    closeSettings: '关闭设置',
    saveSuccess: '设置已自动保存！',
    apiKeyPlaceholder: '输入您的API密钥',
    baseUrlPlaceholder: 'API端点URL',
    modelPlaceholder: '例如: gpt-3.5-turbo',
    errors: {
      invalidProvider: '无效的AI提供商',
      missingProviderConfig: '缺少提供商配置',
      missingApiKey: '缺少API密钥',
      missingModelId: '缺少模型ID',
      missingBaseUrl: '缺少API基础URL',
      connectionFailed: '连接测试失败'
    }
  },
  
  // 主题相关
  theme: {
    themes: {
      default: {
        name: '默认主题',
        description: '经典蓝色风格'
      },
      vue: {
        name: 'Vue主题',
        description: 'Vue官网绿色风格'
      },
      github: {
        name: 'GitHub主题',
        description: 'GitHub黑白灰风格'
      },
      purple: {
        name: '紫色主题',
        description: '优雅紫色风格'
      },
      orange: {
        name: '橙色主题',
        description: '温暖橙色风格'
      },
      emerald: {
        name: '翠绿主题',
        description: '清新翠绿风格'
      }
    },
    darkMode: '深色模式',
    lightMode: '浅色模式'
  },
  
  // 阅读进度相关
  readingProgress: {
    estimatedTime: '预计阅读',
    progress: '进度',
    words: '字',
    minutes: '分钟',
    autoScroll: '自动滚动',
    stopAutoScroll: '停止自动滚动',
    startAutoScroll: '开始自动滚动',
    backToTop: '回到顶部',
    showInfo: '显示信息',
    hideInfo: '隐藏信息'
  },
  
  // 反馈系统相关
  feedback: {
    title: '页面反馈',
    triggerTitle: '给文档提供反馈',
    quickQuestion: '这个页面对您有帮助吗？',
    helpful: '有帮助',
    notHelpful: '没帮助',
    feedbackType: '反馈类型',
    selectType: '请选择',
    types: {
      content: '内容问题',
      typo: '错别字',
      missing: '缺少信息',
      suggestion: '改进建议',
      bug: '页面错误',
      question: '疑问',
      other: '其他'
    },
    detailLabel: '详细说明',
    detailPlaceholder: '请详细描述您的反馈...',
    contactLabel: '如有需要，允许我们联系您获取更多信息',
    emailPlaceholder: '您的邮箱（可选）',
    submit: '提交反馈',
    cancel: '取消',
    successMessage: '感谢您的反馈！',
    stats: {
      visitors: '访问',
      helpful: '有用',
      feedback: '反馈'
    }
  }
} 