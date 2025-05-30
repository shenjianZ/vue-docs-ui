#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Vue Docs UI 发布脚本');
console.log('========================\n');

// 检查当前目录
const packagePath = path.join(__dirname, '../package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ 错误: 未找到 package.json 文件');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log(`📦 包名: ${packageJson.name}`);
console.log(`📌 当前版本: ${packageJson.version}\n`);

try {
  // 1. 检查npm登录状态
  console.log('🔐 检查 NPM 登录状态...');
  try {
    const username = execSync('npm whoami', { encoding: 'utf8' }).trim();
    console.log(`✅ 已登录为: ${username}\n`);
  } catch (e) {
    console.log('❌ 未登录到 NPM');
    console.log('请先运行: npm login\n');
    process.exit(1);
  }

  // 2. 检查registry设置
  console.log('🌐 检查 NPM Registry...');
  const registry = execSync('npm config get registry', { encoding: 'utf8' }).trim();
  console.log(`当前 Registry: ${registry}`);
  
  if (!registry.includes('registry.npmjs.org')) {
    console.log('⚠️  建议切换到官方 Registry:');
    console.log('npm config set registry https://registry.npmjs.org\n');
  } else {
    console.log('✅ Registry 配置正确\n');
  }

  // 3. 清理并构建
  console.log('🔨 清理并重新构建...');
  execSync('Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue', { stdio: 'inherit' });
  execSync('npm run build:lib', { stdio: 'inherit' });
  console.log('✅ 构建完成\n');

  // 4. 运行 dry-run
  console.log('🧪 运行发布预览...');
  execSync('npm publish --dry-run', { stdio: 'inherit' });
  console.log('✅ 预览完成\n');

  // 5. 确认发布
  console.log('❓ 是否继续发布? (y/N)');
  
  // 在实际使用中，这里应该等待用户输入
  // 为了脚本的完整性，这里添加注释说明
  /*
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('请输入 y 确认发布: ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('🚀 开始发布...');
      execSync('npm publish', { stdio: 'inherit' });
      console.log('🎉 发布成功!');
      console.log(`📱 查看包页面: https://www.npmjs.com/package/${packageJson.name}`);
    } else {
      console.log('❌ 发布已取消');
    }
    rl.close();
  });
  */

  console.log('💡 手动发布命令:');
  console.log('npm publish');

} catch (error) {
  console.error('❌ 发布失败:', error.message);
  process.exit(1);
} 