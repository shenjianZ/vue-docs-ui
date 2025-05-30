# Vue Docs UI

一个真正开箱即用的Vue 3文档网站组件库，支持YAML配置和Markdown渲染。

## 特性

- 🎨 现代化的UI设计，支持深色/浅色主题
- 📝 支持Markdown文档渲染，自动生成目录
- ⚙️ YAML配置驱动，易于定制
- 📱 响应式设计，完美支持移动端
- 🔍 内置搜索功能和导航
- 🚀 基于Vue 3 + TypeScript，类型安全
- 📦 真正开箱即用，无需创建任何组件
- 🎯 专为文档网站优化

## 安装

```bash
npm install vue-docs-ui
# 或
yarn add vue-docs-ui
```

## 开箱即用 - 3步搭建文档网站

### 1. 创建main.ts（仅需3行代码）

```typescript
// main.ts
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

createDocsApp()
```

### 2. 创建配置文件

创建 `public/config/site.yaml`:

```yaml
site:
  title: "我的文档网站"
  description: "使用Vue Docs UI构建的文档网站"
  logo: "📚"

nav:
  - text: "首页"
    link: "/"
  - text: "指南"
    link: "/guide"
  - text: "GitHub"
    link: "https://github.com/yourrepo"
    external: true

sidebar:
  - text: "开始使用"
    children:
      - text: "快速开始"
        link: "/guide/getting-started"
      - text: "安装配置"
        link: "/guide/installation"
  - text: "高级用法"
    children:
      - text: "自定义主题"
        link: "/advanced/themes"

theme:
  primaryColor: "#3b82f6"
  accentColor: "#10b981"
```

### 3. 添加Markdown文档

在 `public/docs/` 目录下创建对应的Markdown文件：

```
public/
├── config/
│   └── site.yaml
└── docs/
    ├── guide/
    │   ├── getting-started.md
    │   └── installation.md
    └── advanced/
        └── themes.md
```

**就这样！** 🎉 您的文档网站已经准备就绪！

运行 `npm run dev` 即可看到效果。

## 自定义选项

如果需要自定义，可以传递选项：

```typescript
// main.ts
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

createDocsApp({
  configPath: '/config/site.yaml',  // 配置文件路径，默认 '/config/site.yaml'
  el: '#app',                       // 挂载元素，默认 '#app'
  customComponents: {               // 自定义组件（可选）
    home: () => import('./views/MyHome.vue'),
    article: () => import('./views/MyArticle.vue')
  }
})
```

## 完整项目结构

```
my-docs-project/
├── public/
│   ├── config/
│   │   └── site.yaml        # 站点配置
│   └── docs/               # Markdown文档
│       ├── guide/
│       │   ├── getting-started.md
│       │   └── installation.md
│       └── advanced/
│           └── themes.md
├── src/
│   └── main.ts             # 仅需几行代码
├── index.html              # 基础HTML文件
├── package.json
└── vite.config.js
```

## Markdown文档示例

```markdown
<!-- public/docs/guide/getting-started.md -->
# 快速开始

欢迎使用Vue Docs UI！这是一个开箱即用的文档网站构建工具。

## 安装

\`\`\`bash
npm install vue-docs-ui
\`\`\`

## 基本用法

只需要3行代码就可以创建一个完整的文档网站：

\`\`\`typescript
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'

createDocsApp()
\`\`\`

## 功能特性

- ✅ 自动生成导航
- ✅ Markdown渲染
- ✅ 目录生成
- ✅ 响应式设计
- ✅ 主题切换

就这么简单！
```

## 高级用法

### 自定义主题

```yaml
# site.yaml
theme:
  primaryColor: "#3b82f6"
  accentColor: "#10b981"
  backgroundColor: "#ffffff"
  textColor: "#1f2937"
  fontFamily: "Inter, sans-serif"
```

### 自定义首页

```typescript
// main.ts
import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'
import MyHome from './MyHome.vue'

createDocsApp({
  customComponents: {
    home: MyHome
  }
})
```

### 使用组件库模式（高级用户）

```typescript
// 如果需要更多控制，可以使用组件库模式
import { createApp } from 'vue'
import { createDocsUI, loadConfig } from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'
import App from './App.vue'

async function initApp() {
  const config = await loadConfig('/config/site.yaml')
  const app = createApp(App)
  app.use(createDocsUI({ config }))
  app.mount('#app')
}

initApp()
```

## 与其他工具的比较

| 特性 | Vue Docs UI | VitePress | Docusaurus |
|------|-------------|-----------|------------|
| 设置复杂度 | ⭐ 3行代码 | ⭐⭐ 需要配置 | ⭐⭐⭐ 复杂配置 |
| Vue 3 支持 | ✅ 原生支持 | ✅ 支持 | ❌ React only |
| 开箱即用 | ✅ 完全即用 | ⭐⭐ 需要配置 | ⭐⭐ 需要配置 |
| TypeScript | ✅ 完整支持 | ✅ 支持 | ✅ 支持 |
| 自定义程度 | ⭐⭐⭐ 高度自定义 | ⭐⭐ 中等 | ⭐⭐⭐ 高度自定义 |

## 示例项目

查看 `example/` 目录下的完整示例项目，展示了如何构建一个机器学习文档网站。

## 常见问题

### Q: 是否需要创建Vue组件？
A: 不需要！开箱即用，只需要配置YAML和编写Markdown。

### Q: 如何添加新页面？
A: 只需要：1) 在sidebar配置中添加链接 2) 创建对应的.md文件

### Q: 支持哪些Markdown功能？
A: 支持标准Markdown + 代码高亮 + 数学公式 + 表格 + 目录生成

### Q: 如何部署？
A: 运行 `npm run build` 后将dist目录部署到任意静态服务器

## 快速开始模板

创建新项目最快的方式：

```bash
# 1. 创建新目录
mkdir my-docs && cd my-docs

# 2. 初始化项目
npm init -y
npm install vue-docs-ui

# 3. 创建必要文件
mkdir -p public/config public/docs/guide src

# 4. 创建main.ts
echo "import createDocsApp from 'vue-docs-ui'
import 'vue-docs-ui/dist/style.css'
createDocsApp()" > src/main.ts

# 5. 创建配置文件
# （复制上面的YAML配置到 public/config/site.yaml）

# 6. 创建首页文档
echo "# 欢迎
这是我的文档网站！" > public/docs/guide/getting-started.md

# 7. 启动开发服务器
npm run dev
```

## 开发

```bash
# 克隆项目
git clone https://github.com/yourrepo/vue-docs-ui.git

# 安装依赖
cd vue-docs-ui
npm install

# 开发模式
npm run dev

# 构建库
npm run build:lib

# 类型检查
npm run type-check
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.0.0
- 🎉 首次发布
- ✨ 真正开箱即用，3行代码搭建网站
- ✨ 支持YAML配置驱动
- ✨ Markdown渲染和目录生成
- ✨ 响应式设计和主题切换
- ✨ TypeScript支持
- ✨ 内置美观的默认组件 