# 🎨 多主题系统

vue-docs-ui 现在支持多种预设主题，每个主题都包含亮色和暗色模式。

## 可用主题

### 1. 默认主题 (Default)
- **主色调**: 蓝色系 (#3b82f6)
- **特点**: 现代简洁，适合技术文档
- **适用场景**: 通用技术文档、API文档

### 2. Vue主题 (Vue)
- **主色调**: Vue绿色 (#41b883)
- **特点**: Vue官网风格，温暖友好
- **适用场景**: Vue相关项目、组件库文档

### 3. GitHub主题 (GitHub)
- **主色调**: GitHub蓝色 (#0969da)
- **特点**: 简洁专业，黑白灰配色
- **适用场景**: 开源项目、代码库文档

### 4. 紫色主题 (Purple)
- **主色调**: 紫色系 (#8b5cf6)
- **特点**: 优雅神秘，现代感强
- **适用场景**: 设计系统、创意项目

### 5. 橙色主题 (Orange)
- **主色调**: 橙色系 (#ea580c)
- **特点**: 温暖活力，引人注目
- **适用场景**: 营销页面、产品文档

### 6. 翠绿主题 (Emerald)
- **主色调**: 翠绿色 (#059669)
- **特点**: 清新自然，护眼舒适
- **适用场景**: 环境友好型项目、健康应用

## 使用方法

### 1. 配置文件方式（推荐）

在 `config.yaml` 中设置主题：

```yaml
# 主题配置
theme:
  # 主题选择：default | vue | github | purple | orange | emerald
  theme: "vue"
  
  # 默认模式：light | dark | auto
  defaultMode: "auto"
  
  # 是否允许用户切换主题
  allowToggle: true
  
  # 是否显示主题切换器
  showThemeSwitcher: true
```

详细配置说明请参考 [CONFIG.md](./CONFIG.md)

### 2. 组件方式

```vue
<template>
  <div>
    <!-- 在页面任意位置添加主题切换器 -->
    <ThemeSwitcher />
    
    <!-- 其他内容 -->
    <DocsLayout :config="config" />
  </div>
</template>

<script setup>
import { ThemeSwitcher } from 'vue-docs-ui'
</script>
```

### 3. 编程方式

```javascript
// 切换主题
document.body.className = 'theme-vue'  // 应用Vue主题
document.body.classList.add('dark')    // 启用深色模式

// 或者组合使用
document.body.className = 'theme-github dark'
```

### 4. CSS类名

每个主题对应一个CSS类名：

- `theme-vue` - Vue主题
- `theme-github` - GitHub主题  
- `theme-purple` - 紫色主题
- `theme-orange` - 橙色主题
- `theme-emerald` - 翠绿主题
- `dark` - 深色模式

### 5. 本地存储

主题选择会自动保存到 localStorage：

```javascript
// 获取当前主题
const currentTheme = localStorage.getItem('vue-docs-theme') // 默认: 'default'
const isDark = localStorage.getItem('vue-docs-dark') === 'true'

// 手动设置
localStorage.setItem('vue-docs-theme', 'vue')
localStorage.setItem('vue-docs-dark', 'true')
```

## 自定义主题

### 1. 扩展现有主题

```scss
// 基于Vue主题创建自定义主题
.theme-custom {
  @extend .theme-vue;
  
  // 覆盖特定颜色
  --primary-color: #your-color;
  --accent-color: #your-accent;
}
```

### 2. 完全自定义

```scss
.theme-custom {
  // 颜色系统
  --primary-color: #your-primary;
  --primary-color-dark: #your-primary-dark;
  --accent-color: #your-accent;
  
  // 背景颜色
  --bg-color: #ffffff;
  --bg-color-secondary: #f9f9f9;
  --bg-color-hover: rgba(your-primary-rgb, 0.05);
  
  // 文本颜色
  --text-color: #2c3e50;
  --text-color-light: #7f8c8d;
  --text-color-muted: #95a5a6;
  --heading-color: #2c3e50;
  
  // 边框和分割线
  --border-color: #e4e7ed;
  --border-color-light: #ebeef5;
  
  // 代码块
  --code-bg-color: #f8f8f8;
  --code-text-color: #476582;
  
  // 深色模式
  &.dark {
    --bg-color: #your-dark-bg;
    --text-color: #your-dark-text;
    // ... 其他深色变量
  }
}
```

## 主题切换器配置

```vue
<template>
  <ThemeSwitcher 
    :themes="customThemes"
    :showModeToggle="true"
    position="top-right"
  />
</template>

<script setup>
const customThemes = [
  {
    id: 'custom',
    name: '自定义主题',
    description: '我的专属主题',
    colors: { primary: '#ff6b6b', accent: '#4ecdc4' }
  }
]
</script>
```

## 响应式支持

所有主题都支持响应式设计：

```scss
// 移动端适配
@media (max-width: 768px) {
  .theme-switcher {
    .theme-label {
      display: none; // 隐藏主题名称，只显示图标
    }
  }
}
```

## 可访问性

- 支持键盘导航 (Tab, Enter, Escape)
- 提供 ARIA 标签
- 高对比度文本
- 色盲友好的颜色选择

## 性能优化

- CSS变量实现，切换主题无需重新加载
- 主题配置懒加载
- 最小化样式冲突
- 优化的动画过渡

## 最佳实践

1. **主题一致性**: 确保自定义主题与品牌色彩保持一致
2. **对比度**: 保证文本在所有主题下都有足够的对比度
3. **测试**: 在亮色和暗色模式下都要测试你的内容
4. **用户体验**: 提供明显的主题切换入口
5. **性能**: 避免在主题中使用过多的自定义字体或图片

## 故障排除

### 主题不生效
```javascript
// 检查body类名
console.log(document.body.className)

// 手动应用主题
document.body.className = 'theme-vue dark'
```

### 样式冲突
```scss
// 使用更具体的选择器
.theme-custom {
  .your-component {
    color: var(--text-color) !important;
  }
}
```

### 深色模式问题
```javascript
// 检查系统偏好
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
console.log('System prefers dark mode:', prefersDark)
``` 