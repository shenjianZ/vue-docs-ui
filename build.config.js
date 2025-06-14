// 构建配置 - 控制 console 移除行为
export const buildConfig = {
  // 是否在生产环境移除 console
  removeConsole: true,
  
  // 要移除的 console 方法
  consoleIncludes: ['log', 'warn', 'error', 'info', 'debug'],
  
  // 要保留的 console（通过注释标记）
  // 在代码中使用 // @keep-console 注释来保留特定的 console
  keepConsoleComment: '@keep-console',
  
  // 要保留的文件模式（这些文件中的 console 不会被移除）
  excludeFiles: [
    '**/sw.js',           // Service Worker
    '**/debug.js',        // 调试文件
    '**/scripts/**',      // 脚本文件
  ],
  
  // 开发环境配置
  development: {
    removeConsole: false,  // 开发环境保留所有 console
  },
  
  // 生产环境配置
  production: {
    removeConsole: true,
    // 生产环境可以保留错误日志
    consoleIncludes: ['log', 'warn', 'info', 'debug'], // 不移除 error
  }
}

// 根据环境获取配置
export function getBuildConfig(mode = 'production') {
  const baseConfig = { ...buildConfig }
  const envConfig = buildConfig[mode] || buildConfig.production
  
  return {
    ...baseConfig,
    ...envConfig
  }
} 