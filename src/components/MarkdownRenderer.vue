<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed, watch, inject } from 'vue'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import prism from 'markdown-it-prism'
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
  .use(prism, {
    plugins: []
  })

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
  }

  ul, ol {
    padding-left: 2rem;
    margin: 16px 0;

    li {
      margin: 4px 0;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 16px 0;
  }

  hr {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 24px 0;
  }
}
</style> 