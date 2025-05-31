# 贡献指南 - Vue Docs UI

感谢您对 Vue Docs UI 的贡献兴趣！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 Bug 报告和修复
- 💡 新功能建议和实现
- 📖 文档改进
- 🧪 测试用例
- 🎨 UI/UX 改进
- 🌍 国际化支持

## 🚀 快速开始

### 开发环境要求

- **Node.js**: 16.0+ (推荐使用 LTS 版本)
- **npm**: 7.0+ 或 **yarn**: 1.22+ 或 **pnpm**: 6.0+
- **Git**: 2.20+

### 设置开发环境

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 fork https://github.com/shenjianZ/vue-docs-ui
   # 然后克隆你的 fork
   git clone https://github.com/你的用户名/vue-docs-ui.git
   cd vue-docs-ui
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **运行示例项目**
   ```bash
   cd example
   npm install
   npm run dev
   ```

## 📝 贡献类型

### Bug 报告

发现 bug？请帮助我们改进！

**在提交 bug 报告前，请检查：**
- [ ] 搜索现有的 [Issues](https://github.com/shenjianZ/vue-docs-ui/issues)
- [ ] 使用最新版本测试
- [ ] 提供最小复现示例

**Bug 报告应包含：**
- 清晰的标题和描述
- 复现步骤
- 期望行为 vs 实际行为
- 环境信息（Vue 版本、浏览器、操作系统等）
- 错误截图或日志（如果有）

### 功能请求

有好的想法？我们很乐意听到！

**功能请求应包含：**
- 功能的详细描述
- 使用场景和用例
- 可能的 API 设计
- 是否愿意自己实现

### 代码贡献

#### 工作流程

1. **创建分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或
   git checkout -b fix/bug-description
   ```

2. **编写代码**
   - 遵循现有的代码风格
   - 添加必要的测试
   - 更新相关文档

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **推送并创建 PR**
   ```bash
   git push origin feature/amazing-feature
   ```

#### 提交信息规范

我们使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型说明：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例：**
```
feat(components): add table of contents auto-scroll
fix(router): resolve navigation highlighting issue
docs(readme): update installation instructions
```

## 🧪 测试

### 运行测试

```bash
# 类型检查
npm run type-check

# 构建测试
npm run build:lib

# 在不同环境测试
npm run preview
```

### 添加测试

我们鼓励为新功能添加测试用例：

```bash
# 创建组件测试
touch src/components/__tests__/YourComponent.spec.ts

# 创建工具函数测试
touch src/utils/__tests__/yourUtility.spec.ts
```

## 📖 文档贡献

### 文档类型

- **README**: 项目介绍和快速开始
- **API 文档**: 组件和函数的详细说明
- **指南**: 使用教程和最佳实践
- **示例**: 实际使用场景演示

### 文档规范

- 使用清晰简洁的语言
- 提供代码示例
- 保持中英文版本同步
- 添加适当的截图或图表

## 🎨 代码规范

### TypeScript

- 使用 TypeScript 进行开发
- 导出所有公共 API 的类型定义
- 避免使用 `any` 类型

### Vue 组件

```vue
<template>
  <!-- 使用语义化的 HTML 结构 -->
  <div class="docs-component" :class="componentClasses">
    <!-- 内容 -->
  </div>
</template>

<script setup lang="ts">
// 导入类型
import type { ComponentProps } from '@/types'

// 定义 props
interface Props {
  title: string
  variant?: 'primary' | 'secondary'
}

// 使用 defineProps 和 withDefaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

// 计算属性
const componentClasses = computed(() => ({
  [`docs-component--${props.variant}`]: true
}))
</script>

<style scoped>
/* 使用 CSS 自定义属性 */
.docs-component {
  --docs-component-bg: var(--color-background);
  background: var(--docs-component-bg);
}
</style>
```

### CSS/样式

- 使用 CSS 自定义属性（CSS Variables）
- 遵循 BEM 命名规范
- 支持深色/浅色主题
- 确保无障碍访问（a11y）

## 🌍 国际化

我们支持多语言：

```bash
# 添加新语言
cp README.md README-{language-code}.md
cp CONTRIBUTING.md CONTRIBUTING-{language-code}.md
```

目前支持：
- 🇺🇸 English (`en`)
- 🇨🇳 中文 (`zh`)

## 🔄 发布流程

### 版本管理

我们使用 [Semantic Versioning](https://semver.org/)：

- **MAJOR**: 破坏性变更
- **MINOR**: 新功能（向后兼容）
- **PATCH**: Bug 修复

### 发布步骤

1. 更新 `CHANGELOG.md`
2. 运行 `npm version [patch|minor|major]`
3. 推送标签：`git push origin master --tags`
4. 创建 GitHub Release
5. 发布到 NPM：`npm publish`

## 📞 获取帮助

遇到问题？我们来帮助你！

- 💬 [GitHub Discussions](https://github.com/shenjianZ/vue-docs-ui/discussions) - 提问和讨论
- 🐛 [Issues](https://github.com/shenjianZ/vue-docs-ui/issues) - Bug 报告和功能请求
- 📧 Email: [contact@vuedocsui.com](mailto:contact@vuedocsui.com)

## 👥 社区

- 🌟 给项目点星支持我们
- 🐦 关注 [@VueDocsUI](https://twitter.com/VueDocsUI)
- 💼 [LinkedIn](https://linkedin.com/company/vue-docs-ui)

## 📜 行为准则

### 我们的承诺

为了营造开放友好的环境，我们承诺：

- 使用包容性语言
- 尊重不同观点和经验
- 优雅地接受建设性批评
- 专注于对社区最有益的事情
- 对其他社区成员表示同理心

### 不当行为

以下行为被视为不当行为：

- 使用性化语言或图像
- 人身攻击或侮辱性评论
- 公开或私人骚扰
- 发布他人私人信息
- 其他不道德或不专业的行为

## 🎉 致谢

感谢所有为 Vue Docs UI 做出贡献的开发者！

[![Contributors](https://contrib.rocks/image?repo=shenjianZ/vue-docs-ui)](https://github.com/shenjianZ/vue-docs-ui/graphs/contributors)

## 📄 许可证

通过贡献代码，您同意您的贡献将在 [MIT License](LICENSE) 下授权。

---

**再次感谢您的贡献！🙏** 