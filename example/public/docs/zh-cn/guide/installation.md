# 安装

本指南将帮助您安装和配置 Vue Docs UI，让您快速开始构建文档网站。

## 📋 环境要求

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js** >= 16.0.0
- **npm** >= 7.0.0 或 **yarn** >= 1.22.0 或 **pnpm** >= 6.0.0

## 🚀 快速安装

### 方式一：使用脚手架（推荐）

最简单的方式是使用我们提供的脚手架工具：

```bash
# 使用 npm
npm create vue-docs-ui@latest my-docs

# 使用 yarn
yarn create vue-docs-ui my-docs

# 使用 pnpm
pnpm create vue-docs-ui my-docs
```

然后按照提示完成项目创建：

```bash
cd my-docs
npm install
npm run dev
```

### 方式二：手动安装

如果您想在现有项目中集成 Vue Docs UI：

```bash
# 安装依赖
npm install vue-docs-ui

# 或使用 yarn
yarn add vue-docs-ui

# 或使用 pnpm
pnpm add vue-docs-ui
```

## 📁 项目结构

使用脚手架创建的项目结构如下：

```
my-docs/
├── public/
│   ├── config/
│   │   ├── site.yaml          # 中文配置
│   │   ├── site.en.yaml       # 英文配置
│   │   └── ai.json            # AI 助手配置
│   └── docs/
│       ├── zh-cn/             # 中文文档
│       │   ├── index.md
│       │   └── guide/
│       └── en/                # 英文文档
│           ├── index.md
│           └── guide/
├── src/
│   └── main.ts                # 入口文件
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ 基本配置

### 1. 入口文件配置

在 `src/main.ts` 中：

```typescript
import { createDocsApp } from 'vue-docs-ui'
import 'vue-docs-ui/dist/vue-docs-ui.css'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app'
})
```

### 2. 网站配置

编辑 `public/config/site.yaml`：

```yaml
site:
  title: "我的文档网站"
  description: "使用 Vue Docs UI 构建的文档网站"
  logo: "📚"
  author: "您的名字"

navbar:
  items:
    - title: "首页"
      link: "/"
    - title: "指南"
      link: "/guide/introduction"

sidebar:
  sections:
    - title: "快速开始"
      path: "/guide"
      children:
        - title: "介绍"
          path: "/guide/introduction"
```

### 3. Vite 配置

确保 `vite.config.js` 包含正确的配置：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
})
```

## 🔧 开发环境

启动开发服务器：

```bash
npm run dev
```

您的文档网站将在 `http://localhost:5173` 上运行。

## 📦 生产构建

构建生产版本：

```bash
npm run build
```

构建完成后，您可以使用以下命令预览：

```bash
npm run preview
```

## 🚀 部署

构建完成的文件位于 `dist` 目录中，您可以将其部署到任何静态文件服务器上，如：

- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Nginx**
- **Apache**

## 🔍 故障排除

### 常见问题

**Q: 启动时出现 "Module not found" 错误**
A: 请确保已正确安装所有依赖：`npm install`

**Q: 样式显示不正确**
A: 请确保已导入 CSS 文件：`import 'vue-docs-ui/dist/vue-docs-ui.css'`

**Q: 配置文件无法加载**
A: 请检查配置文件路径是否正确，确保文件位于 `public` 目录下

## 📚 下一步

安装完成后，您可以：

1. 查看 [快速上手](/guide/quick-start) 了解基本使用
2. 阅读 [配置说明](/guide/configuration) 自定义您的网站
3. 探索 [进阶指南](/advanced/themes) 了解高级功能 