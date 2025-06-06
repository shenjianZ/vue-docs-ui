# 配置说明

Vue Docs UI 提供了丰富的配置选项，让您可以完全自定义文档网站的外观和行为。

## 📁 配置文件

Vue Docs UI 使用 YAML 格式的配置文件，支持多语言配置：

- `public/config/site.yaml` - 默认（中文）配置
- `public/config/site.en.yaml` - 英文配置
- `public/config/ai.json` - AI 助手配置

## 🌐 网站基本配置

### site 配置

```yaml
site:
  title: "网站标题"
  description: "网站描述"
  logo: "📚"  # 支持 emoji、图片URL、本地图片路径
  author: "作者名称"
```

#### logo 配置选项

```yaml
# 1. 使用 emoji
logo: "📚"

# 2. 使用图片 URL
logo: "https://example.com/logo.png"

# 3. 使用本地图片（放在 public 目录下）
logo: "/images/logo.png"

# 4. 使用相对路径
logo: "./assets/logo.svg"
```

## 🧭 导航配置

### 顶部导航栏

```yaml
navbar:
  items:
    - title: "首页"
      link: "/"
      active: true  # 可选，标记为活跃状态
    - title: "指南"
      link: "/guide/introduction"
    - title: "GitHub"
      link: "https://github.com/your-repo"
      external: true  # 外部链接
```

### 侧边栏导航

```yaml
sidebar:
  sections:
    - title: "快速开始"
      path: "/guide"
      children:
        - title: "介绍"
          path: "/guide/introduction"
        - title: "安装"
          path: "/guide/installation"
    - title: "进阶指南"
      path: "/advanced"
      children:
        - title: "自定义主题"
          path: "/advanced/themes"
```

## 🎨 主题配置

### 基本主题设置

```yaml
theme:
  # 默认主题模式
  defaultMode: "auto"  # "light" | "dark" | "auto"
  
  # 是否允许用户切换主题
  allowToggle: true
```

### 颜色配置

```yaml
theme:
  colors:
    primary: "#3b82f6"        # 主色调
    secondary: "#64748b"      # 次要颜色
    accent: "#06b6d4"         # 强调色
    background: "#ffffff"     # 背景色
    surface: "#f8fafc"        # 表面色
    text: "#1e293b"          # 文本色
    textSecondary: "#64748b"  # 次要文本色
    border: "#e2e8f0"        # 边框色
    success: "#10b981"       # 成功色
    warning: "#f59e0b"       # 警告色
    error: "#ef4444"         # 错误色
```

### 字体配置

```yaml
theme:
  fonts:
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    mono: "JetBrains Mono, Consolas, Monaco, monospace"
```

### 布局配置

```yaml
theme:
  layout:
    headerHeight: "60px"      # 头部高度
    sidebarWidth: "280px"     # 侧边栏宽度
    tocWidth: "240px"         # 目录宽度
    contentMaxWidth: "1200px" # 内容最大宽度
```

## 📋 目录配置

```yaml
toc:
  # 目录最大层级 (1-6)
  maxLevel: 3
  
  # 是否启用目录
  enabled: true
  
  # 目录标题
  title: "目录"
  
  # 是否在移动端显示
  showOnMobile: false
```

## 🔍 搜索配置

```yaml
search:
  enabled: true
  # 搜索提供商: 'local' | 'algolia'
  provider: "local"
  
  # Algolia 搜索配置
  algolia:
    appId: "your-app-id"
    apiKey: "your-search-api-key"
    indexName: "your-index-name"
```

## 🦶 页脚配置

```yaml
footer:
  enabled: true
  copyright: "© 2024 Vue Docs UI. All rights reserved."
  links:
    - title: "文档"
      link: "/guide/introduction"
    - title: "GitHub"
      link: "https://github.com/shenjianZ/vue-docs-ui"
      external: true
    - title: "许可证"
      link: "/license"
```

## 📊 分析配置

```yaml
analytics:
  # Google Analytics
  google:
    enabled: false
    id: "GA_MEASUREMENT_ID"
  
  # 其他分析服务可以在这里添加
```

## 📱 PWA 配置

```yaml
pwa:
  enabled: false
  name: "Vue Docs UI"
  shortName: "VueDocsUI"
  description: "Beautiful documentation websites made simple"
  themeColor: "#3b82f6"
  backgroundColor: "#ffffff"
```

## 🤖 AI 助手配置

AI 助手使用单独的 JSON 配置文件 `public/config/ai.json`：

```json
{
  "enabled": true,
  "provider": "openai",
  "models": {
    "openai": {
      "modelId": "gpt-3.5-turbo",
      "apiKey": "your-api-key",
      "baseUrl": "https://api.openai.com/v1",
      "maxTokens": 4000,
      "temperature": 0.7
    },
    "claude": {
      "modelId": "claude-3-sonnet-20240229",
      "apiKey": "your-api-key",
      "baseUrl": "https://api.anthropic.com",
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

### 支持的 AI 模型

- **OpenAI**: GPT-3.5, GPT-4
- **Claude**: Claude-3 Sonnet, Claude-3 Opus
- **Gemini**: Gemini Pro
- **DeepSeek**: DeepSeek Chat, DeepSeek Reasoner
- **Custom**: 自定义 API 兼容的模型

## 🌐 多语言配置

### 语言检测

Vue Docs UI 会自动检测用户的浏览器语言，并加载对应的配置文件：

- 中文：`site.yaml`
- 英文：`site.en.yaml`
- 其他语言：`site.{lang}.yaml`

### 添加新语言

1. 创建语言配置文件：`public/config/site.fr.yaml`
2. 创建对应的文档目录：`public/docs/fr/`
3. 添加语言翻译文件（如果需要自定义 UI 文本）

## 📝 文档配置

### 文档目录结构

```
public/docs/
├── zh-cn/          # 中文文档
│   ├── index.md    # 首页
│   ├── guide/      # 指南
│   └── api/        # API 文档
└── en/             # 英文文档
    ├── index.md
    ├── guide/
    └── api/
```

### Markdown 配置

Vue Docs UI 支持标准 Markdown 语法，以及以下扩展：

- **代码高亮**: 使用 Prism.js
- **数学公式**: 支持 LaTeX 语法
- **表格**: 响应式表格
- **任务列表**: `- [ ]` 和 `- [x]`
- **脚注**: `[^1]` 语法

## 🔧 高级配置

### 自定义 CSS

创建 `public/styles/custom.css` 来覆盖默认样式：

```css
:root {
  --primary-color: #your-color;
  --font-family: 'Your Font', sans-serif;
}

.docs-header {
  /* 自定义头部样式 */
}
```

### 自定义组件

您可以通过插件系统添加自定义组件：

```javascript
import { createDocsApp } from 'vue-docs-ui'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  plugins: [
    // 您的自定义插件
  ]
})
```

## 📚 配置示例

### 完整配置示例

```yaml
# 网站基本配置
site:
  title: "我的技术博客"
  description: "分享前端开发经验和技术心得"
  logo: "/images/logo.png"
  author: "张三"

# 导航配置
navbar:
  items:
    - title: "首页"
      link: "/"
    - title: "技术文章"
      link: "/articles/javascript"
    - title: "关于我"
      link: "/about"
    - title: "GitHub"
      link: "https://github.com/zhangsan"
      external: true

# 侧边栏配置
sidebar:
  sections:
    - title: "JavaScript"
      path: "/articles/javascript"
      children:
        - title: "ES6 新特性"
          path: "/articles/javascript/es6"
        - title: "异步编程"
          path: "/articles/javascript/async"
    - title: "Vue.js"
      path: "/articles/vue"
      children:
        - title: "组件开发"
          path: "/articles/vue/components"

# 主题配置
theme:
  defaultMode: "light"
  allowToggle: true
  colors:
    primary: "#42b883"
    accent: "#35495e"
  fonts:
    primary: "Source Sans Pro, sans-serif"

# 目录配置
toc:
  maxLevel: 2
  enabled: true
  title: "本页目录"

# 页脚配置
footer:
  enabled: true
  copyright: "© 2024 张三的技术博客"
  links:
    - title: "RSS"
      link: "/rss.xml"
    - title: "站点地图"
      link: "/sitemap.xml"
```

## 🔍 配置验证

Vue Docs UI 会在启动时验证配置文件的格式和内容。如果发现错误，会在控制台显示详细的错误信息。

常见配置错误：

1. **YAML 语法错误**: 检查缩进和语法
2. **路径错误**: 确保文档路径存在
3. **颜色格式错误**: 使用有效的 CSS 颜色值
4. **必需字段缺失**: 确保必需的配置项都已填写

## 📚 下一步

- 查看 [自定义主题](/advanced/themes) 了解更多主题定制选项
- 阅读 [API 参考](/advanced/api) 了解完整的配置 API
- 探索 [组件开发](/advanced/components) 学习如何扩展功能 