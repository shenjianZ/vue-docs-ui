#!/usr/bin/env node

// 测试 console 移除功能的脚本
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('🧪 测试 Console 移除功能')
console.log('========================\n')

// 测试构建前的源码
console.log('📁 检查源码中的 console 使用情况...')

function countConsoleInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const consoleMatches = content.match(/console\.(log|warn|error|info|debug)/g) || []
    return consoleMatches.length
  } catch (error) {
    return 0
  }
}

function scanDirectory(dir, extensions = ['.js', '.ts', '.vue']) {
  const results = []
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
        scan(fullPath)
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        const consoleCount = countConsoleInFile(fullPath)
        if (consoleCount > 0) {
          results.push({
            file: path.relative(__dirname, fullPath),
            count: consoleCount
          })
        }
      }
    }
  }
  
  scan(dir)
  return results
}

// 扫描源码目录
const srcResults = scanDirectory(path.join(__dirname, 'src'))
const totalConsoles = srcResults.reduce((sum, item) => sum + item.count, 0)

console.log(`📊 源码统计:`)
console.log(`   总文件数: ${srcResults.length}`)
console.log(`   总 console 数: ${totalConsoles}`)
console.log()

if (srcResults.length > 0) {
  console.log('📋 详细列表:')
  srcResults.forEach(item => {
    console.log(`   ${item.file}: ${item.count} 个 console`)
  })
  console.log()
}

// 检查构建配置
console.log('⚙️  检查构建配置...')
try {
  const configPath = path.join(__dirname, 'build.config.js')
  if (fs.existsSync(configPath)) {
    console.log('✅ 构建配置文件存在')
    
    // 动态导入配置
    const { getBuildConfig } = await import('./build.config.js')
    const prodConfig = getBuildConfig('production')
    const devConfig = getBuildConfig('development')
    
    console.log(`   生产环境移除 console: ${prodConfig.removeConsole ? '✅' : '❌'}`)
    console.log(`   开发环境移除 console: ${devConfig.removeConsole ? '✅' : '❌'}`)
    console.log(`   移除的方法: ${prodConfig.consoleIncludes.join(', ')}`)
    console.log(`   排除的文件: ${prodConfig.excludeFiles.join(', ')}`)
  } else {
    console.log('❌ 构建配置文件不存在')
  }
} catch (error) {
  console.log('❌ 读取构建配置失败:', error.message)
}

console.log()

// 提供构建建议
console.log('💡 使用建议:')
console.log('   1. 运行 `npm run build` 构建生产版本')
console.log('   2. 检查 dist 目录中的文件是否已移除 console')
console.log('   3. 使用 `// @keep-console` 注释保留重要日志')
console.log('   4. 使用 src/utils/logger.js 进行统一日志管理')
console.log()

console.log('🎯 测试完成！')

// 如果是通过 npm script 运行，提供下一步操作
if (process.env.npm_lifecycle_event) {
  console.log('\n🚀 下一步操作:')
  console.log('   npm run build        # 构建生产版本')
  console.log('   npm run build:lib     # 构建库版本')
  console.log('   npm run dev           # 开发模式（保留 console）')
} 