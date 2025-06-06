# 基础示例

这是一个最简单的 Vue Docs UI 文档网站示例，展示了如何从零开始创建一个功能完整的文档网站。

## 🎯 示例概述

本示例将创建一个简单的产品文档网站，包含：

- 📝 **首页介绍**
- 📚 **用户指南**
- 🔧 **API 参考**
- ❓ **常见问题**

## 📁 项目结构

```
basic-example/
├── public/
│   ├── config/
│   │   └── site.yaml          # 网站配置
│   └── docs/
│       ├── index.md           # 首页
│       ├── guide/             # 用户指南
│       │   ├── getting-started.md
│       │   ├── installation.md
│       │   └── basic-usage.md
│       ├── api/               # API 文档
│       │   ├── overview.md
│       │   └── reference.md
│       └── faq.md             # 常见问题
├── src/
│   └── main.ts
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ 配置文件

### site.yaml

```yaml
# 网站基本信息
site:
  title: "ProductName - 文档"
  description: "ProductName 的官方文档网站"
  logo: "🚀"
  author: "ProductName Team"

# 顶部导航
navbar:
  items:
    - title: "首页"
      link: "/"
    - title: "指南"
      link: "/guide/getting-started"
    - title: "API"
      link: "/api/overview"
    - title: "FAQ"
      link: "/faq"
    - title: "GitHub"
      link: "https://github.com/your-org/your-product"
      external: true

# 侧边栏导航
sidebar:
  sections:
    - title: "用户指南"
      path: "/guide"
      children:
        - title: "开始使用"
          path: "/guide/getting-started"
        - title: "安装"
          path: "/guide/installation"
        - title: "基本用法"
          path: "/guide/basic-usage"
    
    - title: "API 参考"
      path: "/api"
      children:
        - title: "概述"
          path: "/api/overview"
        - title: "API 参考"
          path: "/api/reference"
    
    - title: "其他"
      children:
        - title: "常见问题"
          path: "/faq"

# 主题配置
theme:
  defaultMode: "light"
  allowToggle: true
  colors:
    primary: "#007bff"
    secondary: "#6c757d"
    accent: "#28a745"

# 目录配置
toc:
  maxLevel: 3
  enabled: true
  title: "本页目录"

# 页脚
footer:
  enabled: true
  copyright: "© 2024 ProductName. All rights reserved."
  links:
    - title: "文档"
      link: "/guide/getting-started"
    - title: "GitHub"
      link: "https://github.com/your-org/your-product"
      external: true
```

## 📝 文档内容

### 首页 (index.md)

```markdown
# 欢迎使用 ProductName

ProductName 是一个现代化的解决方案，帮助您快速构建优秀的应用程序。

## ✨ 主要特性

- 🚀 **高性能** - 优化的性能表现
- 🎨 **现代设计** - 简洁美观的界面
- 🔧 **易于使用** - 简单直观的 API
- 📱 **响应式** - 完美适配各种设备

## 🚀 快速开始

```bash
# 安装
npm install productname

# 使用
import ProductName from 'productname'

const app = new ProductName({
  // 配置选项
})
```

## 📚 下一步

- [开始使用](/guide/getting-started) - 了解基本概念
- [安装指南](/guide/installation) - 详细安装步骤
- [API 参考](/api/overview) - 完整的 API 文档
```

### 用户指南 - 开始使用 (guide/getting-started.md)

```markdown
# 开始使用

本指南将帮助您快速了解 ProductName 的基本概念和核心功能。

## 🎯 什么是 ProductName？

ProductName 是一个专为开发者设计的工具，提供以下核心价值：

- **简化开发流程** - 减少重复代码
- **提高开发效率** - 内置最佳实践
- **增强代码质量** - 类型安全支持

## 📋 核心概念

### 概念一：基础配置

每个 ProductName 实例都需要基础配置：

```javascript
const config = {
  name: 'my-app',
  version: '1.0.0',
  environment: 'development'
}
```

### 概念二：插件系统

ProductName 支持插件扩展：

```javascript
import { plugin1, plugin2 } from 'productname-plugins'

const app = new ProductName({
  plugins: [plugin1, plugin2]
})
```

## 🔗 相关链接

- [安装指南](/guide/installation)
- [基本用法](/guide/basic-usage)
- [API 参考](/api/overview)
```

### API 文档 - 概述 (api/overview.md)

```markdown
# API 概述

ProductName 提供了简洁而强大的 API，让您能够快速构建应用程序。

## 📋 API 分类

### 核心 API

核心 API 提供了 ProductName 的基础功能：

- `ProductName` - 主类
- `Config` - 配置管理
- `Plugin` - 插件系统

### 工具 API

工具 API 提供了常用的辅助函数：

- `utils.format()` - 格式化工具
- `utils.validate()` - 验证工具
- `utils.transform()` - 转换工具

## 🚀 快速参考

### 基本用法

```javascript
import ProductName from 'productname'

// 创建实例
const app = new ProductName({
  name: 'my-app'
})

// 初始化
await app.init()

// 运行
app.run()
```

### 配置选项

```typescript
interface Config {
  name: string
  version?: string
  environment?: 'development' | 'production'
  plugins?: Plugin[]
}
```

## 📚 详细文档

查看 [API 参考](/api/reference) 了解所有可用的 API。
```

### 常见问题 (faq.md)

```markdown
# 常见问题

这里收集了用户最常遇到的问题和解决方案。

## 🔧 安装问题

### Q: 安装时出现权限错误

**A:** 尝试使用管理员权限或使用 npm 配置：

```bash
# 使用 sudo (Linux/Mac)
sudo npm install productname

# 或配置 npm
npm config set unsafe-perm true
```

### Q: 版本兼容性问题

**A:** ProductName 要求：

- Node.js >= 14.0.0
- npm >= 6.0.0

请确保您的环境满足这些要求。

## 🚀 使用问题

### Q: 如何处理异步操作？

**A:** ProductName 支持 Promise 和 async/await：

```javascript
// 使用 async/await
async function example() {
  const result = await app.process()
  return result
}

// 使用 Promise
app.process().then(result => {
  console.log(result)
})
```

### Q: 如何调试应用？

**A:** 启用调试模式：

```javascript
const app = new ProductName({
  debug: true,
  logLevel: 'verbose'
})
```

## 🔍 性能问题

### Q: 如何优化性能？

**A:** 考虑以下优化建议：

1. **启用缓存**：
   ```javascript
   const app = new ProductName({
     cache: true
   })
   ```

2. **使用生产模式**：
   ```javascript
   const app = new ProductName({
     environment: 'production'
   })
   ```

3. **按需加载插件**：
   ```javascript
   const plugin = await import('productname-plugin-lazy')
   ```

## 📞 获取帮助

如果您的问题没有在这里找到答案：

- 📖 查看 [完整文档](/guide/getting-started)
- 🐛 [提交 Issue](https://github.com/your-org/your-product/issues)
- 💬 [加入讨论](https://github.com/your-org/your-product/discussions)
- 📧 [联系支持](mailto:support@productname.com)
```

## 🚀 运行示例

### 1. 创建项目

```bash
npm create vue-docs-ui@latest basic-example
cd basic-example
```

### 2. 复制配置

将上面的配置内容复制到对应的文件中。

### 3. 启动开发服务器

```bash
npm install
npm run dev
```

访问 `http://localhost:5173` 查看效果！

## 🎨 自定义样式

### 添加自定义 CSS

创建 `public/styles/custom.css`：

```css
/* 自定义首页样式 */
.docs-home {
  text-align: center;
  padding: 2rem;
}

.docs-home h1 {
  color: #007bff;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.docs-home .features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.docs-home .feature {
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background: #f8f9fa;
}

.docs-home .feature h3 {
  color: #28a745;
  margin-bottom: 0.5rem;
}

/* 自定义代码块样式 */
.docs-content pre {
  background: #2d3748;
  border-radius: 0.5rem;
  padding: 1.5rem;
  overflow-x: auto;
}

.docs-content code {
  background: #e2e8f0;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
}
```

## 📊 添加分析

在 `site.yaml` 中添加 Google Analytics：

```yaml
analytics:
  google:
    enabled: true
    id: "GA_MEASUREMENT_ID"
```

## 🔗 相关资源

- [进阶示例](/examples/api-docs) - 更复杂的 API 文档示例
- [自定义主题](/examples/custom-theme) - 学习主题定制
- [部署指南](/advanced/deployment) - 将您的网站部署到生产环境

## 💡 提示

1. **保持简洁** - 文档应该简洁明了，避免冗余信息
2. **使用示例** - 代码示例比长篇文字更有效
3. **及时更新** - 确保文档与代码同步更新
4. **用户反馈** - 收集用户反馈持续改进文档 