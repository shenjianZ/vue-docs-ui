export interface NavItem {
  text?: string
  title?: string  // 新格式
  link?: string
  path?: string   // 新格式
  children?: NavItem[]
  external?: boolean
  active?: boolean
}

export interface SidebarSection {
  text?: string
  title?: string  // 新格式
  link?: string 
  path?: string   // 新格式
  children?: SidebarSection[]
  collapsed?: boolean
}

export interface ThemeConfig {
  // 主题选择
  theme?: 'default' | 'vue' | 'github' | 'purple' | 'orange' | 'emerald'
  
  // 默认主题模式
  defaultMode?: 'light' | 'dark' | 'auto'
  
  // 是否允许用户切换主题
  allowToggle?: boolean
  
  // 是否显示主题切换器
  showThemeSwitcher?: boolean
  
  // 兼容旧格式
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  borderRadius?: string
  
  // 新格式支持
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    surface?: string
    text?: string
    textSecondary?: string
    border?: string
  }
  fonts?: {
    primary?: string
    mono?: string
  }
}

// 支持两种配置格式
export interface DocsConfig {
  site: {
    title: string
    description?: string
    logo?: string
    favicon?: string
    author?: string
  }
  
  // 旧格式
  nav?: NavItem[]
  sidebar?: SidebarSection[] | { sections: SidebarSection[] }
  
  // 新格式
  navbar?: {
    items: NavItem[]
  }
  
  theme?: ThemeConfig
  toc?: {
    depth?: number      // 旧格式
    maxLevel?: number   // 新格式
    enabled?: boolean
    title?: string      // 新格式
  }
  footer?: {
    text?: string
    links?: NavItem[]
  }
}

export interface MarkdownPage {
  title: string
  content: string
  path: string
  toc?: TocItem[]
}

export interface TocItem {
  text: string
  anchor: string
  level: number
  children?: TocItem[]
} 