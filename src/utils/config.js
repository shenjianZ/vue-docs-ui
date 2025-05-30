import yaml from 'js-yaml'

// 网站配置缓存
let siteConfig = null

// 加载配置文件
export async function loadConfig() {
  if (siteConfig) {
    return siteConfig
  }
  
  try {
    const configPath = '/config/site.yaml'
    console.log(`尝试加载配置文件: ${configPath}`)
    
    const response = await fetch(configPath)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const yamlText = await response.text()
    console.log('YAML文本长度:', yamlText.length)
    
    siteConfig = yaml.load(yamlText)
    
    if (!siteConfig) {
      throw new Error('YAML解析返回空值')
    }
    
    console.log('✅ 配置文件解析成功:', siteConfig)
    return siteConfig
    
  } catch (error) {
    console.error('❌ 配置加载失败，使用默认配置:', error)
    siteConfig = getDefaultConfig()
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

// 默认配置
function getDefaultConfig() {
  return {
    site: {
      title: "文档网站",
      description: "基于Vue的文档网站",
      logo: "📚",
      author: "Author"
    },
    navbar: {
      items: [
        { title: "首页", link: "/", active: true }
      ]
    },
    sidebar: {
      sections: [
        {
          title: "第一章 机器学习基础",
          path: "/chapter1",
          children: [
            { title: "1.1 人工智能的两只手和四条腿", path: "/chapter1/ai-basics" },
            { title: "1.2 机器学习是什么", path: "/chapter1/what-is-ml" },
            { title: "1.3 时代造就机器学习", path: "/chapter1/era-of-ml" }
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
      title: "目录"
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