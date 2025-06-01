import { createI18n } from 'vue-i18n'
import zh from './zh.js'
import en from './en.js'
import { reloadConfig } from '../utils/config.js'

// 支持的语言列表
export const SUPPORTED_LOCALES = [
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'en', 
    name: 'English',
    flag: '🇺🇸'
  }
]

// 获取默认语言
function getDefaultLocale() {
  // 1. 从localStorage获取用户设置
  const stored = localStorage.getItem('vue-docs-locale')
  if (stored && SUPPORTED_LOCALES.find(l => l.code === stored)) {
    return stored
  }
  
  // 2. 从浏览器语言获取
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  
  // 3. 默认英文
  return 'en'
}

// 创建i18n实例
export const i18n = createI18n({
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  },
  legacy: false
})

// 切换语言
export async function setLocale(locale) {
  if (!SUPPORTED_LOCALES.find(l => l.code === locale)) {
    console.warn(`Unsupported locale: ${locale}`)
    return
  }
  
  i18n.global.locale.value = locale
  localStorage.setItem('vue-docs-locale', locale)
  localStorage.setItem('language', locale) // 同时更新配置文件使用的语言键
  
  // 更新HTML lang属性
  document.documentElement.lang = locale
  
  // 重新加载配置文件
  try {
    await reloadConfig(locale)
    console.log(`✅ 语言切换成功，已重新加载配置: ${locale}`)
    
    // 发送自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }))
  } catch (error) {
    console.error('❌ 重新加载配置失败:', error)
  }
}

// 获取当前语言
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 获取语言信息
export function getLocaleInfo(code) {
  return SUPPORTED_LOCALES.find(l => l.code === code)
} 