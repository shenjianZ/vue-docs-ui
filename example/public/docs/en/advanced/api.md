# API Reference

Complete API reference for Vue Docs UI.

## Core Functions

### createDocsApp

Creates and mounts a Vue Docs UI application.

```typescript
createDocsApp(options?: CreateDocsAppOptions): Promise<DocsAppInstance>
```

**Parameters:**

```typescript
interface CreateDocsAppOptions {
  configPath?: string           // Path to site.yaml (default: '/config/site.yaml')
  el?: string                  // Mount element selector (default: '#app')
  customComponents?: {         // Custom component overrides
    home?: Component
    article?: Component
  }
}
```

**Returns:**

```typescript
interface DocsAppInstance {
  app: App<Element>           // Vue app instance
  router: Router             // Vue router instance
  config: DocsConfig         // Loaded configuration
  mountedApp: ComponentPublicInstance
}
```

**Example:**

```typescript
const docsApp = await createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  customComponents: {
    home: CustomHomePage,
    article: CustomArticlePage
  }
})

// Access app instance
docsApp.app.use(somePlugin)

// Access router
docsApp.router.beforeEach((to, from, next) => {
  // Route guard
  next()
})
```

### createDocsUI

Creates a Vue plugin for manual setup.

```typescript
createDocsUI(options?: DocsUIOptions): Plugin
```

**Parameters:**

```typescript
interface DocsUIOptions {
  config?: DocsConfig        // Configuration object
  router?: Router           // Vue router instance
}
```

**Example:**

```typescript
import { createApp } from 'vue'
import { createDocsUI } from 'vue-docs-ui'

const app = createApp({})
app.use(createDocsUI({
  config: myConfig,
  router: myRouter
}))
```

## Utility Functions

### loadConfig

Loads configuration from a YAML file.

```typescript
loadConfig(configPath: string): Promise<DocsConfig>
```

**Example:**

```typescript
const config = await loadConfig('/config/site.yaml')
console.log(config.site.title)
```

### generateRoutesFromSidebar

Generates Vue Router routes from sidebar configuration.

```typescript
generateRoutesFromSidebar(
  sidebar: SidebarSection[] | { sections: SidebarSection[] },
  articleComponent?: Component
): RouteRecordRaw[]
```

**Example:**

```typescript
import { generateRoutesFromSidebar } from 'vue-docs-ui'
import ArticlePage from './ArticlePage.vue'

const routes = generateRoutesFromSidebar(config.sidebar, ArticlePage)
```

### getNormalizedSidebar

Normalizes sidebar configuration to a standard format.

```typescript
getNormalizedSidebar(config: DocsConfig): SidebarSection[]
```

### getNormalizedNavbar

Normalizes navbar configuration to a standard format.

```typescript
getNormalizedNavbar(config: DocsConfig): NavItem[]
```

## Type Definitions

### DocsConfig

Main configuration interface.

```typescript
interface DocsConfig {
  site: SiteConfig
  navbar?: NavbarConfig
  sidebar?: SidebarConfig
  theme?: ThemeConfig
  toc?: TocConfig
  search?: SearchConfig
  footer?: FooterConfig
  analytics?: AnalyticsConfig
  pwa?: PWAConfig
}
```

### SiteConfig

Site-level configuration.

```typescript
interface SiteConfig {
  title: string
  description: string
  logo?: string
  author?: string
  url?: string
  lang?: string
  seo?: {
    keywords?: string[]
    image?: string
    twitter?: string
  }
  contact?: {
    email?: string
    github?: string
    twitter?: string
    discord?: string
  }
}
```

### NavbarConfig

Navigation bar configuration.

```typescript
interface NavbarConfig {
  items: NavItem[]
}

interface NavItem {
  title: string
  link: string
  external?: boolean
  icon?: string
  children?: NavItem[]
}
```

### SidebarConfig

Sidebar configuration.

```typescript
interface SidebarConfig {
  sections: SidebarSection[]
}

interface SidebarSection {
  title: string
  text?: string
  path?: string
  link?: string
  children?: SidebarSection[]
  collapsed?: boolean
}
```

### ThemeConfig

Theme configuration.

```typescript
interface ThemeConfig {
  defaultMode?: 'light' | 'dark' | 'auto'
  allowToggle?: boolean
  colors?: {
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
  fonts?: {
    primary?: string
    mono?: string
  }
  layout?: {
    headerHeight?: string
    sidebarWidth?: string
    tocWidth?: string
    contentMaxWidth?: string
  }
}
```

### TocConfig

Table of contents configuration.

```typescript
interface TocConfig {
  maxLevel?: number          // 1-6 (default: 3)
  enabled?: boolean         // default: true
  title?: string           // default: "On This Page"
  showOnMobile?: boolean   // default: false
}
```

### SearchConfig

Search configuration.

```typescript
interface SearchConfig {
  enabled?: boolean
  provider?: 'local' | 'algolia'
  algolia?: {
    appId: string
    apiKey: string
    indexName: string
  }
}
```

### FooterConfig

Footer configuration.

```typescript
interface FooterConfig {
  enabled?: boolean
  copyright?: string
  links?: Array<{
    title: string
    link: string
    external?: boolean
  }>
}
```

### AnalyticsConfig

Analytics configuration.

```typescript
interface AnalyticsConfig {
  google?: {
    enabled: boolean
    id: string
  }
}
```

### PWAConfig

Progressive Web App configuration.

```typescript
interface PWAConfig {
  enabled?: boolean
  name?: string
  shortName?: string
  description?: string
  themeColor?: string
  backgroundColor?: string
}
```

## Component Props

### DocsLayout Props

```typescript
interface DocsLayoutProps {
  config: DocsConfig
  showToc?: boolean          // default: true
}
```

### HeaderNav Props

```typescript
interface HeaderNavProps {
  config: DocsConfig
}

// Events
interface HeaderNavEvents {
  'toggle-sidebar': () => void
  'toggle-theme': () => void
}
```

### SidebarNav Props

```typescript
interface SidebarNavProps {
  config?: DocsConfig
  isOpen?: boolean           // default: false
  uniqueExpansion?: boolean  // default: true
}

// Events
interface SidebarNavEvents {
  'close': () => void
}
```

### TableOfContents Props

```typescript
interface TableOfContentsProps {
  headers: TocItem[]
}

interface TocItem {
  text: string
  anchor: string
  level: number
  children?: TocItem[]
}
```

### MarkdownRenderer Props

```typescript
interface MarkdownRendererProps {
  content: string
  config?: {
    highlightjs?: boolean    // default: true
    linkify?: boolean       // default: true
    typographer?: boolean   // default: true
  }
}
```

## CSS Custom Properties

### Color Variables

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --accent-color: #06b6d4;
  --bg-color: #ffffff;
  --bg-color-secondary: #f8fafc;
  --bg-color-hover: rgba(59, 130, 246, 0.05);
  --text-color: #1e293b;
  --text-color-light: #64748b;
  --border-color: #e2e8f0;
  --border-color-light: #f1f5f9;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

### Layout Variables

```css
:root {
  --header-height: 60px;
  --sidebar-width: 280px;
  --toc-width: 240px;
  --content-max-width: 1200px;
}
```

### Typography Variables

```css
:root {
  --font-family: 'Inter', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
}
```

### Transition Variables

```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

## Error Handling

### Error Types

```typescript
class DocsConfigError extends Error {
  constructor(message: string, configPath: string) {
    super(`Configuration error in ${configPath}: ${message}`)
    this.name = 'DocsConfigError'
  }
}

class DocsRouteError extends Error {
  constructor(message: string, route: string) {
    super(`Route error for ${route}: ${message}`)
    this.name = 'DocsRouteError'
  }
}
```

### Error Handling

```typescript
try {
  const app = await createDocsApp({
    configPath: '/config/site.yaml'
  })
} catch (error) {
  if (error instanceof DocsConfigError) {
    console.error('Configuration error:', error.message)
  } else if (error instanceof DocsRouteError) {
    console.error('Route error:', error.message)
  } else {
    console.error('Unknown error:', error)
  }
}
```

## Performance API

### Metrics

```typescript
interface PerformanceMetrics {
  configLoadTime: number     // Time to load configuration (ms)
  routeGenerationTime: number // Time to generate routes (ms)
  mountTime: number         // Time to mount application (ms)
  totalInitTime: number     // Total initialization time (ms)
}

// Get performance metrics
const metrics = docsApp.getPerformanceMetrics()
```

### Optimization

```typescript
// Enable performance optimizations
createDocsApp({
  configPath: '/config/site.yaml',
  optimizations: {
    lazyRoutes: true,        // Lazy load route components
    preloadCritical: true,   // Preload critical resources
    minifyConfig: true       // Minify configuration
  }
})
```

## Migration Guide

### From v1.0.x to v1.1.x

```typescript
// Old API (v1.0.x)
import VueDocsUI from 'vue-docs-ui'
app.use(VueDocsUI, { config })

// New API (v1.1.x)
import { createDocsApp } from 'vue-docs-ui'
await createDocsApp({ 
  configPath: '/config/site.yaml' 
})
```

### Breaking Changes

1. **Configuration format**: Site configuration moved to `site.yaml`
2. **Component imports**: Named imports instead of default import
3. **API changes**: `createDocsApp` replaces `createApp` integration 