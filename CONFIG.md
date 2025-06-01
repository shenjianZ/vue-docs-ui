# 📝 配置文件说明

vue-docs-ui 支持通过 YAML 配置文件来控制网站的外观和行为，包括主题设置。

## 📁 配置文件位置

- `public/config/site.yaml` - 默认配置文件
- `public/config/site.en.yaml` - 英文配置文件（可选）

## 🎨 主题配置

### 基本语法

```yaml
# 主题配置
theme:
  # 主题选择
  theme: "vue"
  
  # 默认模式
  defaultMode: "auto"
  
  # 用户控制
  allowToggle: true
  showThemeSwitcher: true
```

### 配置选项详解

#### `theme` - 主题选择

选择预设的主题颜色方案：

```yaml
theme:
  theme: "vue"  # 主题名称
```

**可选值:**
- `"default"` - 默认蓝色主题 
- `"vue"` - Vue官网绿色主题
- `"github"` - GitHub黑白灰主题
- `"purple"` - 紫色主题
- `"orange"` - 橙色主题
- `"emerald"` - 翠绿主题

#### `defaultMode` - 默认模式

设置网站的默认明暗模式：

```yaml
theme:
  defaultMode: "auto"  # 模式选择
```

**可选值:**
- `"light"` - 强制浅色模式
- `"dark"` - 强制深色模式
- `"auto"` - 根据用户系统偏好自动选择（推荐）

#### `allowToggle` - 允许用户切换

控制用户是否可以切换主题和模式：

```yaml
theme:
  allowToggle: true  # 是否允许切换
```

**取值:**
- `true` - 允许用户切换主题和明暗模式
- `false` - 锁定主题，用户无法切换

#### `showThemeSwitcher` - 显示切换器

控制是否显示主题切换器组件：

```yaml
theme:
  showThemeSwitcher: true  # 是否显示切换器
```

**取值:**
- `true` - 显示主题切换器按钮（默认）
- `false` - 隐藏主题切换器，但用户仍可通过其他方式切换

## 🔄 配置优先级

主题应用的优先级顺序：

1. **用户选择** - localStorage 中保存的用户偏好
2. **配置文件** - config.yaml 中的设置
3. **系统偏好** - 用户操作系统的主题偏好
4. **默认值** - 系统默认设置

## 📋 完整配置示例

```yaml
# 网站基本配置
site:
  title: "我的文档网站"
  description: "这是一个使用vue-docs-ui构建的文档网站"
  logo: "📚"
  author: "作者名称"

# 顶部导航
navbar:
  items:
    - title: "首页"
      link: "/"
      active: true
    - title: "指南"
      link: "/guide/introduction"
    - title: "GitHub"
      link: "https://github.com/your-repo"
      external: true

# 侧边栏导航
sidebar:
  sections:
    - title: "快速开始"
      path: "/guide"
      children:
        - title: "介绍"
          path: "/guide/introduction"
        - title: "安装"
          path: "/guide/installation"

# 主题配置
theme:
  # 使用Vue主题
  theme: "vue"
  
  # 自动检测系统偏好
  defaultMode: "auto"
  
  # 允许用户切换
  allowToggle: true
  
  # 显示切换器
  showThemeSwitcher: true

# 目录配置
toc:
  enabled: true
  maxLevel: 3
  title: "目录"
```

## 🎯 使用场景

### 1. 固定主题模式

如果你想为网站设置固定的主题和模式：

```yaml
theme:
  theme: "github"        # 使用GitHub主题
  defaultMode: "light"   # 固定为浅色模式
  allowToggle: false     # 禁止用户切换
  showThemeSwitcher: false  # 隐藏切换器
```

### 2. 自由切换模式

如果你想让用户完全控制主题：

```yaml
theme:
  theme: "default"       # 默认主题
  defaultMode: "auto"    # 自动检测
  allowToggle: true      # 允许切换
  showThemeSwitcher: true   # 显示切换器
```

### 3. 品牌定制模式

如果你想使用特定品牌主题：

```yaml
theme:
  theme: "vue"           # Vue主题，适合Vue项目
  defaultMode: "auto"    # 自动检测
  allowToggle: true      # 允许切换
  showThemeSwitcher: true   # 显示切换器
```

## 🔧 高级配置

### 自定义主题切换器

如果你想在代码中手动控制主题切换器：

```vue
<template>
  <ThemeSwitcher 
    :visible="true"
    :allowThemeToggle="true" 
    :allowModeToggle="true"
  />
</template>

<script setup>
import { ThemeSwitcher } from 'vue-docs-ui'
</script>
```

### 编程方式应用主题

```javascript
// 手动应用主题
document.body.className = 'theme-vue dark'

// 或者分别设置
document.body.classList.add('theme-vue')
document.body.classList.add('dark')
```

## 📱 响应式支持

所有主题配置都支持响应式设计，在移动设备上会自动调整：

- 主题切换器在小屏幕上会隐藏文字，只显示图标
- 深色模式在移动设备上提供更好的续航表现
- 所有主题都针对移动设备进行了优化

## 🐛 故障排除

### 主题不生效

1. 检查配置文件语法是否正确
2. 确认主题名称拼写正确
3. 查看浏览器控制台是否有错误信息

```javascript
// 调试：检查当前应用的主题
console.log(document.body.className)

// 调试：手动应用主题测试
document.body.className = 'theme-vue dark'
```

### 配置文件加载失败

1. 确认配置文件路径正确
2. 检查YAML语法是否有错误
3. 查看网络请求是否成功

```yaml
# 错误的YAML语法
theme:
theme: "vue"  # 缺少空格

# 正确的YAML语法
theme:
  theme: "vue"  # 正确缩进
```

### 主题切换器不显示

检查配置是否正确：

```yaml
theme:
  showThemeSwitcher: true  # 确保为true
  allowToggle: true        # 确保允许切换
```

## 📚 相关文档

- [主题系统详解](./THEMES.md)
- [组件使用指南](./README.md)
- [开发者文档](./CONTRIBUTING.md) 