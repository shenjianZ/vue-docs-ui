# Contributing to Vue Docs UI

Thank you for your interest in contributing to Vue Docs UI! We welcome all kinds of contributions including:

- 🐛 Bug reports and fixes
- 💡 Feature suggestions and implementations
- 📖 Documentation improvements
- 🧪 Test cases
- 🎨 UI/UX improvements
- 🌍 Internationalization support

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 16.0+ (LTS version recommended)
- **npm**: 7.0+ or **yarn**: 1.22+ or **pnpm**: 6.0+
- **Git**: 2.20+

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork https://github.com/shenjianZ/vue-docs-ui on GitHub
   # Then clone your fork
   git clone https://github.com/your-username/vue-docs-ui.git
   cd vue-docs-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run example project**
   ```bash
   cd example
   npm install
   npm run dev
   ```

## 📝 Contribution Types

### Bug Reports

Found a bug? Help us improve!

**Before submitting a bug report, please:**
- [ ] Search existing [Issues](https://github.com/shenjianZ/vue-docs-ui/issues)
- [ ] Test with the latest version
- [ ] Provide a minimal reproduction example

**Bug reports should include:**
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment information (Vue version, browser, OS, etc.)
- Error screenshots or logs (if any)

### Feature Requests

Have a great idea? We'd love to hear it!

**Feature requests should include:**
- Detailed description of the feature
- Use cases and scenarios
- Possible API design
- Whether you're willing to implement it

### Code Contributions

#### Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Write code**
   - Follow existing code style
   - Add necessary tests
   - Update related documentation

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

#### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Build/tool changes

**Examples:**
```
feat(components): add table of contents auto-scroll
fix(router): resolve navigation highlighting issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Type checking
npm run type-check

# Build testing
npm run build:lib

# Test in different environments
npm run preview
```

### Adding Tests

We encourage adding test cases for new features:

```bash
# Create component tests
touch src/components/__tests__/YourComponent.spec.ts

# Create utility function tests
touch src/utils/__tests__/yourUtility.spec.ts
```

## 📖 Documentation

### Documentation Types

- **README**: Project introduction and quick start
- **API Documentation**: Detailed component and function descriptions
- **Guides**: Tutorials and best practices
- **Examples**: Real-world usage scenarios

### Documentation Standards

- Use clear and concise language
- Provide code examples
- Keep English and Chinese versions in sync
- Add appropriate screenshots or diagrams

## 🎨 Code Standards

### TypeScript

- Use TypeScript for development
- Export type definitions for all public APIs
- Avoid using `any` type

### Vue Components

```vue
<template>
  <!-- Use semantic HTML structure -->
  <div class="docs-component" :class="componentClasses">
    <!-- Content -->
  </div>
</template>

<script setup lang="ts">
// Import types
import type { ComponentProps } from '@/types'

// Define props
interface Props {
  title: string
  variant?: 'primary' | 'secondary'
}

// Use defineProps and withDefaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

// Computed properties
const componentClasses = computed(() => ({
  [`docs-component--${props.variant}`]: true
}))
</script>

<style scoped>
/* Use CSS custom properties */
.docs-component {
  --docs-component-bg: var(--color-background);
  background: var(--docs-component-bg);
}
</style>
```

### CSS/Styling

- Use CSS custom properties (CSS Variables)
- Follow BEM naming convention
- Support dark/light themes
- Ensure accessibility (a11y)

## 🌍 Internationalization

We support multiple languages:

```bash
# Add new language
cp README.md README-{language-code}.md
cp CONTRIBUTING.md CONTRIBUTING-{language-code}.md
```

Currently supported:
- 🇺🇸 English (`en`)
- 🇨🇳 Chinese (`zh`)

## 🔄 Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Steps

1. Update `CHANGELOG.md`
2. Run `npm version [patch|minor|major]`
3. Push tags: `git push origin master --tags`
4. Create GitHub Release
5. Publish to NPM: `npm publish`

## 📞 Getting Help

Need assistance? We're here to help!

- 💬 [GitHub Discussions](https://github.com/shenjianZ/vue-docs-ui/discussions) - Questions and discussions
- 🐛 [Issues](https://github.com/shenjianZ/vue-docs-ui/issues) - Bug reports and feature requests
- 📧 Email: [contact@vuedocsui.com](mailto:contact@vuedocsui.com)

## 👥 Community

- 🌟 Star the project to support us
- 🐦 Follow [@VueDocsUI](https://twitter.com/VueDocsUI)
- 💼 [LinkedIn](https://linkedin.com/company/vue-docs-ui)

## 📜 Code of Conduct

### Our Pledge

To foster an open and welcoming environment, we pledge to:

- Use inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

The following behaviors are considered unacceptable:

- Use of sexualized language or imagery
- Personal attacks or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

## 🎉 Recognition

Thanks to all contributors who help make Vue Docs UI better!

[![Contributors](https://contrib.rocks/image?repo=shenjianZ/vue-docs-ui)](https://github.com/shenjianZ/vue-docs-ui/graphs/contributors)

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Thank you for contributing! 🙏** 