# Vue Docs UI

[![npm version](https://badge.fury.io/js/vue-docs-ui.svg)](https://badge.fury.io/js/vue-docs-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3+-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**[中文文档](./README-zh.md)**
<!-- **[中文文档](./README-zh.md) | [Live Demo](https://vue-docs-ui.github.io/vue-docs-ui)** -->
A modern, feature-rich documentation UI component library built with Vue 3. Create beautiful documentation websites with YAML configuration and Markdown rendering - ready to use out of the box.

## ✨ Features

- 🎨 **Modern Design**: Grid-based responsive layout with beautiful UI
- 📱 **Mobile Optimized**: Perfect mobile experience with touch-friendly navigation  
- 🌈 **Multi-Theme System**: 6 beautiful preset themes (Default, Vue, GitHub, Purple, Orange, Emerald)
- 🌙 **Smart Theme Mode**: Light/dark mode with auto system preference detection
- 📖 **Markdown Rendering**: Complete Markdown support with syntax highlighting
- 🔍 **Auto Navigation**: Automatic table of contents generation
- ⚙️ **YAML Configuration**: Configuration-driven approach with YAML files
- 🚀 **Zero Setup**: Get started with just 3 lines of code
- 📊 **TypeScript**: Full TypeScript support with type definitions
- 🎯 **Vue 3**: Built for Vue 3 with Composition API
- 🔧 **Highly Customizable**: Flexible theming and component customization

## 🚀 Quick Start

### Option 1: Use Scaffolding Tool (Recommended)

```bash
# Create a new documentation project with one command
npm create vue-docs-ui my-docs
cd my-docs
npm install
npm run dev
```

### Option 2: Manual Installation

```bash
npm install vue-docs-ui
# or
yarn add vue-docs-ui
# or
pnpm add vue-docs-ui
```

### Basic Usage (3 lines of code!)

```typescript
// main.ts
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

createDocsApp()
```

### Configuration File

Create `public/config/site.yaml`:

```yaml
# Basic site configuration
site:
  title: "My Documentation"
  description: "Built with Vue Docs UI"
  logo: "📚"  # Supports emoji, images, or URLs
  author: "Your Name"

# Navigation
navbar:
  items:
    - title: "Home"
      link: "/"
    - title: "Guide"
      link: "/guide"
    - title: "GitHub"
      link: "https://github.com/your-repo"
      external: true

# Sidebar
sidebar:
  sections:
    - title: "Getting Started"
      path: "/guide"
      children:
        - title: "Quick Start"
          path: "/guide/quick-start"
        - title: "Configuration"
          path: "/guide/configuration"

# Theme (NEW: Multi-theme support!)
theme:
  # Theme selection: default | vue | github | purple | orange | emerald
  theme: "vue"
  
  # Default mode: light | dark | auto
  defaultMode: "auto"
  
  # Allow users to toggle theme
  allowToggle: true
  
  # Show theme switcher component
  showThemeSwitcher: true

# Table of Contents
toc:
  maxLevel: 2
  enabled: true
  title: "Contents"
```

### Add Markdown Content

Create your markdown files in `public/docs/`:

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

That's it! 🎉 Run `npm run dev` and your documentation site is ready.

## 📦 What's Included

- **DocsLayout**: Main layout component with responsive design
- **HeaderNav**: Top navigation with theme toggle and mobile menu
- **SidebarNav**: Collapsible sidebar navigation
- **TableOfContents**: Auto-generated table of contents
- **MarkdownRenderer**: Markdown rendering with syntax highlighting
- **DefaultHome**: Beautiful homepage component
- **DefaultArticle**: Article page with breadcrumbs and navigation

## 🎯 Logo Configuration

Vue Docs UI supports multiple logo formats:

```yaml
site:
  # Emoji (simplest)
  logo: "🤖"
  
  # Local image
  logo: "/images/logo.png"
  
  # Online image
  logo: "https://example.com/logo.svg"
  
  # Relative path
  logo: "./assets/logo.svg"
```

**Logo Requirements:**
- **Recommended formats**: PNG, SVG (vector graphics preferred)
- **Recommended size**: 32-64px height, auto width
- **File size**: < 100KB recommended
- **Supported formats**: PNG, SVG, JPG, GIF, WebP, ICO

## 🎨 Multi-Theme System (NEW!)

Vue Docs UI now supports **6 beautiful preset themes** with complete configuration control:

### Available Themes

| Theme | Description | Best for |
|-------|-------------|----------|
| `default` | Modern blue theme | General documentation |
| `vue` | Vue.js official green theme | Vue projects |
| `github` | GitHub-style monochrome | Open source projects |
| `purple` | Elegant purple theme | Design systems |
| `orange` | Warm orange theme | Marketing sites |
| `emerald` | Fresh green theme | Eco-friendly projects |

### Basic Theme Configuration

```yaml
theme:
  # Select theme: default | vue | github | purple | orange | emerald
  theme: "vue"
  
  # Default mode: light | dark | auto
  defaultMode: "auto"
  
  # Allow users to toggle theme/mode
  allowToggle: true
  
  # Show theme switcher component
  showThemeSwitcher: true
```

### Theme Mode Options

- **`"light"`**: Force light mode
- **`"dark"`**: Force dark mode  
- **`"auto"`**: Auto-detect system preference (recommended)

### Theme Control Options

- **`allowToggle: true`**: Users can switch themes and modes
- **`allowToggle: false`**: Lock theme configuration
- **`showThemeSwitcher: true`**: Show theme picker in header
- **`showThemeSwitcher: false`**: Hide theme picker

### Configuration Priority

1. **User Selection** (localStorage)
2. **Config File** (site.yaml)
3. **System Preference** (for auto mode)
4. **Default Values**

### Example Configurations

**Fixed Theme Mode:**
```yaml
theme:
  theme: "github"
  defaultMode: "light"
  allowToggle: false
  showThemeSwitcher: false
```

**Full User Control:**
```yaml
theme:
  theme: "default"
  defaultMode: "auto"
  allowToggle: true
  showThemeSwitcher: true
```

**Brand Specific:**
```yaml
theme:
  theme: "vue"          # Vue theme for Vue projects
  defaultMode: "auto"
  allowToggle: true
  showThemeSwitcher: true
```

## 🔧 Advanced Usage

### Custom Components

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

### Component Library Mode

```typescript
import { createApp } from 'vue'
import { DocsLayout, loadConfig } from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

const config = await loadConfig('/config/site.yaml')
const app = createApp(DocsLayout, { config })
app.mount('#app')
```

### Available Components

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

## 📱 Responsive Design

Vue Docs UI is fully responsive:

- **Desktop**: Full sidebar + content + table of contents
- **Tablet**: Sidebar + content (TOC hidden)
- **Mobile**: Overlay sidebar with smooth animations

## 🔍 Markdown Features

- ✅ Standard Markdown syntax
- ✅ Syntax highlighting for code blocks
- ✅ Auto-generated table of contents
- ✅ Responsive tables and images
- ✅ Custom heading anchors
- ✅ Math equations support (coming soon)

## 📁 Project Structure

```
my-docs-project/
├── public/
│   ├── config/
│   │   └── site.yaml        # Site configuration
│   └── docs/               # Markdown content
│       ├── guide/
│       │   ├── quick-start.md
│       │   └── configuration.md
│       └── advanced/
│           └── customization.md
├── src/
│   └── main.ts             # Just 3 lines of code
├── index.html
├── package.json
└── vite.config.js
```

## 🚦 Migration from Other Tools

### From VitePress

```yaml
# VitePress config.js equivalent in YAML
site:
  title: "My Docs"
  description: "Documentation site"

navbar:
  items:
    - title: "Guide"
      link: "/guide/"

sidebar:
  sections:
    - title: "Getting Started"
      children:
        - title: "Introduction"
          path: "/guide/introduction"
```

### From Docusaurus

Vue Docs UI provides a simpler, Vue-focused alternative with zero configuration complexity.

## 🎯 Comparison

| Feature | Vue Docs UI | VitePress | Docusaurus |
|---------|-------------|-----------|------------|
| Setup Complexity | ⭐ 3 lines | ⭐⭐ Config needed | ⭐⭐⭐ Complex setup |
| Vue 3 Support | ✅ Native | ✅ Yes | ❌ React only |
| Zero Config | ✅ Out of box | ⭐⭐ Needs config | ⭐⭐ Needs config |
| TypeScript | ✅ Full support | ✅ Yes | ✅ Yes |
| Customization | ⭐⭐⭐ Highly flexible | ⭐⭐ Medium | ⭐⭐⭐ Highly flexible |
| Performance | ⭐⭐⭐ Excellent | ⭐⭐⭐ Excellent | ⭐⭐ Good |

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm/yarn/pnpm

### Development Setup

```bash
# Clone the repository
git clone https://github.com/vue-docs-ui/vue-docs-ui.git
cd vue-docs-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:lib

# Run example
cd example && npm run dev
```

### Build Commands

```bash
npm run build:lib     # Build library for production
npm run build         # Build example site
npm run type-check    # TypeScript type checking
npm run preview       # Preview built site
```

## 📦 Publishing to NPM

This package is ready for NPM publication:

```bash
# Dry run (test without publishing)
npm run publish:dry

# Version bump
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0

# Publish to NPM
npm publish
```

The package includes:
- ✅ TypeScript declarations
- ✅ ES and UMD builds
- ✅ CSS bundle
- ✅ Proper exports configuration
- ✅ Tree-shaking support

## 🌐 Browser Support

- Chrome >= 87
- Firefox >= 78  
- Safari >= 14
- Edge >= 88

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

📖 **Documentation in multiple languages:**
- 🇺🇸 [English Contributing Guide](CONTRIBUTING.md)
- 🇨🇳 [中文贡献指南](CONTRIBUTING-zh.md)

### Quick Contributing

- 🐛 [Report bugs](https://github.com/shenjianZ/vue-docs-ui/issues/new?template=bug_report.md)
- 💡 [Request features](https://github.com/shenjianZ/vue-docs-ui/issues/new?template=feature_request.md)
- 📖 [Improve documentation](https://github.com/shenjianZ/vue-docs-ui/edit/master/README.md)
- 💬 [Join discussions](https://github.com/shenjianZ/vue-docs-ui/discussions)

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 📖 [Documentation](https://vue-docs-ui.github.io/vue-docs-ui)
- 🐛 [Issue Tracker](https://github.com/shenjianZ/vue-docs-ui/issues)
- 💬 [Discussions](https://github.com/shenjianZ/vue-docs-ui/discussions)
- 📧 [Email Support](mailto:contact@vuedocsui.com)

## 📊 Stats

![npm](https://img.shields.io/npm/v/vue-docs-ui?style=flat-square&logo=npm)
![downloads](https://img.shields.io/npm/dt/vue-docs-ui?style=flat-square&logo=npm)
![bundle size](https://img.shields.io/bundlephobia/minzip/vue-docs-ui?style=flat-square&logo=webpack)
![GitHub stars](https://img.shields.io/github/stars/shenjianZ/vue-docs-ui?style=flat-square&logo=github)
![GitHub forks](https://img.shields.io/github/forks/shenjianZ/vue-docs-ui?style=flat-square&logo=github)
![GitHub issues](https://img.shields.io/github/issues/shenjianZ/vue-docs-ui?style=flat-square&logo=github)

## 🙏 Acknowledgments

- Built with [Vue.js 3](https://vuejs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern documentation tools

---

**Made with ❤️ by the Vue Docs UI Team** 