import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { DocsConfig, SidebarSection, TocItem, NavItem } from '../types'

// 简单的YAML解析器 - 专门处理我们的配置格式
function parseSimpleYaml(yamlText: string): any {
  const lines = yamlText.split('\n')
  const result: any = {}
  
  let i = 0
  
  function parseValue(value: string): any {
    const trimmed = value.trim()
    if (trimmed === 'true') return true
    if (trimmed === 'false') return false
    if (/^\d+$/.test(trimmed)) return parseInt(trimmed)
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1)
    }
    return trimmed
  }
  
  function parseObject(startIndent: number): any {
    const obj: any = {}
    
    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()
      
      if (!trimmed || trimmed.startsWith('#')) {
        i++
        continue
      }
      
      const indent = line.length - line.trimStart().length
      
      // 如果缩进小于起始缩进，说明这个对象结束了
      if (indent < startIndent) {
        break
      }
      
      // 如果缩进等于起始缩进，处理键值对
      if (indent === startIndent && trimmed.includes(':')) {
        const colonIndex = trimmed.indexOf(':')
        const key = trimmed.substring(0, colonIndex).trim()
        const value = trimmed.substring(colonIndex + 1).trim()
        
        if (!value) {
          // 空值，检查下一行是否是数组或对象
          i++
          if (i < lines.length) {
            const nextLine = lines[i]
            const nextTrimmed = nextLine.trim()
            const nextIndent = nextLine.length - nextLine.trimStart().length
            
            if (nextIndent > indent && nextTrimmed.startsWith('- ')) {
              // 下一行是数组
              obj[key] = parseArray(nextIndent)
            } else if (nextIndent > indent) {
              // 下一行是对象
              obj[key] = parseObject(nextIndent)
            } else {
              obj[key] = {}
            }
          } else {
            obj[key] = {}
          }
        } else {
          const parsedValue = parseValue(value)
          obj[key] = parsedValue
          i++
        }
      } else {
        i++
      }
    }
    
    return obj
  }
  
  function parseArray(startIndent: number): any[] {
    const arr: any[] = []
    
    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()
      
      if (!trimmed || trimmed.startsWith('#')) {
        i++
        continue
      }
      
      const indent = line.length - line.trimStart().length
      
      // 如果缩进小于起始缩进，说明数组结束了
      if (indent < startIndent) {
        break
      }
      
      // 如果是数组项
      if (indent === startIndent && trimmed.startsWith('- ')) {
        const itemValue = trimmed.substring(2).trim()
        
        if (itemValue.includes(':')) {
          // 数组项是对象，从第一个键值对开始
          const colonIndex = itemValue.indexOf(':')
          const key = itemValue.substring(0, colonIndex).trim()
          const value = itemValue.substring(colonIndex + 1).trim()
          
          const itemObj: any = {}
          
          // 处理第一个键值对
          if (!value) {
            // 空值，检查下一行
            i++
            if (i < lines.length) {
              const nextLine = lines[i]
              const nextIndent = nextLine.length - nextLine.trimStart().length
              
              if (nextIndent > indent) {
                itemObj[key] = parseObject(nextIndent)
              } else {
                itemObj[key] = {}
              }
            } else {
              itemObj[key] = {}
            }
          } else {
            itemObj[key] = parseValue(value)
            i++
          }
          
          // 继续读取同一数组项的其他键值对
          while (i < lines.length) {
            const nextLine = lines[i]
            const nextTrimmed = nextLine.trim()
            
            if (!nextTrimmed || nextTrimmed.startsWith('#')) {
              i++
              continue
            }
            
            const nextIndent = nextLine.length - nextLine.trimStart().length
            
            // 如果缩进小于数组项缩进，说明这个数组项结束了
            if (nextIndent <= startIndent) {
              break
            }
            
            // 如果是同级的键值对
            if (nextIndent === startIndent + 2 && nextTrimmed.includes(':')) {
              const nextColonIndex = nextTrimmed.indexOf(':')
              const nextKey = nextTrimmed.substring(0, nextColonIndex).trim()
              const nextValue = nextTrimmed.substring(nextColonIndex + 1).trim()
              
              if (!nextValue) {
                // 空值，检查下一行
                i++
                if (i < lines.length) {
                  const followLine = lines[i]
                  const followIndent = followLine.length - followLine.trimStart().length
                  
                  if (followIndent > nextIndent) {
                    if (followLine.trim().startsWith('- ')) {
                      itemObj[nextKey] = parseArray(followIndent)
                    } else {
                      itemObj[nextKey] = parseObject(followIndent)
                    }
                  } else {
                    itemObj[nextKey] = {}
                  }
                } else {
                  itemObj[nextKey] = {}
                }
              } else {
                itemObj[nextKey] = parseValue(nextValue)
                i++
              }
            } else {
              break
            }
          }
          
          arr.push(itemObj)
        } else {
          // 简单数组项
          arr.push(parseValue(itemValue))
          i++
        }
      } else {
        i++
      }
    }
    
    return arr
  }
  
  // 开始解析
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    
    if (!trimmed || trimmed.startsWith('#')) {
      i++
      continue
    }
    
    const indent = line.length - line.trimStart().length
    
    if (indent === 0 && trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      if (!value) {
        // 空值，检查下一行
        i++
        if (i < lines.length) {
          const nextLine = lines[i]
          const nextTrimmed = nextLine.trim()
          const nextIndent = nextLine.length - nextLine.trimStart().length
          
          if (nextIndent > 0 && nextTrimmed.startsWith('- ')) {
            // 下一行是数组
            result[key] = parseArray(nextIndent)
          } else if (nextIndent > 0) {
            // 下一行是对象
            result[key] = parseObject(nextIndent)
          } else {
            result[key] = {}
          }
        } else {
          result[key] = {}
        }
      } else {
        result[key] = parseValue(value)
        i++
      }
    } else {
      i++
    }
  }
  
  return result
}

// 加载YAML配置
export async function loadConfig(configPath: string): Promise<DocsConfig> {
  try {
    const response = await fetch(configPath)
    const yamlText = await response.text()
    const config = parseSimpleYaml(yamlText) as DocsConfig
    return config
  } catch (error) {
    console.error('Failed to load config:', error)
    throw error
  }
}

// 标准化NavItem - 兼容两种格式
function normalizeNavItem(item: any): NavItem {
  return {
    text: item.text || item.title,
    title: item.title || item.text,
    link: item.link || item.path,
    path: item.path || item.link,
    children: item.children?.map(normalizeNavItem),
    external: item.external,
    active: item.active
  }
}

// 标准化SidebarSection - 兼容两种格式
function normalizeSidebarSection(section: any): SidebarSection {
  const normalized = {
    text: section.text || section.title,
    title: section.title || section.text,
    link: section.link || section.path,
    path: section.path || section.link,
    children: section.children?.map(normalizeSidebarSection),
    collapsed: section.collapsed
  }
  return normalized
}

// 获取标准化的侧边栏配置
export function getNormalizedSidebar(config: DocsConfig): SidebarSection[] {
  let sidebar: any[] = []
  
  if (config.sidebar) {
    if (Array.isArray(config.sidebar)) {
      sidebar = config.sidebar
    } else if (config.sidebar.sections) {
      sidebar = config.sidebar.sections
    }
  }
  
  return sidebar.map(normalizeSidebarSection)
}

// 获取标准化的导航配置
export function getNormalizedNavbar(config: DocsConfig): NavItem[] {
  let nav: any[] = []
  
  if (config.navbar?.items) {
    nav = config.navbar.items
  } else if (config.nav) {
    nav = config.nav
  }
  
  return nav.map(normalizeNavItem)
}

// 从侧边栏配置生成路由
export function generateRoutesFromSidebar(sidebar: SidebarSection[] | { sections: SidebarSection[] } | any, articleComponent?: any): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  
  // 获取标准化的sidebar数组
  let normalizedSidebar: SidebarSection[] = []
  if (Array.isArray(sidebar)) {
    normalizedSidebar = sidebar.map(normalizeSidebarSection)
  } else if (sidebar?.sections) {
    normalizedSidebar = sidebar.sections.map(normalizeSidebarSection)
  }

  function processSection(section: SidebarSection, parentPath = '') {
    const link = section.link || section.path
    if (link) {
      const route = {
        path: link,
        name: section.text || section.title,
        component: articleComponent || (() => Promise.resolve({ template: '<div>Page not found</div>' })),
        props: { 
          title: section.text || section.title
        }
      }
      routes.push(route)
    }

    if (section.children) {
      section.children.forEach(child => processSection(child, link || parentPath))
    }
  }

  normalizedSidebar.forEach(section => processSection(section))
  return routes
}

// 创建文档路由器 (保留向后兼容)
export function createDocsRouter(config: DocsConfig, base = '/', componentResolver?: (path: string) => any) {
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'Home',
      component: componentResolver ? componentResolver('/') : () => Promise.resolve({ template: '<div>Home</div>' })
    },
    ...generateRoutesFromSidebar(config.sidebar, componentResolver ? componentResolver('/article') : undefined)
  ]

  return createRouter({
    history: createWebHistory(base),
    routes
  })
}

// 增强的Markdown标题解析函数
export function parseMarkdownHeaders(content: string, maxDepth: number = 2): TocItem[] {
  const headers: TocItem[] = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      
      // 只包含指定深度的标题
      if (level <= maxDepth) {
        const anchor = text
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // 支持中文字符
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '') // 移除首尾的破折号
        
        headers.push({
          text,
          anchor,
          level
        })
      }
    }
  }
  
  return buildTocTree(headers)
}

// 构建层级目录树
function buildTocTree(headers: TocItem[]): TocItem[] {
  const tree: TocItem[] = []
  const stack: TocItem[] = []

  for (const header of headers) {
    // 清理栈，移除等级大于等于当前标题的项目
    while (stack.length > 0 && stack[stack.length - 1].level >= header.level) {
      stack.pop()
    }

    // 如果栈为空或当前标题是顶级标题，添加到根级别
    if (stack.length === 0) {
      tree.push(header)
    } else {
      // 否则添加到父级的children中
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(header)
    }

    // 将当前标题推入栈
    stack.push(header)
  }

  return tree
}

// 获取默认目录配置
export function getDefaultTocConfig(config?: DocsConfig) {
  return {
    depth: config?.toc?.depth || 2,
    enabled: config?.toc?.enabled !== false
  }
} 