# 自定义主题

Vue Docs UI 提供了强大的主题系统，让您可以完全自定义文档网站的外观和感觉。

## 🎨 主题系统概述

Vue Docs UI 的主题系统基于 CSS 变量，支持：

- **明暗主题切换**
- **自定义颜色方案**
- **字体配置**
- **布局调整**
- **动画效果**

## 🌈 颜色配置

### 基础颜色

在 `site.yaml` 中配置基础颜色：

```yaml
theme:
  colors:
    primary: "#3b82f6"        # 主色调 - 用于链接、按钮等
    secondary: "#64748b"      # 次要颜色 - 用于次要文本
    accent: "#06b6d4"         # 强调色 - 用于高亮、徽章等
    background: "#ffffff"     # 背景色
    surface: "#f8fafc"        # 表面色 - 用于卡片、面板
    text: "#1e293b"          # 主文本色
    textSecondary: "#64748b"  # 次要文本色
    border: "#e2e8f0"        # 边框色
```

### 状态颜色

```yaml
theme:
  colors:
    success: "#10b981"       # 成功状态
    warning: "#f59e0b"       # 警告状态
    error: "#ef4444"         # 错误状态
    info: "#3b82f6"          # 信息状态
```

### 暗色主题

Vue Docs UI 会自动为暗色主题生成对应的颜色值，您也可以手动指定：

```yaml
theme:
  colors:
    # 明亮主题颜色
    primary: "#3b82f6"
    background: "#ffffff"
    text: "#1e293b"
    
  darkColors:
    # 暗色主题颜色（可选）
    primary: "#60a5fa"
    background: "#0f172a"
    text: "#f1f5f9"
```

## 🔤 字体配置

### 基础字体

```yaml
theme:
  fonts:
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    mono: "JetBrains Mono, Consolas, Monaco, monospace"
    heading: "Inter, sans-serif"  # 可选，标题字体
```

### 字体大小

```yaml
theme:
  typography:
    baseFontSize: "16px"
    lineHeight: 1.6
    headingLineHeight: 1.2
    
    # 字体大小比例
    scale:
      xs: "0.75rem"    # 12px
      sm: "0.875rem"   # 14px
      base: "1rem"     # 16px
      lg: "1.125rem"   # 18px
      xl: "1.25rem"    # 20px
      "2xl": "1.5rem"  # 24px
      "3xl": "1.875rem" # 30px
      "4xl": "2.25rem"  # 36px
```

### 自定义字体

如果要使用自定义字体，需要先加载字体文件：

```html
<!-- 在 index.html 中添加 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

然后在配置中使用：

```yaml
theme:
  fonts:
    primary: "Poppins, sans-serif"
```

## 📐 布局配置

### 基础布局

```yaml
theme:
  layout:
    headerHeight: "60px"      # 头部高度
    sidebarWidth: "280px"     # 侧边栏宽度
    tocWidth: "240px"         # 目录宽度
    contentMaxWidth: "1200px" # 内容最大宽度
    contentPadding: "2rem"    # 内容内边距
```

### 响应式断点

```yaml
theme:
  breakpoints:
    sm: "640px"
    md: "768px"
    lg: "1024px"
    xl: "1280px"
    "2xl": "1536px"
```

### 间距系统

```yaml
theme:
  spacing:
    xs: "0.25rem"    # 4px
    sm: "0.5rem"     # 8px
    md: "1rem"       # 16px
    lg: "1.5rem"     # 24px
    xl: "2rem"       # 32px
    "2xl": "3rem"    # 48px
    "3xl": "4rem"    # 64px
```

## 🎭 主题模式

### 配置主题模式

```yaml
theme:
  # 默认主题模式
  defaultMode: "auto"  # "light" | "dark" | "auto"
  
  # 是否允许用户切换主题
  allowToggle: true
  
  # 主题切换动画
  transition: "all 0.3s ease"
```

### 自定义主题检测

```javascript
// 在 main.ts 中
import { createDocsApp } from 'vue-docs-ui'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  theme: {
    // 自定义主题检测逻辑
    detectTheme: () => {
      // 返回 'light' 或 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }
})
```

## 🎨 高级自定义

### 使用 CSS 变量

Vue Docs UI 使用 CSS 变量系统，您可以通过 CSS 进一步自定义：

```css
/* 创建 public/styles/custom.css */
:root {
  /* 覆盖默认颜色 */
  --primary-color: #your-primary-color;
  --background-color: #your-background-color;
  
  /* 自定义阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* 自定义圆角 */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
}

/* 暗色主题变量 */
[data-theme="dark"] {
  --primary-color: #your-dark-primary-color;
  --background-color: #your-dark-background-color;
}
```

### 组件级别自定义

```css
/* 自定义头部样式 */
.docs-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
}

/* 自定义侧边栏 */
.docs-sidebar {
  border-right: 2px solid var(--primary-color);
}

/* 自定义代码块 */
.docs-code-block {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

/* 自定义链接样式 */
.docs-content a {
  color: var(--primary-color);
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.3s ease;
}

.docs-content a:hover {
  text-decoration-color: var(--primary-color);
}
```

### 动画配置

```yaml
theme:
  animations:
    # 页面切换动画
    pageTransition: "fade"  # "fade" | "slide" | "none"
    
    # 动画持续时间
    duration:
      fast: "150ms"
      normal: "300ms"
      slow: "500ms"
    
    # 缓动函数
    easing:
      ease: "cubic-bezier(0.4, 0, 0.2, 1)"
      easeIn: "cubic-bezier(0.4, 0, 1, 1)"
      easeOut: "cubic-bezier(0, 0, 0.2, 1)"
```

## 🎪 主题预设

### 内置主题

Vue Docs UI 提供了几个内置主题预设：

```yaml
theme:
  preset: "default"  # "default" | "minimal" | "modern" | "classic"
```

#### Default 主题
- 平衡的设计
- 适合大多数用途
- 蓝色主色调

#### Minimal 主题
- 简洁的设计
- 更多留白
- 灰色主色调

#### Modern 主题
- 现代化设计
- 渐变和阴影
- 紫色主色调

#### Classic 主题
- 传统文档风格
- 清晰的层次
- 绿色主色调

### 创建自定义预设

```javascript
// 在 main.ts 中注册自定义主题
import { createDocsApp, registerTheme } from 'vue-docs-ui'

// 注册自定义主题
registerTheme('corporate', {
  colors: {
    primary: '#1a365d',
    secondary: '#2d3748',
    accent: '#3182ce',
    background: '#ffffff',
    surface: '#f7fafc',
    text: '#2d3748',
    textSecondary: '#4a5568',
    border: '#e2e8f0'
  },
  fonts: {
    primary: 'Arial, sans-serif',
    mono: 'Courier New, monospace'
  },
  layout: {
    headerHeight: '70px',
    sidebarWidth: '300px'
  }
})

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  theme: {
    preset: 'corporate'
  }
})
```

## 🌟 主题最佳实践

### 1. 保持一致性

确保颜色、字体和间距在整个网站中保持一致：

```yaml
theme:
  colors:
    # 使用有限的颜色调色板
    primary: "#3b82f6"
    secondary: "#64748b"
    # 避免使用太多不同的颜色
    
  fonts:
    # 限制字体种类
    primary: "Inter, sans-serif"
    mono: "JetBrains Mono, monospace"
    # 不要混合太多字体
```

### 2. 考虑可访问性

确保颜色对比度符合 WCAG 标准：

```yaml
theme:
  colors:
    # 确保文本和背景有足够的对比度
    text: "#1e293b"        # 深色文本
    background: "#ffffff"   # 浅色背景
    
    # 避免仅依靠颜色传达信息
    success: "#10b981"     # 配合图标使用
    error: "#ef4444"       # 配合文字说明
```

### 3. 响应式设计

确保主题在不同设备上都能良好显示：

```yaml
theme:
  layout:
    # 使用相对单位
    headerHeight: "4rem"    # 而不是固定像素
    contentPadding: "2rem"  # 在移动端会自动调整
    
  typography:
    # 使用响应式字体大小
    baseFontSize: "clamp(14px, 2.5vw, 16px)"
```

### 4. 性能优化

优化主题加载性能：

```css
/* 使用 CSS 变量减少重复 */
:root {
  --primary-hue: 220;
  --primary-saturation: 100%;
  --primary-lightness: 50%;
  
  --primary-color: hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness));
  --primary-light: hsl(var(--primary-hue), var(--primary-saturation), 60%);
  --primary-dark: hsl(var(--primary-hue), var(--primary-saturation), 40%);
}

/* 避免复杂的选择器 */
.docs-button {
  /* 好的做法 */
  background: var(--primary-color);
}

.docs-content .section .subsection .item .button {
  /* 避免这样的深层嵌套 */
}
```

## 🔧 调试主题

### 开发工具

使用浏览器开发者工具调试主题：

1. **检查 CSS 变量**：在 Elements 面板中查看 `:root` 元素
2. **实时编辑**：直接修改 CSS 变量值查看效果
3. **主题切换测试**：测试明暗主题切换

### 主题验证

```javascript
// 在控制台中验证主题配置
console.log(window.__DOCS_THEME__)

// 检查 CSS 变量
const root = document.documentElement
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color')
console.log('Primary color:', primaryColor)
```

## 📚 示例主题

### 技术博客主题

```yaml
theme:
  colors:
    primary: "#0066cc"
    secondary: "#666666"
    accent: "#ff6b35"
    background: "#ffffff"
    surface: "#f8f9fa"
    text: "#333333"
    textSecondary: "#666666"
    border: "#e1e5e9"
    
  fonts:
    primary: "Source Sans Pro, sans-serif"
    mono: "Source Code Pro, monospace"
    
  layout:
    headerHeight: "64px"
    sidebarWidth: "260px"
    contentMaxWidth: "1000px"
```

### 产品文档主题

```yaml
theme:
  colors:
    primary: "#6366f1"
    secondary: "#64748b"
    accent: "#06b6d4"
    background: "#ffffff"
    surface: "#f8fafc"
    text: "#1e293b"
    textSecondary: "#64748b"
    border: "#e2e8f0"
    
  fonts:
    primary: "Inter, sans-serif"
    mono: "JetBrains Mono, monospace"
    
  layout:
    headerHeight: "60px"
    sidebarWidth: "280px"
    contentMaxWidth: "1200px"
```

## 📚 下一步

- 查看 [组件开发](/advanced/components) 了解如何自定义组件
- 阅读 [API 参考](/advanced/api) 了解完整的主题 API
- 探索 [部署](/advanced/deployment) 学习如何部署自定义主题 