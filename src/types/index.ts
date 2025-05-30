export interface NavItem {
  text: string
  link?: string
  children?: NavItem[]
  external?: boolean
}

export interface SidebarSection {
  text: string
  link?: string
  children?: SidebarSection[]
  collapsed?: boolean
}

export interface ThemeConfig {
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  borderRadius?: string
}

export interface DocsConfig {
  site: {
    title: string
    description?: string
    logo?: string
    favicon?: string
  }
  nav: NavItem[]
  sidebar: SidebarSection[]
  theme?: ThemeConfig
  toc?: {
    depth?: number  // 目录深度，默认2
    enabled?: boolean  // 是否启用，默认true
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