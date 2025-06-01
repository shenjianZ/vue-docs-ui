import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
// 暂时注释掉Prism相关导入
// import markdownItPrism from 'markdown-it-prism'
// import 'prismjs/themes/prism.css'
// 导入常用的语言支持
// import 'prismjs/components/prism-javascript'
// import 'prismjs/components/prism-typescript'
// import 'prismjs/components/prism-python'
// import 'prismjs/components/prism-json'
// import 'prismjs/components/prism-yaml'
// import 'prismjs/components/prism-bash'
// import 'prismjs/components/prism-css'
// import 'prismjs/components/prism-scss'
// import 'prismjs/components/prism-markdown'
// import 'prismjs/components/prism-sql'

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
})

// 自定义锚点生成函数
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 保留中文、英文、数字和短横线
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
}

// 添加锚点插件
md.use(markdownItAnchor, {
  slugify,
  permalink: markdownItAnchor.permalink.headerLink({
    symbol: '#',
    renderAttrs: () => ({ 'aria-hidden': 'true' }),
  })
})

// 暂时禁用Prism插件
// md.use(markdownItPrism)

// 简化的自定义代码块渲染器
const defaultRender = md.renderer.rules.fence || function(tokens, idx, options, env, renderer) {
  return renderer.renderToken(tokens, idx, options)
}

md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx]
  const info = token.info ? token.info.trim() : ''
  const langName = info ? info.split(/\s+/g)[0] : ''
  
  if (langName) {
    // 添加语言标识
    const langLabel = `<div class="code-lang">${langName}</div>`
    const codeBlock = defaultRender(tokens, idx, options, env, renderer)
    return `<div class="code-block-wrapper">${langLabel}${codeBlock}</div>`
  }
  
  return defaultRender(tokens, idx, options, env, renderer)
}

/**
 * 从markdown文件加载内容
 * @param {string} filePath - markdown文件路径
 * @returns {Promise<string>} 解析后的HTML内容
 */
export async function loadMarkdownFile(filePath) {
  try {
    // 动态导入markdown文件
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${filePath}`)
    }
    const markdownContent = await response.text()
    return md.render(markdownContent)
  } catch (error) {
    console.error('Error loading markdown file:', error)
    return `<p>无法加载文档内容: ${filePath}</p>`
  }
}

/**
 * 解析markdown内容为HTML
 * @param {string} markdownContent - markdown内容字符串
 * @returns {string} 解析后的HTML内容
 */
export function parseMarkdown(markdownContent) {
  return md.render(markdownContent)
}

/**
 * 从HTML内容中提取标题结构
 * @param {string} htmlContent - HTML内容
 * @returns {Array} 标题结构数组
 */
export function extractTOCFromHTML(htmlContent) {
  // 创建临时DOM元素来解析HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  
  const headers = []
  const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  // 构建扁平的标题列表
  const flatHeaders = []
  headingElements.forEach((element, index) => {
    const level = parseInt(element.tagName.substring(1))
    const text = element.textContent?.trim() || ''
    let anchor = element.id
    
    // 如果没有ID，生成一个
    if (!anchor) {
      // 生成基于文本的anchor
      anchor = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 保留中文字符
        .replace(/^-|-$/g, '') // 移除开头和结尾的破折号
      
      // 如果anchor为空，使用索引
      if (!anchor) {
        anchor = `heading-${index}`
      }
      
      element.id = anchor
    }
    
    flatHeaders.push({
      level,
      text,
      anchor,
      children: []
    })
  })
  
  // 构建层级结构
  const result = []
  const stack = [] // 用于跟踪父级标题的栈
  
  flatHeaders.forEach(header => {
    // 找到合适的父级位置
    while (stack.length > 0 && stack[stack.length - 1].level >= header.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      // 顶级标题
      result.push(header)
    } else {
      // 子级标题
      stack[stack.length - 1].children.push(header)
    }
    
    stack.push(header)
  })
  
  return result
}

/**
 * 生成标题的锚点ID
 * @param {string} text - 标题文本
 * @param {number} index - 标题索引（用于去重）
 * @returns {string} 锚点ID
 */
export function generateAnchor(text, index = 0) {
  let anchor = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 保留中文字符
    .replace(/^-|-$/g, '') // 移除开头和结尾的破折号
  
  // 如果anchor为空，使用索引
  if (!anchor) {
    anchor = `heading-${index}`
  }
  
  return anchor
}

/**
 * 根据章节和文章获取markdown文件路径
 * @param {string} chapter - 章节名
 * @param {string} article - 文章名
 * @param {string} lang - 语言代码 (zh-cn 或 en)
 * @returns {string} markdown文件路径
 */
export function getMarkdownPath(chapter, article, lang = null) {
  // 获取当前语言
  const currentLang = lang || getCurrentLanguage()
  const langFolder = currentLang === 'en' ? 'en' : 'zh-cn'
  
  return `/docs/${langFolder}/${chapter}/${article}.md`
}

/**
 * 获取当前语言
 * @returns {string} 语言代码
 */
function getCurrentLanguage() {
  // 优先从localStorage获取
  const saved = localStorage.getItem('language') || localStorage.getItem('vue-docs-locale')
  if (saved) {
    return saved
  }
  
  // 检查浏览器语言
  const browserLang = navigator.language || navigator.userLanguage
  return browserLang.startsWith('zh') ? 'zh' : 'en'
}

/**
 * 根据最大层级过滤目录结构
 * @param {Array} headers - 完整的标题结构数组
 * @param {number} maxLevel - 最大显示层级 (1-6)
 * @returns {Array} 过滤后的标题结构数组
 */
export function filterTOCByLevel(headers, maxLevel = 2) {
  if (!Array.isArray(headers) || maxLevel < 1) {
    return []
  }
  
  const filterRecursive = (items) => {
    return items.filter(item => item.level <= maxLevel).map(item => ({
      ...item,
      children: item.children ? filterRecursive(item.children) : []
    }))
  }
  
  return filterRecursive(headers)
} 