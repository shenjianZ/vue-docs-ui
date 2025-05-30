<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed, watch, inject } from 'vue'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import { parseMarkdownHeaders, getDefaultTocConfig } from '../utils'
import type { DocsConfig } from '../types'

interface Props {
  content: string
  enableToc?: boolean
  tocDepth?: number
}

const props = withDefaults(defineProps<Props>(), {
  enableToc: true
})

const emit = defineEmits<{
  tocGenerated: [headers: any[]]
}>()

// 获取配置
const config = inject<DocsConfig>('docsConfig')
const tocConfig = getDefaultTocConfig(config)

// 配置Markdown解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(anchor, {
    permalink: anchor.permalink.linkInsideHeader({
      symbol: '#',
      renderAttrs: () => ({ 'aria-hidden': 'true' }),
    })
  })

// 自定义代码块渲染器
const defaultFenceRenderer = md.renderer.rules.fence || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const info = token.info ? token.info.trim() : ''
  const langName = info ? info.split(/\s+/g)[0] : ''
  
  if (langName) {
    // 添加语言标识和代码块包装
    const langLabel = `<div class="code-lang">${langName}</div>`
    const codeBlock = defaultFenceRenderer(tokens, idx, options, env, renderer)
    return `<div class="code-block-wrapper">${langLabel}${codeBlock}</div>`
  }
  
  return defaultFenceRenderer(tokens, idx, options, env, renderer)
}

const renderedContent = computed(() => {
  return md.render(props.content)
})

// 监听内容变化，自动生成目录
watch(() => props.content, (newContent) => {
  if (props.enableToc && tocConfig.enabled && newContent) {
    const depth = props.tocDepth || tocConfig.depth
    const headers = parseMarkdownHeaders(newContent, depth)
    emit('tocGenerated', headers)
  }
}, { immediate: true })
</script>

<style lang="scss">
.markdown-body {
  line-height: 1.6;
  font-size: 16px;
  color: var(--text-color);

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    color: var(--heading-color);
    position: relative;
    
    &:first-child {
      margin-top: 0;
    }

    // 标题锚点样式
    .header-anchor {
      position: absolute;
      left: -1.5em;
      opacity: 0;
      font-weight: 400;
      color: var(--text-color-light);
      transition: opacity 0.2s;
      text-decoration: none;
      
      &:hover {
        text-decoration: none;
        color: var(--primary-color);
      }
    }

    &:hover .header-anchor {
      opacity: 1;
    }
  }

  h1 {
    font-size: 2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.3rem;
  }

  h2 {
    font-size: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.3rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4 {
    font-size: 1.1rem;
  }

  h5 {
    font-size: 1rem;
    font-weight: 600;
  }

  h6 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color-light);
  }

  p {
    margin-bottom: 16px;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: var(--code-bg-color);
    color: var(--code-text-color);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.875em;
    font-family: var(--font-family-mono);
  }

  // 代码块包装器
  .code-block-wrapper {
    position: relative;
    margin: 16px 0;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--border-color);

    .code-lang {
      background: var(--bg-color-secondary);
      color: var(--text-color-light);
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--border-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    pre {
      margin: 0;
      border-radius: 0;
      border: none;
    }
  }

  pre {
    background-color: var(--code-bg-color);
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    margin: 16px 0;
    border: 1px solid var(--border-color);

    code {
      background: none;
      padding: 0;
      font-size: 0.875em;
      color: var(--code-text-color);
    }
  }

  blockquote {
    padding: 0 1rem;
    color: var(--text-color-light);
    border-left: 4px solid var(--border-color);
    margin: 16px 0;
    font-style: italic;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;

    th, td {
      border: 1px solid var(--border-color);
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: var(--bg-color-secondary);
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: var(--bg-color-secondary);
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px auto;
    border-radius: var(--border-radius);
  }

  hr {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 24px 0;
  }

  ul, ol {
    padding-left: 1.5rem;
    margin: 16px 0;

    li {
      margin: 4px 0;
    }

    ul, ol {
      margin: 4px 0;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    font-size: 14px;
    
    h1 {
      font-size: 1.75rem;
    }
    
    h2 {
      font-size: 1.375rem;
    }
    
    .code-block-wrapper .code-lang {
      font-size: 0.7rem;
      padding: 0.4rem 0.8rem;
    }
    
    pre {
      padding: 12px;
      font-size: 0.8rem;
    }
  }
}
</style> 