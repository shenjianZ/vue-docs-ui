# Basic Usage Examples

This page demonstrates basic features and usage patterns of Vue Docs UI.

## Simple Documentation Page

Here's how to create a basic documentation page:

```markdown
# Page Title

This is a simple paragraph with **bold** and *italic* text.

## Section Header

### Subsection

Content under subsection...
```

## Code Examples

### JavaScript
```javascript
// Simple function example
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Usage
const items = [
  { name: 'Book', price: 15.99 },
  { name: 'Pen', price: 2.50 }
]
console.log(calculateTotal(items)) // 18.49
```

### Vue Component
```vue
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="sendMessage">Send Message</button>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  avatar: string
}

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  message: [userId: number]
}>()

function sendMessage() {
  emit('message', props.user.id)
}
</script>

<style scoped>
.user-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  text-align: center;
}

.user-card img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}
</style>
```

### CSS
```css
/* Modern button styles */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}
```

## Lists and Tables

### Unordered List
- Feature 1: Easy to use
- Feature 2: Highly customizable
- Feature 3: Mobile responsive
- Feature 4: SEO optimized

### Ordered List
1. Install Vue Docs UI
2. Configure your site
3. Write your content
4. Deploy your site

### Task List
- [x] Set up project structure
- [x] Configure basic settings
- [ ] Write documentation content
- [ ] Add custom styling
- [ ] Deploy to production

### Table Example
| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Basic themes | ✅ | ✅ | ✅ |
| Custom themes | ❌ | ✅ | ✅ |
| Priority support | ❌ | ❌ | ✅ |
| Team collaboration | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |

## Alerts and Callouts

> **Note**: This is a simple blockquote for general information.

> **Warning**: Be careful when modifying configuration files. Always backup your data first.

> **Tip**: Use the search functionality to quickly find what you're looking for!

## Links and References

### Internal Links
- [Introduction](/guide/introduction)
- [Installation Guide](/guide/installation)
- [Quick Start](/guide/quick-start)

### External Links
- [Vue.js Official Documentation](https://vuejs.org/)
- [Vite Build Tool](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Images

You can add images to your documentation:

```markdown
![Vue Logo](https://vuejs.org/images/logo.png)
```

Or with custom sizing:

```html
<img src="/images/screenshot.png" alt="Screenshot" width="500" />
```

## Horizontal Rule

Use three dashes to create a horizontal line:

---

Content after the horizontal rule.

## Inline Code

You can use `inline code` to highlight small code snippets, variables like `userName`, or file names like `package.json`.

## Escape Characters

To show literal markdown characters, use backslashes:

\*This won't be italic\*
\[This won't be a link\]

## HTML Support

Vue Docs UI supports HTML within Markdown:

<div style="background: #f0f9ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0ea5e9;">
  <strong>Custom HTML Block</strong><br>
  You can use HTML for more advanced formatting when needed.
</div>

## Next Steps

Ready for more advanced features? Check out:

- [Advanced Examples](/examples/advanced) - Complex layouts and components
- [Customization Guide](/advanced/customization) - Theming and styling
- [Deployment](/advanced/deployment) - Publishing your site 