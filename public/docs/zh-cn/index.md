# 欢迎使用 Vue Docs UI

Vue Docs UI 是一个现代化的文档网站构建工具，基于 Vue 3 开发，提供开箱即用的文档解决方案。

## 🌟 主要特性

- **🚀 开箱即用** - 只需 3 行代码即可启动文档网站
- **🎨 现代设计** - 精美的界面设计，支持明暗主题切换
- **📱 移动端适配** - 完美的响应式设计
- **🌐 国际化支持** - 内置多语言支持
- **🤖 AI 助手** - 集成 AI 聊天助手，支持多种模型
- **⚡ 高性能** - 基于 Vite 构建，快速热重载
- **🔍 全文搜索** - 智能搜索功能
- **📝 Markdown 增强** - 丰富的 Markdown 扩展

## 🏗️ 架构特点

- **组件化设计** - 模块化组件，易于扩展
- **TypeScript 支持** - 完整的类型支持
- **可自定义主题** - 灵活的主题配置
- **插件系统** - 可扩展的插件架构

## 📦 快速开始

```bash
# 创建新项目
npm create vue-docs-ui@latest my-docs

# 进入项目目录
cd my-docs

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📖 使用方式

```javascript
import { createDocsApp } from 'vue-docs-ui'
import 'vue-docs-ui/dist/vue-docs-ui.css'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app'
})
```

就这么简单！无需复杂配置，立即拥有一个功能完整的文档网站。

## 🔗 相关链接

- [GitHub 仓库](https://github.com/shenjianZ/vue-docs-ui)
- [在线演示](https://vue-docs-ui.example.com)
- [使用指南](/guide/introduction)
- [API 文档](/advanced/api) 