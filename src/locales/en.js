export default {
  nav: {
    home: 'Home',
    guide: 'Guide',
    api: 'API',
    examples: 'Examples',
    about: 'About',
    language: 'Language',
    tableOfContents: 'Table of Contents',
    more: 'more'
  },
  sidebar: {
    gettingStarted: 'Getting Started',
    introduction: 'Introduction',
    installation: 'Installation',
    quickStart: 'Quick Start',
    configuration: 'Configuration',
    advancedGuide: 'Advanced Guide',
    customThemes: 'Custom Themes',
    componentDevelopment: 'Component Development',
    apiReference: 'API Reference',
    deployment: 'Deployment',
    examples: 'Examples',
    basicExample: 'Basic Example'
  },
  common: {
    search: 'Search',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    menu: 'Menu',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    prev: 'Previous',
    toc: 'Table of Contents',
    edit: 'Edit this page',
    lastUpdated: 'Last updated',
    contributors: 'Contributors',
    custom: 'Custom',
    draggable: 'Draggable',
    loading: 'Loading content...',
    error: 'Failed to load',
    retry: 'Retry',
    prevSection: '← Previous',
    nextSection: 'Next →',
    articleTitle: 'Page',
    noContent: 'Content for this page is being written...',
    loadError: 'Unable to load article content, please try again later.'
  },
  ai: {
    assistant: 'AI Assistant',
    open: 'Open AI Assistant',
    close: 'Close AI Assistant',
    settings: 'Settings',
    test: 'Test Connection',
    save: 'Save Settings',
    placeholder: 'Ask me anything about the documentation...',
    configNotice: 'Please configure AI settings first',
    welcome: 'Hello! I am an AI assistant that can help you answer questions related to the documentation.',
    demoMessages: {
      user1: 'Hello, I would like to learn about the features of this documentation system.',
      ai1: 'I am happy to introduce you to the main features of this documentation system:\n\n1. **Multi-language Support** - Supports Chinese and English switching\n2. **AI Assistant** - Can answer documentation-related questions\n3. **Responsive Design** - Supports various device sizes\n4. **Theme Switching** - Supports light and dark themes\n5. **Search Function** - Quickly find document content',
      user2: 'These features are great! Can you introduce the AI assistant features in detail?',
      ai2: 'AI Assistant has the following capabilities:\n\n**Conversation Features**\n- Real-time conversation\n- Supports markdown format replies\n- Save conversation history\n\n**Technical Features**\n- Supports multiple AI models (OpenAI, Claude, Gemini, etc.)\n- Configurable API keys and endpoints\n- Connection testing functionality\n\n**User Experience**\n- Draggable window\n- Resizable window\n- Smooth scrolling experience'
    }
  },
  settings: {
    title: 'Settings',
    provider: 'AI Provider',
    model: 'Model ID',
    apiKey: 'API Key',
    baseUrl: 'API Base URL',
    testing: 'Testing...',
    testConnection: 'Test Connection',
    saveSettings: 'Save Settings',
    closeSettings: 'Close Settings',
    saveSuccess: 'Settings auto-saved successfully!',
    apiKeyPlaceholder: 'Enter your API key',
    baseUrlPlaceholder: 'API endpoint URL',
    modelPlaceholder: 'e.g: gpt-3.5-turbo',
    errors: {
      invalidProvider: 'Invalid AI provider',
      missingProviderConfig: 'Missing provider configuration',
      missingApiKey: 'Missing API key',
      missingModelId: 'Missing model ID',
      missingBaseUrl: 'Missing API base URL',
      connectionFailed: 'Connection test failed'
    }
  },
  
  // Theme related
  theme: {
    themes: {
      default: {
        name: 'Default Theme',
        description: 'Classic blue style'
      },
      vue: {
        name: 'Vue Theme',
        description: 'Vue official green style'
      },
      github: {
        name: 'GitHub Theme',
        description: 'GitHub black and white style'
      },
      purple: {
        name: 'Purple Theme',
        description: 'Elegant purple style'
      },
      orange: {
        name: 'Orange Theme',
        description: 'Warm orange style'
      },
      emerald: {
        name: 'Emerald Theme',
        description: 'Fresh emerald style'
      }
    },
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode'
  },
  
  // Reading progress related
  readingProgress: {
    estimatedTime: 'Estimated reading',
    progress: 'Progress',
    words: 'words',
    minutes: 'minutes',
    autoScroll: 'Auto scroll',
    stopAutoScroll: 'Stop auto scroll',
    startAutoScroll: 'Start auto scroll',
    backToTop: 'Back to top',
    showInfo: 'Show info',
    hideInfo: 'Hide info'
  },
  
  // Feedback system related
  feedback: {
    title: 'Page Feedback',
    triggerTitle: 'Provide feedback for documentation',
    quickQuestion: 'Is this page helpful to you?',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
    feedbackType: 'Feedback type',
    selectType: 'Please select',
    types: {
      content: 'Content issue',
      typo: 'Typo',
      missing: 'Missing information',
      suggestion: 'Improvement suggestion',
      bug: 'Page error',
      question: 'Question',
      other: 'Other'
    },
    detailLabel: 'Detailed description',
    detailPlaceholder: 'Please describe your feedback in detail...',
    contactLabel: 'Allow us to contact you for more information if needed',
    emailPlaceholder: 'Your email (optional)',
    submit: 'Submit feedback',
    cancel: 'Cancel',
    successMessage: 'Thank you for your feedback!',
    stats: {
      visitors: 'visitors',
      helpful: 'helpful',
      feedback: 'feedback'
    }
  }
} 