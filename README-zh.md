# Vue Docs UI

[![npm version](https://badge.fury.io/js/vue-docs-ui.svg)](https://badge.fury.io/js/vue-docs-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3+-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**[English](./README.md) | [在线演示](https://vue-docs-ui.github.io/vue-docs-ui)**

一个基于Vue 3的现代化文档网站组件库。通过YAML配置和Markdown渲染创建精美的文档网站 - 开箱即用。

## ✨ 特性

- 🎨 **现代化设计**：基于Grid布局的响应式设计
- 📱 **移动端优化**：完美的移动端体验，触摸友好的导航
- 🌙 **主题支持**：内置浅色/深色主题，完全可定制
- 📖 **Markdown渲染**：完整的Markdown支持，代码语法高亮
- 🔍 **自动导航**：自动生成文档目录
- ⚙️ **YAML配置**：配置驱动的方式，使用YAML文件
- 🚀 **零配置**：仅需3行代码即可开始
- 📊 **TypeScript**：完整的TypeScript支持和类型定义
- 🎯 **Vue 3**：专为Vue 3和Composition API构建
- 🔧 **高度可定制**：灵活的主题和组件定制

## 🚀 快速开始

### 安装

```bash
npm install vue-docs-ui
# 或者
yarn add vue-docs-ui
# 或者
pnpm add vue-docs-ui
```

### 基本用法（仅需3行代码！）

```typescript
// main.ts
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

createDocsApp()
```

### 配置文件

创建 `public/config/site.yaml`：

```yaml
# 网站基本配置
site:
  title: "我的文档网站"
  description: "使用Vue Docs UI构建"
  logo: "📚"  # 支持emoji、图片或URL
  author: "您的名字"

# 导航配置
navbar:
  items:
    - title: "首页"
      link: "/"
    - title: "指南"
      link: "/guide"
    - title: "GitHub"
      link: "https://github.com/your-repo"
      external: true

# 侧边栏配置
sidebar:
  sections:
    - title: "开始使用"
      path: "/guide"
      children:
        - title: "快速开始"
          path: "/guide/quick-start"
        - title: "配置说明"
          path: "/guide/configuration"

# 主题配置
theme:
  defaultMode: "light"  # "light" | "dark" | "auto"
  allowToggle: true
  colors:
    primary: "#3b82f6"
    secondary: "#64748b"

# 目录配置
toc:
  maxLevel: 2
  enabled: true
  title: "目录"
```

### 添加Markdown内容

在 `public/docs/` 目录创建markdown文件：

```
public/
├── config/
│   └── site.yaml
└── docs/
    ├── guide/
    │   ├── quick-start.md
    │   └── configuration.md
    └── advanced/
        └── customization.md
```

就这样！🎉 运行 `npm run dev`，您的文档网站就准备好了。

## 📦 包含内容

- **DocsLayout**: 主布局组件，响应式设计
- **HeaderNav**: 顶部导航，包含主题切换和移动菜单
- **SidebarNav**: 可折叠的侧边栏导航
- **TableOfContents**: 自动生成的目录
- **MarkdownRenderer**: Markdown渲染，代码语法高亮
- **DefaultHome**: 美观的首页组件
- **DefaultArticle**: 文章页面，包含面包屑和导航

## 🎯 Logo配置

Vue Docs UI支持多种logo格式：

```yaml
site:
  # Emoji（最简单）
  logo: "🤖"
  
  # 本地图片
  logo: "/images/logo.png"
  
  # 在线图片
  logo: "https://example.com/logo.svg"
  
  # 相对路径
  logo: "./assets/logo.svg"
```

**Logo要求：**
- **推荐格式**：PNG、SVG（矢量图优先）
- **推荐尺寸**：高度32-64px，宽度自适应
- **文件大小**：建议小于100KB
- **支持格式**：PNG、SVG、JPG、GIF、WebP、ICO

## 🎨 主题配置

### 基本主题设置

```yaml
theme:
  # 默认主题模式
  defaultMode: "light"  # "light" | "dark" | "auto"
  
  # 允许用户切换主题
  allowToggle: true
  
  # 自定义颜色
  colors:
    primary: "#3b82f6"
    secondary: "#64748b"
    accent: "#06b6d4"
    background: "#ffffff"
    surface: "#f8fafc"
    text: "#1e293b"
    border: "#e2e8f0"
    
  # 字体
  fonts:
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    mono: "JetBrains Mono, Consolas, monospace"
```

### 主题模式选项

- **`"light"`**: 强制浅色主题，忽略系统偏好
- **`"dark"`**: 强制深色主题，忽略系统偏好
- **`"auto"`**: 跟随系统偏好（默认）

### 主题切换控制

- **`allowToggle: true`**: 显示主题切换按钮（默认）
- **`allowToggle: false`**: 隐藏主题切换按钮，仅使用配置的默认主题

## 🔧 高级用法

### 自定义组件

```typescript
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'
import MyCustomHome from './MyCustomHome.vue'
import MyCustomArticle from './MyCustomArticle.vue'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  customComponents: {
    home: MyCustomHome,
    article: MyCustomArticle
  }
})
```

### 组件库模式

```typescript
import { createApp } from 'vue'
import { DocsLayout, loadConfig } from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

const config = await loadConfig('/config/site.yaml')
const app = createApp(DocsLayout, { config })
app.mount('#app')
```

### 可用组件

```typescript
import {
  DocsLayout,
  HeaderNav,
  SidebarNav,
  TableOfContents,
  MarkdownRenderer,
  DefaultHome,
  DefaultArticle,
  createDocsApp,
  loadConfig
} from 'vue-docs-ui'
```

## 📱 响应式设计

Vue Docs UI完全响应式：

- **桌面端**: 侧边栏 + 内容 + 目录
- **平板**: 侧边栏 + 内容（隐藏目录）
- **移动端**: 覆盖式侧边栏，流畅动画

## 🔍 Markdown功能

- ✅ 标准Markdown语法
- ✅ 代码块语法高亮
- ✅ 自动生成目录
- ✅ 响应式表格和图片
- ✅ 自定义标题锚点
- ✅ 数学公式支持（即将推出）

## 📁 项目结构

```
my-docs-project/
├── public/
│   ├── config/
│   │   └── site.yaml        # 站点配置
│   └── docs/               # Markdown内容
│       ├── guide/
│       │   ├── quick-start.md
│       │   └── configuration.md
│       └── advanced/
│           └── customization.md
├── src/
│   └── main.ts             # 仅需几行代码
├── index.html
├── package.json
└── vite.config.js
```

## 🚦 从其他工具迁移

### 从VitePress迁移

```yaml
# VitePress config.js 等效的YAML配置
site:
  title: "我的文档"
  description: "文档网站"

navbar:
  items:
    - title: "指南"
      link: "/guide/"

sidebar:
  sections:
    - title: "开始使用"
      children:
        - title: "介绍"
          path: "/guide/introduction"
```

### 从Docusaurus迁移

Vue Docs UI提供了更简单、专注于Vue的替代方案，零配置复杂性。

## 🎯 对比

| 功能 | Vue Docs UI | VitePress | Docusaurus |
|------|-------------|-----------|------------|
| 设置复杂度 | ⭐ 3行代码 | ⭐⭐ 需要配置 | ⭐⭐⭐ 复杂设置 |
| Vue 3支持 | ✅ 原生支持 | ✅ 支持 | ❌ 仅React |
| 零配置 | ✅ 开箱即用 | ⭐⭐ 需要配置 | ⭐⭐ 需要配置 |
| TypeScript | ✅ 完整支持 | ✅ 支持 | ✅ 支持 |
| 自定义程度 | ⭐⭐⭐ 高度灵活 | ⭐⭐ 中等 | ⭐⭐⭐ 高度灵活 |
| 性能 | ⭐⭐⭐ 优秀 | ⭐⭐⭐ 优秀 | ⭐⭐ 良好 |

## 🛠️ 开发

### 前置要求

- Node.js 16+
- npm/yarn/pnpm

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/vue-docs-ui/vue-docs-ui.git
cd vue-docs-ui

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build:lib

# 运行示例
cd example && npm run dev
```

### 构建命令

```bash
npm run build:lib     # 构建生产版本库
npm run build         # 构建示例站点
npm run type-check    # TypeScript类型检查
npm run preview       # 预览构建站点
```

## 📦 发布到NPM

此包已准备好发布到NPM：

```bash
# 试运行（测试不发布）
npm run publish:dry

# 版本升级
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0

# 发布到NPM
npm publish
```

包含内容：
- ✅ TypeScript声明文件
- ✅ ES和UMD构建
- ✅ CSS bundle
- ✅ 正确的exports配置
- ✅ Tree-shaking支持

## 🌐 浏览器支持

- Chrome >= 87
- Firefox >= 78  
- Safari >= 14
- Edge >= 88

## 📝 许可证

MIT许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎贡献！请查看我们的 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个Pull Request

## 📞 支持

- 📖 [文档](https://vue-docs-ui.github.io/vue-docs-ui)
- 🐛 [问题追踪](https://github.com/vue-docs-ui/vue-docs-ui/issues)
- 💬 [讨论](https://github.com/vue-docs-ui/vue-docs-ui/discussions)

## 🙏 致谢

- 使用 [Vue.js 3](https://vuejs.org/) 构建
- 由 [Vite](https://vitejs.dev/) 驱动
- 图标来自 [Lucide](https://lucide.dev/)
- 受现代文档工具启发

---

**由Vue Docs UI团队用❤️制作** 