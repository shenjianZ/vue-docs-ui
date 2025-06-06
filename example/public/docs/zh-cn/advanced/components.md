# 组件开发

Vue Docs UI 提供了强大的组件系统，您可以扩展现有组件或创建全新的组件来满足特定需求。

## 🧩 组件架构

Vue Docs UI 采用模块化组件架构：

- **核心组件** - 基础布局和功能组件
- **内容组件** - 文档内容渲染组件
- **UI 组件** - 通用界面组件
- **插件组件** - 可扩展的功能组件

## 📋 核心组件

### DocsLayout
主布局组件，负责整体页面结构：

```vue
<template>
  <div class="docs-layout">
    <HeaderNav />
    <div class="docs-body">
      <SidebarNav />
      <main class="docs-main">
        <Article />
      </main>
      <TableOfContents />
    </div>
  </div>
</template>
```

### HeaderNav
顶部导航栏组件：

```vue
<template>
  <header class="docs-header">
    <div class="docs-header-content">
      <div class="docs-logo">
        <img :src="config.site.logo" :alt="config.site.title">
        <span>{{ config.site.title }}</span>
      </div>
      <nav class="docs-nav">
        <router-link 
          v-for="item in config.navbar.items" 
          :key="item.link"
          :to="item.link"
          :class="{ external: item.external }"
        >
          {{ item.title }}
        </router-link>
      </nav>
      <div class="docs-actions">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>
```

### SidebarNav
侧边栏导航组件：

```vue
<template>
  <aside class="docs-sidebar">
    <nav class="docs-sidebar-nav">
      <div 
        v-for="section in config.sidebar.sections" 
        :key="section.title"
        class="docs-sidebar-section"
      >
        <h3>{{ section.title }}</h3>
        <ul>
          <li v-for="child in section.children" :key="child.path">
            <router-link :to="child.path">
              {{ child.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
```

## 🔧 自定义组件

### 创建自定义组件

```vue
<!-- CustomComponent.vue -->
<template>
  <div class="custom-component">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.custom-component {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>
```

### 注册自定义组件

```javascript
// main.ts
import { createDocsApp } from 'vue-docs-ui'
import CustomComponent from './components/CustomComponent.vue'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  components: {
    CustomComponent
  }
})
```

### 在 Markdown 中使用

```markdown
# 使用自定义组件

<CustomComponent 
  title="示例组件" 
  description="这是一个自定义组件的示例"
>
  这里是组件的内容
</CustomComponent>
```

## 🎨 样式自定义

### 组件样式覆盖

```css
/* 在 public/styles/custom.css 中 */

/* 覆盖头部样式 */
.docs-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 覆盖侧边栏样式 */
.docs-sidebar {
  background: var(--surface-color);
  border-right: 2px solid var(--primary-color);
}

/* 覆盖文章内容样式 */
.docs-article {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* 自定义代码块样式 */
.docs-code-block {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### CSS 变量自定义

```css
:root {
  /* 自定义组件间距 */
  --component-spacing: 1.5rem;
  
  /* 自定义组件圆角 */
  --component-border-radius: 0.5rem;
  
  /* 自定义组件阴影 */
  --component-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* 自定义动画时间 */
  --animation-duration: 0.3s;
}
```

## 🔌 插件开发

### 创建插件

```javascript
// plugins/analytics.js
export function createAnalyticsPlugin(options = {}) {
  return {
    name: 'analytics',
    install(app) {
      // 安装 Google Analytics
      if (options.googleAnalytics?.id) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${options.googleAnalytics.id}`
        document.head.appendChild(script)
        
        window.dataLayer = window.dataLayer || []
        function gtag(){dataLayer.push(arguments)}
        gtag('js', new Date())
        gtag('config', options.googleAnalytics.id)
        
        // 提供给组件使用
        app.config.globalProperties.$gtag = gtag
      }
    }
  }
}
```

### 使用插件

```javascript
// main.ts
import { createDocsApp } from 'vue-docs-ui'
import { createAnalyticsPlugin } from './plugins/analytics'

createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app',
  plugins: [
    createAnalyticsPlugin({
      googleAnalytics: {
        id: 'GA_MEASUREMENT_ID'
      }
    })
  ]
})
```

## 🎯 高级组件示例

### 代码演示组件

```vue
<!-- CodeDemo.vue -->
<template>
  <div class="code-demo">
    <div class="demo-preview">
      <component :is="demoComponent" v-if="demoComponent" />
    </div>
    <div class="demo-code" v-if="showCode">
      <pre><code v-html="highlightedCode"></code></pre>
    </div>
    <div class="demo-actions">
      <button @click="showCode = !showCode">
        {{ showCode ? '隐藏代码' : '显示代码' }}
      </button>
      <button @click="copyCode">复制代码</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { highlight } from 'prismjs'

const props = defineProps({
  code: String,
  component: Object
})

const showCode = ref(false)
const demoComponent = computed(() => props.component)

const highlightedCode = computed(() => {
  return highlight(props.code, Prism.languages.javascript, 'javascript')
})

const copyCode = () => {
  navigator.clipboard.writeText(props.code)
}
</script>
```

### API 文档组件

```vue
<!-- ApiDoc.vue -->
<template>
  <div class="api-doc">
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    
    <div class="api-props" v-if="props?.length">
      <h4>Properties</h4>
      <table>
        <thead>
          <tr>
            <th>属性名</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in props" :key="prop.name">
            <td><code>{{ prop.name }}</code></td>
            <td><code>{{ prop.type }}</code></td>
            <td><code>{{ prop.default || '-' }}</code></td>
            <td>{{ prop.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="api-events" v-if="events?.length">
      <h4>Events</h4>
      <table>
        <thead>
          <tr>
            <th>事件名</th>
            <th>参数</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.name">
            <td><code>{{ event.name }}</code></td>
            <td><code>{{ event.params || '-' }}</code></td>
            <td>{{ event.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  props: Array,
  events: Array
})
</script>
```

## 🔄 组件通信

### 使用 provide/inject

```javascript
// 在父组件中提供数据
import { provide } from 'vue'

export default {
  setup() {
    const theme = ref('light')
    const config = ref({})
    
    provide('theme', theme)
    provide('config', config)
    
    return { theme, config }
  }
}

// 在子组件中注入数据
import { inject } from 'vue'

export default {
  setup() {
    const theme = inject('theme')
    const config = inject('config')
    
    return { theme, config }
  }
}
```

### 使用事件总线

```javascript
// eventBus.js
import { createApp } from 'vue'

export const eventBus = createApp({}).config.globalProperties

// 发送事件
eventBus.$emit('theme-changed', 'dark')

// 监听事件
eventBus.$on('theme-changed', (theme) => {
  console.log('Theme changed to:', theme)
})
```

## 📱 响应式组件

### 移动端适配

```vue
<template>
  <div class="responsive-component" :class="{ mobile: isMobile }">
    <div v-if="isMobile" class="mobile-layout">
      <!-- 移动端布局 -->
    </div>
    <div v-else class="desktop-layout">
      <!-- 桌面端布局 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.responsive-component {
  transition: all 0.3s ease;
}

.mobile-layout {
  padding: 1rem;
}

.desktop-layout {
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .desktop-layout {
    display: block;
    padding: 1rem;
  }
}
</style>
```

## 🧪 测试组件

### 单元测试

```javascript
// CustomComponent.test.js
import { mount } from '@vue/test-utils'
import CustomComponent from '@/components/CustomComponent.vue'

describe('CustomComponent', () => {
  it('renders title correctly', () => {
    const wrapper = mount(CustomComponent, {
      props: {
        title: 'Test Title'
      }
    })
    
    expect(wrapper.find('h3').text()).toBe('Test Title')
  })
  
  it('renders slot content', () => {
    const wrapper = mount(CustomComponent, {
      props: {
        title: 'Test Title'
      },
      slots: {
        default: '<p>Slot content</p>'
      }
    })
    
    expect(wrapper.html()).toContain('<p>Slot content</p>')
  })
})
```

### 可视化测试

```javascript
// CustomComponent.stories.js
export default {
  title: 'Components/CustomComponent',
  component: CustomComponent
}

export const Default = {
  args: {
    title: 'Default Title',
    description: 'Default description'
  }
}

export const WithLongContent = {
  args: {
    title: 'Long Content Example',
    description: 'This is a very long description...'
  }
}
```

## 🚀 性能优化

### 懒加载组件

```javascript
// 异步加载大型组件
const HeavyComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
)

// 带加载状态的异步组件
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/AsyncComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### 组件缓存

```vue
<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTab = ref('tab1')

const currentComponent = computed(() => {
  return currentTab.value === 'tab1' ? Tab1Component : Tab2Component
})
</script>
```

## 📚 组件库

### 构建组件库

```javascript
// index.ts
import type { App } from 'vue'
import CustomComponent from './components/CustomComponent.vue'
import ApiDoc from './components/ApiDoc.vue'
import CodeDemo from './components/CodeDemo.vue'

const components = {
  CustomComponent,
  ApiDoc,
  CodeDemo
}

export default {
  install(app: App) {
    Object.keys(components).forEach(key => {
      app.component(key, components[key])
    })
  }
}

export {
  CustomComponent,
  ApiDoc,
  CodeDemo
}
```

### 发布组件库

```json
{
  "name": "my-docs-components",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  }
}
```

## 📖 最佳实践

### 1. 组件设计原则

- **单一职责** - 每个组件只负责一个功能
- **可复用性** - 设计通用的、可配置的组件
- **可组合性** - 组件可以轻松组合使用
- **性能优化** - 避免不必要的重渲染

### 2. 命名规范

```javascript
// 组件名使用 PascalCase
CustomButton.vue
UserProfile.vue
DocumentViewer.vue

// 组件实例使用 camelCase
const customButton = ref()
const userProfile = ref()
const documentViewer = ref()
```

### 3. Props 验证

```javascript
const props = defineProps({
  title: {
    type: String,
    required: true,
    validator: (value) => value.length > 0
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
```

## 📚 下一步

- 查看 [API 参考](/advanced/api) 了解完整的组件 API
- 阅读 [部署](/advanced/deployment) 学习如何部署自定义组件
- 探索现有组件的[源代码](https://github.com/shenjianZ/vue-docs-ui/tree/main/src/components) 