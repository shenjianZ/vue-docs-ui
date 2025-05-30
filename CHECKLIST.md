# 📋 Vue Docs UI 发布检查清单

## 发布前必须完成的步骤

### ✅ 开发阶段
- [ ] 所有功能开发完成
- [ ] 代码质量检查通过
- [ ] 单元测试覆盖主要功能
- [ ] 示例项目测试通过
- [ ] 文档更新完整

### ✅ 构建测试
- [ ] 运行 `npm run build:lib` 成功
- [ ] 检查 `dist/` 目录文件完整性
- [ ] TypeScript 声明文件正确生成
- [ ] 样式文件正常

### ✅ 版本管理
- [ ] 确定版本类型（patch/minor/major）
- [ ] 更新 CHANGELOG.md
- [ ] 版本号符合语义化版本规范

### ✅ NPM 准备
- [ ] NPM 账户已注册并验证
- [ ] 运行 `npm login` 成功登录
- [ ] Registry 设置为官方源 `https://registry.npmjs.org`
- [ ] 包名 `vue-docs-ui` 可用（未被占用）

### ✅ 发布验证
- [ ] 运行 `npm run publish:dry` 预览发布内容
- [ ] 检查将要发布的文件列表
- [ ] 确认包大小合理（当前约183KB）
- [ ] 所有必要文件包含在内

### ✅ 实际发布
- [ ] 运行 `npm publish` 发布包
- [ ] 访问 https://www.npmjs.com/package/vue-docs-ui 确认发布成功
- [ ] 测试安装：`npm install vue-docs-ui`
- [ ] 验证导入：`import createDocsApp from 'vue-docs-ui'`

### ✅ 发布后操作
- [ ] 创建 Git 标签：`git tag v1.0.0`
- [ ] 推送标签：`git push origin v1.0.0`
- [ ] 更新项目 README 中的版本信息
- [ ] 发布 GitHub Release（如果有仓库）
- [ ] 通知相关团队或用户

## 🚨 注意事项

1. **确保测试充分**：发布前务必在示例项目中完整测试所有功能
2. **版本号不可重复**：一旦发布，版本号不能再次使用
3. **文档同步**：确保文档与代码版本同步
4. **依赖检查**：确认所有依赖项版本稳定

## 📞 紧急情况处理

如果发布后发现严重问题：
1. 立即发布修复版本（patch版本）
2. 不要删除有问题的版本（NPM不允许）
3. 在文档中说明问题和解决方案
4. 考虑使用 `npm deprecate` 标记有问题的版本

---

✅ **所有项目都完成后，你就可以安全地发布 Vue Docs UI 到 NPM 了！** 