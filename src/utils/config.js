import yaml from 'js-yaml'
import { loadAIConfig, getAIConfig } from '../config/ai.js'

// 网站配置缓存
let siteConfig = null
let currentLanguage = null

// 重置配置缓存（语言切换时使用）
export function resetConfig() {
  siteConfig = null
  currentLanguage = null
}

// 获取当前语言
function getCurrentLanguage() {
  // 优先从localStorage获取
  const saved = localStorage.getItem('language')
  if (saved) {
    return saved
  }
  
  // 检查浏览器语言
  const browserLang = navigator.language || navigator.userLanguage
  return browserLang.startsWith('zh') ? 'zh' : 'en'
}

// 加载配置文件
export async function loadConfig(forceLang = null) {
  const targetLang = forceLang || getCurrentLanguage()
  
  // 如果语言改变了，重置缓存
  if (currentLanguage && currentLanguage !== targetLang) {
    resetConfig()
  }
  
  currentLanguage = targetLang
  
  if (siteConfig) {
    return siteConfig
  }
  
  try {
    // 根据语言选择配置文件
    const configPath = targetLang === 'en' ? '/config/site.en.yaml' : '/config/site.yaml'
    
    const response = await fetch(configPath)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const yamlText = await response.text()
    siteConfig = yaml.load(yamlText)
    
    if (!siteConfig) {
      throw new Error('YAML解析返回空值')
    }
    
    // 自动应用主题配置
    applyThemeFromConfig(siteConfig)
    
    return siteConfig
    
  } catch (error) {
    console.error('配置加载失败，使用默认配置:', error)
    siteConfig = getDefaultConfig(targetLang)
    
    // 自动应用默认主题配置
    applyThemeFromConfig(siteConfig)
    
    return siteConfig
  }
}

// 获取网站基本信息
export function getSiteInfo() {
  return siteConfig?.site || {}
}

// 获取导航栏配置
export function getNavbarConfig() {
  return siteConfig?.navbar || {}
}

// 获取侧边栏配置
export function getSidebarConfig() {
  return siteConfig?.sidebar || {}
}

// 获取主题配置
export function getThemeConfig() {
  return siteConfig?.theme || {}
}

// 获取目录配置
export function getTocConfig() {
  return siteConfig?.toc || {
    maxLevel: 2,
    enabled: true,
    title: "目录"
  }
}

// 获取页脚配置
export function getFooterConfig() {
  if (!siteConfig) {
    console.warn('⚠️ siteConfig未加载，返回默认footer配置')
    return {
      enabled: true,
      copyright: "© 2024 Documentation Site. All rights reserved.",
      links: [],
      social: [],
      repository: {
        url: "https://github.com/shenjianZ/vue-docs-ui",
        branch: "master"
      }
    }
  }
  
  const footerConfig = siteConfig.footer || {
    enabled: true,
    copyright: "© 2024 Documentation Site. All rights reserved.",
    links: [],
    social: [],
    repository: {
      url: "https://github.com/shenjianZ/vue-docs-ui",
      branch: "master"
    }
  }
  
  // 确保 repository 配置存在
  if (!footerConfig.repository) {
    footerConfig.repository = {
      url: "https://github.com/shenjianZ/vue-docs-ui",
      branch: "master"
    }
  }
  
  return footerConfig
}

// 获取AI配置
export function getAIConfiguration() {
  return getAIConfig()
}

// 加载所有配置（包括AI配置）
export async function loadAllConfigs() {
  await loadConfig()
  await loadAIConfig()
  return {
    site: siteConfig,
    ai: getAIConfig()
  }
}

// 重新加载配置（语言切换时使用）
export async function reloadConfig(newLang) {
  resetConfig()
  return await loadConfig(newLang)
}

// 从配置文件应用主题
export function applyThemeFromConfig(config) {
  const themeConfig = config?.theme || {}
  
  // 如果配置中没有设置主题，直接返回
  if (!themeConfig.theme && !themeConfig.defaultMode) {
    return
  }
  
  const body = document.body
  
  // 应用主题
  if (themeConfig.theme && themeConfig.theme !== 'default') {
    // 移除所有主题类
    body.classList.remove('theme-vue', 'theme-github', 'theme-purple', 'theme-orange', 'theme-emerald')
    // 添加指定主题
    body.classList.add(`theme-${themeConfig.theme}`)
    console.log(`✅ 已应用主题: ${themeConfig.theme}`)
  }
  
  // 应用深色模式设置
  if (themeConfig.defaultMode) {
    if (themeConfig.defaultMode === 'dark') {
      body.classList.add('dark')
      console.log('✅ 已启用深色模式')
    } else if (themeConfig.defaultMode === 'light') {
      body.classList.remove('dark')
      console.log('✅ 已启用浅色模式')
    } else if (themeConfig.defaultMode === 'auto') {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        body.classList.add('dark')
        console.log('✅ 已启用深色模式（系统偏好）')
      } else {
        body.classList.remove('dark')
        console.log('✅ 已启用浅色模式（系统偏好）')
      }
    }
  }
}

// 默认配置
function getDefaultConfig(lang = 'zh') {
  const isEn = lang === 'en'
  
  return {
    site: {
      title: isEn ? "Documentation Site" : "文档网站",
      description: isEn ? "Vue-based documentation site" : "基于Vue的文档网站",
      logo: "📚",
      author: "Author"
    },
    navbar: {
      items: [
        { title: isEn ? "Home" : "首页", link: "/", active: true }
      ]
    },
    sidebar: {
      sections: [
        {
          title: isEn ? "Chapter 1: Machine Learning Basics" : "第一章 机器学习基础",
          path: "/chapter1",
          children: [
            { title: isEn ? "1.1 The Two Hands and Four Legs of AI" : "1.1 人工智能的两只手和四条腿", path: "/chapter1/ai-basics" },
            { title: isEn ? "1.2 What is Machine Learning" : "1.2 机器学习是什么", path: "/chapter1/what-is-ml" },
            { title: isEn ? "1.3 The Era That Created Machine Learning" : "1.3 时代造就机器学习", path: "/chapter1/era-of-ml" }
          ]
        }
      ]
    },
    theme: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#06b6d4",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0"
      },
      fonts: {
        primary: "Inter, sans-serif",
        mono: "JetBrains Mono, monospace"
      }
    },
    toc: {
      maxLevel: 2,
      enabled: true,
      title: isEn ? "Table of Contents" : "目录"
    }
  }
}

// 根据路径查找侧边栏项目
export function findSidebarItem(path) {
  const sidebar = getSidebarConfig()
  const sections = sidebar.sections || []
  
  for (const section of sections) {
    if (section.path === path) {
      return section
    }
    
    if (section.children) {
      for (const child of section.children) {
        if (child.path === path) {
          return child
        }
      }
    }
  }
  
  return null
}

// 获取当前路径的导航面包屑
export function getBreadcrumb(path) {
  const sidebar = getSidebarConfig()
  const sections = sidebar.sections || []
  
  for (const section of sections) {
    if (section.path === path) {
      return [section]
    }
    
    if (section.children) {
      for (const child of section.children) {
        if (child.path === path) {
          return [section, child]
        }
      }
    }
  }
  
  return []
}

// 更新页面meta信息
export function updatePageMeta(siteInfo) {
  if (!siteInfo) return
  
  // 更新页面title
  if (siteInfo.title) {
    document.title = siteInfo.title
    const titleElement = document.getElementById('page-title')
    if (titleElement) {
      titleElement.textContent = siteInfo.title
    }
  }
  
  // 更新页面description
  if (siteInfo.description) {
    // 查找现有的description meta标签
    let descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', siteInfo.description)
    } else {
      // 如果不存在，创建一个新的description meta标签
      descriptionMeta = document.createElement('meta')
      descriptionMeta.setAttribute('name', 'description')
      descriptionMeta.setAttribute('content', siteInfo.description)
      document.head.appendChild(descriptionMeta)
    }
  }
} 