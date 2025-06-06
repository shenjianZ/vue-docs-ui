# Components

Vue Docs UI provides a comprehensive set of components for building documentation sites.

## Core Components

### DocsLayout

The main layout component that wraps your entire documentation site.

```vue
<template>
  <DocsLayout :config="config" :showToc="true">
    <router-view />
  </DocsLayout>
</template>

<script setup>
import { DocsLayout } from 'vue-docs-ui'

const config = {
  // Your site configuration
}
</script>
```

**Props:**
- `config` (Object): Site configuration object
- `showToc` (Boolean): Show table of contents (default: true)

### HeaderNav

Top navigation bar component.

```vue
<template>
  <HeaderNav :config="config" @toggle-sidebar="handleSidebarToggle" />
</template>

<script setup>
import { HeaderNav } from 'vue-docs-ui'

const handleSidebarToggle = () => {
  // Handle sidebar toggle
}
</script>
```

**Props:**
- `config` (Object): Site configuration object

**Events:**
- `toggle-sidebar`: Emitted when mobile menu button is clicked

### SidebarNav

Sidebar navigation component.

```vue
<template>
  <SidebarNav 
    :config="config" 
    :isOpen="sidebarOpen" 
    @close="closeSidebar" 
  />
</template>

<script setup>
import { SidebarNav } from 'vue-docs-ui'

const sidebarOpen = ref(false)

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>
```

**Props:**
- `config` (Object): Site configuration object
- `isOpen` (Boolean): Whether sidebar is open (mobile)
- `uniqueExpansion` (Boolean): Only allow one section expanded at a time

**Events:**
- `close`: Emitted when sidebar should be closed

### TableOfContents

Table of contents component for articles.

```vue
<template>
  <TableOfContents :headers="headers" />
</template>

<script setup>
import { TableOfContents } from 'vue-docs-ui'

const headers = [
  { text: 'Introduction', anchor: 'introduction', level: 1 },
  { text: 'Getting Started', anchor: 'getting-started', level: 2 }
]
</script>
```

**Props:**
- `headers` (Array): Array of header objects with text, anchor, and level

### MarkdownRenderer

Component for rendering markdown content.

```vue
<template>
  <MarkdownRenderer :content="markdownContent" />
</template>

<script setup>
import { MarkdownRenderer } from 'vue-docs-ui'

const markdownContent = `
# Hello World

This is **markdown** content.
`
</script>
```

**Props:**
- `content` (String): Markdown content to render

## Page Components

### DefaultHome

Default homepage component.

```vue
<template>
  <DefaultHome :config="config" />
</template>

<script setup>
import { DefaultHome } from 'vue-docs-ui'
</script>
```

**Props:**
- `config` (Object): Site configuration object

### DefaultArticle

Default article page component.

```vue
<template>
  <DefaultArticle :title="title" />
</template>

<script setup>
import { DefaultArticle } from 'vue-docs-ui'
</script>
```

**Props:**
- `title` (String): Article title

## Utility Components

### SearchBox

Search functionality component.

```vue
<template>
  <SearchBox 
    :placeholder="'Search docs...'" 
    @search="handleSearch" 
  />
</template>

<script setup>
const handleSearch = (query) => {
  // Handle search query
}
</script>
```

**Props:**
- `placeholder` (String): Search input placeholder

**Events:**
- `search`: Emitted when search is performed

### ThemeToggle

Theme switcher component.

```vue
<template>
  <ThemeToggle @theme-change="handleThemeChange" />
</template>

<script setup>
const handleThemeChange = (theme) => {
  // Handle theme change
}
</script>
```

**Events:**
- `theme-change`: Emitted when theme is changed

## Custom Components

### Creating Custom Components

You can create custom components that integrate with Vue Docs UI:

```vue
<!-- CustomHeader.vue -->
<template>
  <header class="custom-header">
    <div class="container">
      <h1>{{ config.site.title }}</h1>
      <nav>
        <router-link 
          v-for="item in config.navbar.items" 
          :key="item.title"
          :to="item.link"
        >
          {{ item.title }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'

const config = inject('docsConfig')
</script>
```

### Using Custom Components

Replace default components with your custom ones:

```typescript
import { createDocsApp } from 'vue-docs-ui'
import CustomHome from './CustomHome.vue'
import CustomArticle from './CustomArticle.vue'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  customComponents: {
    home: CustomHome,
    article: CustomArticle
  }
})
```

## Component Styling

### Default Classes

Each component comes with default CSS classes:

```css
/* HeaderNav */
.header-nav { }
.nav-container { }
.nav-brand { }
.nav-menu { }
.nav-actions { }

/* SidebarNav */
.sidebar-nav { }
.nav-sections { }
.section-link { }
.child-link { }

/* TableOfContents */
.table-of-contents { }
.toc-nav { }
.toc-item { }

/* DocsLayout */
.docs-layout { }
.docs-container { }
.docs-main { }
.docs-content { }
```

### Custom Styling

Override component styles:

```css
/* Custom header styling */
.header-nav {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.nav-brand .brand-title {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Custom sidebar styling */
.sidebar-nav {
  background: #f8fafc;
  border-right: 2px solid #e2e8f0;
}

.section-link.active {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### Scoped Styling

Use CSS modules or scoped styles:

```vue
<template>
  <div class="custom-component">
    <HeaderNav :config="config" />
  </div>
</template>

<style scoped>
.custom-component .header-nav {
  /* Scoped styles */
}
</style>
```

## Accessibility

### ARIA Labels

Components include proper ARIA labels:

```html
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" href="/guide">Guide</a>
    </li>
  </ul>
</nav>
```

### Keyboard Navigation

All components support keyboard navigation:

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow Keys**: Navigate through menus

### Screen Readers

Components are optimized for screen readers:

```html
<button aria-label="Toggle theme" aria-pressed="false">
  <span aria-hidden="true">🌙</span>
</button>
```

## Performance

### Lazy Loading

Components support lazy loading:

```typescript
// Lazy load heavy components
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
```

### Tree Shaking

Import only the components you need:

```typescript
// Import specific components
import { HeaderNav, SidebarNav } from 'vue-docs-ui'

// Instead of importing everything
import * as VueDocsUI from 'vue-docs-ui'
```

### Bundle Size

Component sizes (gzipped):
- DocsLayout: ~8kb
- HeaderNav: ~3kb
- SidebarNav: ~4kb
- TableOfContents: ~2kb
- MarkdownRenderer: ~12kb

## TypeScript Support

All components include TypeScript definitions:

```typescript
import type { DocsConfig, NavItem, SidebarSection } from 'vue-docs-ui'

interface Props {
  config: DocsConfig
  navigation: NavItem[]
}

const props = defineProps<Props>()
```

## Testing

### Unit Testing

Test components with Vue Test Utils:

```typescript
import { mount } from '@vue/test-utils'
import { HeaderNav } from 'vue-docs-ui'

describe('HeaderNav', () => {
  it('renders navigation items', () => {
    const config = {
      navbar: {
        items: [
          { title: 'Home', link: '/' }
        ]
      }
    }
    
    const wrapper = mount(HeaderNav, {
      props: { config }
    })
    
    expect(wrapper.text()).toContain('Home')
  })
})
```

### E2E Testing

Test component interactions:

```typescript
// cypress/integration/navigation.spec.ts
describe('Navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('/')
    cy.get('[data-testid="nav-docs"]').click()
    cy.url().should('include', '/guide/introduction')
  })
})
``` 