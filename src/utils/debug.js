// 调试工具函数
import { loadConfig, getSiteInfo, getSidebarConfig, getNavbarConfig } from './config'

// 调试配置加载
export async function debugConfig() {
  console.group('🔧 配置调试信息')
  
  try {
    // 加载配置
    const config = await loadConfig()
    console.log('✅ 配置加载成功:', config)
    
    // 检查网站信息
    const siteInfo = getSiteInfo()
    console.log('📝 网站信息:', siteInfo)
    
    // 检查侧边栏配置
    const sidebarConfig = getSidebarConfig()
    console.log('📚 侧边栏配置:', sidebarConfig)
    
    // 检查导航栏配置
    const navbarConfig = getNavbarConfig()
    console.log('🧭 导航栏配置:', navbarConfig)
    
  } catch (error) {
    console.error('❌ 配置加载失败:', error)
  }
  
  console.groupEnd()
}

// 自动执行调试（开发环境）
if (import.meta.env.DEV) {
  window.debugConfig = debugConfig
  console.log('💡 提示：在控制台运行 debugConfig() 来查看配置信息')
} 