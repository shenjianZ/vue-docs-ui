# API 参考

Vue Docs UI 提供了完整的 API 接口，让您可以程序化地控制文档网站的各个方面。

## 🚀 createDocsApp

主要的应用创建函数。

### 语法

```typescript
createDocsApp(options: DocsAppOptions): Promise<App>
```

### 参数

#### DocsAppOptions

```typescript
interface DocsAppOptions {
  // 配置文件路径
  configPath: string
  
  // 挂载元素选择器或元素
  el: string | Element
  
  // 自定义组件
  components?: Record<string, Component>
  
  // 插件
  plugins?: Plugin[]
  
  // 主题配置
  theme?: ThemeOptions
  
  // 路由配置
  router?: RouterOptions
  
  // 国际化配置
  i18n?: I18nOptions
}
```

### 示例

```javascript
import { createDocsApp } from 'vue-docs-ui'

// 基本用法
const app = await createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app'
})

// 高级用法
const app = await createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  components: {
    CustomComponent: () => import('./CustomComponent.vue')
  },
  plugins: [
    myPlugin()
  ],
  theme: {
    preset: 'modern'
  }
})
```

## 📝 createDocsUI

创建 Vue Docs UI 组件，用于在现有 Vue 应用中集成。

### 语法

```typescript
createDocsUI(options: DocsUIOptions): Component
```

### 参数

#### DocsUIOptions

```typescript
interface DocsUIOptions {
  // 配置文件路径
  configPath: string
  
  // 自定义组件
  components?: Record<string, Component>
  
  // 主题配置
  theme?: ThemeOptions
}
```

### 示例

```vue
<template>
  <div id="app">
    <DocsUI :config-path="'/config/site.yaml'" />
  </div>
</template>

<script setup>
import { createDocsUI } from 'vue-docs-ui'

const DocsUI = createDocsUI({
  configPath: '/config/site.yaml'
})
</script>
```

## ⚙️ 配置 API

### useConfig

获取和管理配置的组合式函数。

```typescript
function useConfig(): {
  config: Ref<SiteConfig>
  loadConfig: (path: string) => Promise<void>
  updateConfig: (updates: Partial<SiteConfig>) => void
  resetConfig: () => void
}
```

### 示例

```vue
<script setup>
import { useConfig } from 'vue-docs-ui'

const { config, loadConfig, updateConfig } = useConfig()

// 获取配置
console.log(config.value.site.title)

// 更新配置
updateConfig({
  site: {
    title: '新标题'
  }
})

// 重新加载配置
await loadConfig('/config/site.yaml')
</script>
```

### SiteConfig

```typescript
interface SiteConfig {
  site: {
    title: string
    description: string
    logo: string
    author: string
    url?: string
    lang?: string
  }
  
  navbar: {
    items: NavItem[]
  }
  
  sidebar: {
    sections: SidebarSection[]
  }
  
  theme: ThemeConfig
  toc: TocConfig
  search: SearchConfig
  footer: FooterConfig
  analytics: AnalyticsConfig
  pwa: PWAConfig
}
```

## 🎨 主题 API

### useTheme

主题管理的组合式函数。

```typescript
function useTheme(): {
  theme: Ref<ThemeConfig>
  currentMode: Ref<'light' | 'dark'>
  toggleTheme: () => void
  setTheme: (mode: 'light' | 'dark' | 'auto') => void
  applyTheme: (themeConfig: ThemeConfig) => void
}
```

### 示例

```vue
<script setup>
import { useTheme } from 'vue-docs-ui'

const { currentMode, toggleTheme, setTheme } = useTheme()

// 获取当前主题模式
console.log(currentMode.value) // 'light' | 'dark'

// 切换主题
toggleTheme()

// 设置特定主题
setTheme('dark')
</script>
```

### registerTheme

注册自定义主题预设。

```typescript
function registerTheme(name: string, config: ThemeConfig): void
```

### 示例

```javascript
import { registerTheme } from 'vue-docs-ui'

registerTheme('corporate', {
  colors: {
    primary: '#1a365d',
    secondary: '#2d3748',
    accent: '#3182ce'
  },
  fonts: {
    primary: 'Arial, sans-serif'
  }
})
```

## 🧭 路由 API

### useRouter

路由管理的组合式函数。

```typescript
function useRouter(): {
  currentRoute: Ref<RouteLocationNormalized>
  router: Router
  navigate: (path: string) => Promise<void>
  back: () => void
  forward: () => void
}
```

### 示例

```vue
<script setup>
import { useRouter } from 'vue-docs-ui'

const { currentRoute, navigate, back } = useRouter()

// 获取当前路由
console.log(currentRoute.value.path)

// 导航到特定路径
await navigate('/guide/introduction')

// 返回上一页
back()
</script>
```

## 📄 内容 API

### useMarkdown

Markdown 处理的组合式函数。

```typescript
function useMarkdown(): {
  renderMarkdown: (content: string) => string
  parseMarkdown: (content: string) => MarkdownAST
  extractHeadings: (content: string) => Heading[]
  extractLinks: (content: string) => Link[]
}
```

### 示例

```vue
<script setup>
import { useMarkdown } from 'vue-docs-ui'

const { renderMarkdown, extractHeadings } = useMarkdown()

// 渲染 Markdown
const html = renderMarkdown('# Hello World')

// 提取标题
const headings = extractHeadings(markdownContent)
console.log(headings) // [{ level: 1, text: 'Hello World', anchor: 'hello-world' }]
</script>
```

### useContent

内容管理的组合式函数。

```typescript
function useContent(): {
  currentContent: Ref<string>
  loadContent: (path: string) => Promise<string>
  searchContent: (query: string) => SearchResult[]
  getTableOfContents: () => TocItem[]
}
```

### 示例

```vue
<script setup>
import { useContent } from 'vue-docs-ui'

const { currentContent, loadContent, searchContent } = useContent()

// 加载内容
const content = await loadContent('/docs/guide/introduction.md')

// 搜索内容
const results = searchContent('Vue Docs UI')
</script>
```

## 🔍 搜索 API

### useSearch

搜索功能的组合式函数。

```typescript
function useSearch(): {
  query: Ref<string>
  results: Ref<SearchResult[]>
  isSearching: Ref<boolean>
  search: (query: string) => Promise<SearchResult[]>
  clearSearch: () => void
}
```

### 示例

```vue
<script setup>
import { useSearch } from 'vue-docs-ui'

const { query, results, search } = useSearch()

// 执行搜索
const searchResults = await search('Vue components')

// 清空搜索
clearSearch()
</script>
```

### SearchResult

```typescript
interface SearchResult {
  title: string
  path: string
  content: string
  matches: SearchMatch[]
  score: number
}

interface SearchMatch {
  text: string
  start: number
  end: number
  highlight: boolean
}
```

## 🌐 国际化 API

### useI18n

国际化的组合式函数。

```typescript
function useI18n(): {
  locale: Ref<string>
  t: (key: string, values?: Record<string, any>) => string
  setLocale: (locale: string) => Promise<void>
  getAvailableLocales: () => string[]
}
```

### 示例

```vue
<script setup>
import { useI18n } from 'vue-docs-ui'

const { locale, t, setLocale } = useI18n()

// 获取翻译
const title = t('common.title')

// 切换语言
await setLocale('en')

// 监听语言变化
watch(locale, (newLocale) => {
  console.log('Language changed to:', newLocale)
})
</script>
```

## 🤖 AI 助手 API

### useAIAssistant

AI 助手功能的组合式函数。

```typescript
function useAIAssistant(): {
  isEnabled: Ref<boolean>
  isVisible: Ref<boolean>
  messages: Ref<ChatMessage[]>
  isLoading: Ref<boolean>
  sendMessage: (message: string) => Promise<void>
  toggleVisibility: () => void
  clearHistory: () => void
}
```

### 示例

```vue
<script setup>
import { useAIAssistant } from 'vue-docs-ui'

const { 
  isVisible, 
  messages, 
  sendMessage, 
  toggleVisibility 
} = useAIAssistant()

// 发送消息
await sendMessage('如何自定义主题？')

// 切换显示状态
toggleVisibility()
</script>
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isLoading?: boolean
}
```

## 🔧 工具函数

### createPlugin

创建插件的工具函数。

```typescript
function createPlugin(plugin: PluginDefinition): Plugin
```

### 示例

```javascript
import { createPlugin } from 'vue-docs-ui'

const myPlugin = createPlugin({
  name: 'my-plugin',
  setup(app, options) {
    // 插件逻辑
    app.config.globalProperties.$myFeature = options.feature
    
    return {
      // 暴露的 API
      doSomething() {
        console.log('Plugin action')
      }
    }
  }
})
```

### formatDate

日期格式化工具函数。

```typescript
function formatDate(date: Date | string, format?: string): string
```

### 示例

```javascript
import { formatDate } from 'vue-docs-ui'

const formatted = formatDate(new Date(), 'YYYY-MM-DD')
console.log(formatted) // 2024-01-15
```

### generateId

生成唯一 ID 的工具函数。

```typescript
function generateId(prefix?: string): string
```

### 示例

```javascript
import { generateId } from 'vue-docs-ui'

const id = generateId('docs')
console.log(id) // docs-abc123
```

## 📱 响应式 API

### useBreakpoint

响应式断点的组合式函数。

```typescript
function useBreakpoint(): {
  isMobile: Ref<boolean>
  isTablet: Ref<boolean>
  isDesktop: Ref<boolean>
  currentBreakpoint: Ref<'mobile' | 'tablet' | 'desktop'>
  width: Ref<number>
  height: Ref<number>
}
```

### 示例

```vue
<script setup>
import { useBreakpoint } from 'vue-docs-ui'

const { isMobile, isTablet, currentBreakpoint } = useBreakpoint()

// 根据断点调整行为
watch(currentBreakpoint, (breakpoint) => {
  if (breakpoint === 'mobile') {
    // 移动端逻辑
  }
})
</script>
```

## 📊 事件 API

### useEventBus

事件总线的组合式函数。

```typescript
function useEventBus(): {
  emit: (event: string, payload?: any) => void
  on: (event: string, handler: Function) => void
  off: (event: string, handler: Function) => void
  once: (event: string, handler: Function) => void
}
```

### 示例

```vue
<script setup>
import { useEventBus } from 'vue-docs-ui'

const { emit, on, off } = useEventBus()

// 监听事件
const handler = (data) => {
  console.log('Received:', data)
}
on('custom-event', handler)

// 发送事件
emit('custom-event', { message: 'Hello' })

// 移除监听
off('custom-event', handler)
</script>
```

### 内置事件

Vue Docs UI 内置了以下事件：

```typescript
// 主题变化
'theme:changed' => { mode: 'light' | 'dark' }

// 语言变化
'locale:changed' => { locale: string }

// 路由变化
'route:changed' => { from: Route, to: Route }

// 内容加载
'content:loaded' => { path: string, content: string }

// 搜索执行
'search:query' => { query: string, results: SearchResult[] }

// AI 助手消息
'ai:message' => { message: ChatMessage }
```

## 🔍 类型定义

### 组件类型

```typescript
// 导航项
interface NavItem {
  title: string
  link: string
  external?: boolean
  icon?: string
  active?: boolean
}

// 侧边栏部分
interface SidebarSection {
  title: string
  path?: string
  children: SidebarItem[]
}

interface SidebarItem {
  title: string
  path: string
  children?: SidebarItem[]
}

// 目录项
interface TocItem {
  level: number
  text: string
  anchor: string
  children?: TocItem[]
}

// 标题
interface Heading {
  level: number
  text: string
  anchor: string
  line: number
}
```

### 配置类型

```typescript
// 主题配置
interface ThemeConfig {
  defaultMode?: 'light' | 'dark' | 'auto'
  allowToggle?: boolean
  colors?: ColorConfig
  fonts?: FontConfig
  layout?: LayoutConfig
  animations?: AnimationConfig
}

// 颜色配置
interface ColorConfig {
  primary?: string
  secondary?: string
  accent?: string
  background?: string
  surface?: string
  text?: string
  textSecondary?: string
  border?: string
  success?: string
  warning?: string
  error?: string
}
```

## 📚 错误处理

### DocsError

Vue Docs UI 的错误类型。

```typescript
class DocsError extends Error {
  code: string
  details?: any
  
  constructor(message: string, code: string, details?: any)
}
```

### 错误代码

```typescript
// 配置错误
'CONFIG_NOT_FOUND' - 配置文件未找到
'CONFIG_INVALID' - 配置文件格式错误
'CONFIG_PARSE_ERROR' - 配置文件解析错误

// 内容错误
'CONTENT_NOT_FOUND' - 内容文件未找到
'CONTENT_PARSE_ERROR' - 内容解析错误

// 路由错误
'ROUTE_NOT_FOUND' - 路由未找到
'NAVIGATION_ERROR' - 导航错误

// AI 错误
'AI_API_ERROR' - AI API 调用错误
'AI_CONFIG_ERROR' - AI 配置错误
```

### 示例

```javascript
import { DocsError } from 'vue-docs-ui'

try {
  await loadConfig('/config/site.yaml')
} catch (error) {
  if (error instanceof DocsError) {
    console.error(`Error ${error.code}: ${error.message}`)
    console.error('Details:', error.details)
  }
}
```

## 🔗 扩展 API

### 插件接口

```typescript
interface Plugin {
  name: string
  install: (app: App, options?: any) => void | PluginAPI
}

interface PluginAPI {
  [key: string]: any
}
```

### 组件注册

```typescript
// 全局注册组件
app.component('CustomComponent', CustomComponent)

// 异步组件
app.component('AsyncComponent', defineAsyncComponent(() => 
  import('./AsyncComponent.vue')
))
```

## 📖 最佳实践

### 1. 性能优化

```javascript
// 使用异步加载
const { createDocsApp } = await import('vue-docs-ui')

// 懒加载内容
const content = await loadContent(path)

// 缓存配置
const cachedConfig = await loadConfig(path, { cache: true })
```

### 2. 错误处理

```javascript
try {
  const app = await createDocsApp(options)
} catch (error) {
  console.error('Failed to create docs app:', error)
  // 显示错误页面或降级方案
}
```

### 3. 类型安全

```typescript
// 使用 TypeScript 获得更好的类型支持
import type { DocsAppOptions, SiteConfig } from 'vue-docs-ui'

const options: DocsAppOptions = {
  configPath: '/config/site.yaml',
  el: '#app'
}
```

## 📚 下一步

- 查看 [部署](/advanced/deployment) 了解如何部署应用
- 探索 [示例](/examples/basic) 学习实际应用
- 参考 [GitHub 源码](https://github.com/shenjianZ/vue-docs-ui) 了解实现细节 