# Themes

Vue Docs UI comes with a powerful theming system that supports light, dark, and custom themes.

## Theme Configuration

### Basic Theme Setup

Configure your theme in `site.yaml`:

```yaml
theme:
  defaultMode: "auto"      # 'light' | 'dark' | 'auto'
  allowToggle: true        # Show theme toggle button
```

### Theme Modes

- **light**: Force light theme
- **dark**: Force dark theme  
- **auto**: Follow system preference (default)

## Color System

### Default Color Palette

```yaml
theme:
  colors:
    # Brand Colors
    primary: "#3b82f6"      # Primary brand color
    secondary: "#64748b"    # Secondary color
    accent: "#06b6d4"       # Accent color
    
    # Background Colors
    background: "#ffffff"   # Main background
    surface: "#f8fafc"      # Cards, panels
    
    # Text Colors
    text: "#1e293b"         # Primary text
    textSecondary: "#64748b" # Secondary text
    
    # UI Colors
    border: "#e2e8f0"       # Borders, dividers
    success: "#10b981"      # Success states
    warning: "#f59e0b"      # Warning states
    error: "#ef4444"        # Error states
```

### Dark Theme Colors

Dark theme automatically adjusts colors, but you can customize them:

```css
.dark {
  --primary-color: #60a5fa;
  --bg-color: #0f172a;
  --surface-color: #1e293b;
  --text-color: #f1f5f9;
  --text-secondary-color: #94a3b8;
  --border-color: #334155;
}
```

## Typography

### Font Configuration

```yaml
theme:
  fonts:
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    mono: "JetBrains Mono, Consolas, Monaco, monospace"
```

### Custom Fonts

Load external fonts in your HTML:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```

Then reference them in your theme:

```yaml
theme:
  fonts:
    primary: "Roboto, sans-serif"
```

## Layout Customization

### Layout Dimensions

```yaml
theme:
  layout:
    headerHeight: "60px"
    sidebarWidth: "280px"
    tocWidth: "240px"
    contentMaxWidth: "1200px"
```

### Responsive Breakpoints

```css
/* Customize breakpoints */
:root {
  --mobile-breakpoint: 768px;
  --tablet-breakpoint: 1024px;
  --desktop-breakpoint: 1200px;
}
```

## CSS Variables

Vue Docs UI uses CSS custom properties for easy theming:

### Core Variables

```css
:root {
  /* Colors */
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --accent-color: #06b6d4;
  
  /* Background */
  --bg-color: #ffffff;
  --bg-color-secondary: #f8fafc;
  --bg-color-hover: rgba(59, 130, 246, 0.05);
  
  /* Text */
  --text-color: #1e293b;
  --text-color-light: #64748b;
  
  /* Border */
  --border-color: #e2e8f0;
  --border-color-light: #f1f5f9;
  
  /* Layout */
  --header-height: 60px;
  --sidebar-width: 280px;
  --toc-width: 240px;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
}
```

### Component-Specific Variables

```css
:root {
  /* Header */
  --header-bg: rgba(255, 255, 255, 0.95);
  --header-border: var(--border-color);
  
  /* Sidebar */
  --sidebar-bg: var(--bg-color);
  --sidebar-border: var(--border-color);
  
  /* Code blocks */
  --code-bg: #f8fafc;
  --code-color: #e11d48;
  --code-block-bg: #0f172a;
}
```

## Creating Custom Themes

### Theme File Structure

Create a custom theme file:

```css
/* themes/custom.css */
.theme-custom {
  --primary-color: #8b5cf6;
  --secondary-color: #a855f7;
  --accent-color: #c084fc;
  
  --bg-color: #faf5ff;
  --bg-color-secondary: #f3e8ff;
  
  --text-color: #581c87;
  --text-color-light: #7c3aed;
}
```

### Applying Custom Themes

```typescript
// Apply theme programmatically
document.documentElement.className = 'theme-custom'

// Or add theme class based on user preference
const applyTheme = (themeName: string) => {
  document.documentElement.className = `theme-${themeName}`
}
```

## Animation and Transitions

### Default Transitions

```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

/* Apply to components */
.nav-link {
  transition: color var(--transition-fast);
}
```

### Custom Animations

```css
/* Custom hover effects */
.chapter-card {
  transition: transform var(--transition-normal);
}

.chapter-card:hover {
  transform: translateY(-4px);
}
```

## Theme Toggle Component

### Manual Theme Toggle

```vue
<template>
  <button @click="toggleTheme" class="theme-toggle">
    <SunIcon v-if="isDark" />
    <MoonIcon v-else />
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = saved ? saved === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
```

## Best Practices

### 1. Use Semantic Colors

```yaml
colors:
  primary: "#3b82f6"     # Brand color
  success: "#10b981"     # Success actions
  warning: "#f59e0b"     # Warnings
  error: "#ef4444"       # Errors
```

### 2. Maintain Contrast

Ensure sufficient contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### 3. Test Both Themes

Always test your customizations in both light and dark modes.

### 4. Use CSS Variables

Prefer CSS variables over hardcoded values for maintainability:

```css
/* Good */
color: var(--text-color);

/* Avoid */
color: #1e293b;
```

### 5. Progressive Enhancement

Design for light theme first, then enhance for dark:

```css
/* Base styles */
.component {
  background: var(--bg-color);
  color: var(--text-color);
}

/* Dark mode enhancements */
.dark .component {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
``` 