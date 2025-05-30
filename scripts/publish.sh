#!/bin/bash

# Vue Docs UI 发布脚本

echo "🚀 开始发布 Vue Docs UI..."

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ 有未提交的更改，请先提交所有更改"
  exit 1
fi

# 运行类型检查
echo "🔍 运行类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ 类型检查失败"
  exit 1
fi

# 构建库
echo "🔨 构建库..."
npm run build:lib
if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

# 检查构建产物
if [ ! -f "dist/vue-docs-ui.es.js" ] || [ ! -f "dist/vue-docs-ui.umd.js" ] || [ ! -f "dist/style.css" ]; then
  echo "❌ 构建产物不完整"
  exit 1
fi

echo "✅ 构建完成"

# 询问版本类型
echo "请选择版本类型:"
echo "1) patch (修复bug)"
echo "2) minor (新功能)"
echo "3) major (破坏性更改)"
read -p "输入选择 (1-3): " version_type

case $version_type in
  1) npm version patch ;;
  2) npm version minor ;;
  3) npm version major ;;
  *) echo "❌ 无效选择"; exit 1 ;;
esac

# 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📦 新版本: $NEW_VERSION"

# 推送到git
echo "📤 推送到Git..."
git push origin main --tags

# 发布到npm
echo "📦 发布到npm..."
npm publish

if [ $? -eq 0 ]; then
  echo "🎉 发布成功! 版本: $NEW_VERSION"
  echo "📖 查看: https://www.npmjs.com/package/vue-docs-ui"
else
  echo "❌ 发布失败"
  exit 1
fi 