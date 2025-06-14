// 日志工具 - 提供统一的日志管理
// 这个文件展示了如何在生产环境中保留重要的日志

/**
 * 日志级别
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

/**
 * 当前日志级别（生产环境只显示 WARN 和 ERROR）
 */
const currentLogLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG

/**
 * 格式化日志消息
 */
function formatMessage(level, message, ...args) {
  const timestamp = new Date().toISOString()
  const levelName = Object.keys(LogLevel)[level]
  return [`[${timestamp}] [${levelName}]`, message, ...args]
}

/**
 * 调试日志 - 开发环境显示，生产环境移除
 */
export function debug(message, ...args) {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.log(...formatMessage(LogLevel.DEBUG, message, ...args))
  }
}

/**
 * 信息日志 - 开发环境显示，生产环境移除
 */
export function info(message, ...args) {
  if (currentLogLevel <= LogLevel.INFO) {
    console.info(...formatMessage(LogLevel.INFO, message, ...args))
  }
}

/**
 * 警告日志 - 始终显示
 */
export function warn(message, ...args) {
  if (currentLogLevel <= LogLevel.WARN) {
    // @keep-console 保留重要的警告日志
    console.warn(...formatMessage(LogLevel.WARN, message, ...args))
  }
}

/**
 * 错误日志 - 始终显示
 */
export function error(message, ...args) {
  if (currentLogLevel <= LogLevel.ERROR) {
    // @keep-console 保留重要的错误日志
    console.error(...formatMessage(LogLevel.ERROR, message, ...args))
  }
}

/**
 * 性能监控日志 - 生产环境保留
 */
export function performance(label, fn) {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  // @keep-console 保留性能监控日志
  console.log(`⚡ Performance [${label}]: ${(end - start).toFixed(2)}ms`)
  
  return result
}

/**
 * 用户行为追踪 - 生产环境保留
 */
export function track(event, data = {}) {
  // @keep-console 保留用户行为追踪
  console.log('📊 Track:', event, data)
  
  // 这里可以集成第三方分析工具
  // analytics.track(event, data)
}

/**
 * 系统状态日志 - 生产环境保留
 */
export function system(message, ...args) {
  // @keep-console 保留系统状态日志
  console.log('🔧 System:', message, ...args)
}

// 默认导出
export default {
  debug,
  info,
  warn,
  error,
  performance,
  track,
  system,
  LogLevel
} 