# GitHub Pages 自动部署设置指南

此项目已配置 GitHub Actions 工作流，可以自动构建和部署到 GitHub Pages。

## 启用步骤

### 1. 在 GitHub 仓库中启用 Pages

1. 转到你的 GitHub 仓库设置页面
2. 滚动到 **Pages** 部分
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 保存设置

### 2. 确保正确的分支名称

工作流配置为在 `master` 分支上触发。如果你的主分支名称不同（如 `main`），请编辑 `.github/workflows/deploy.yml` 文件：

```yaml
on:
  push:
    branches: [ master ]  # 改为你的主分支名称
```

### 3. 触发构建

现在，每当你：
- 推送代码到 `master` 分支
- 在 GitHub 网页端进行 commit
- 手动触发工作流（在 Actions 标签页）

都会自动触发构建和部署。

## 访问你的网站

部署完成后，你的网站将在以下地址可用：
```
https://<你的用户名>.github.io/vue-docs-ui
```

例如：https://shenjianz.github.io/vue-docs-ui

## 工作流说明

工作流包含两个主要步骤：

1. **构建（Build）**：
   - 检出代码
   - 设置 Node.js 18
   - 安装依赖 (`npm ci`)
   - 创建文档站点 (`npm create vue-docs-ui`)
   - 构建文档站点 (`npm run build`)，设置 `GITHUB_PAGES=true` 环境变量
   - 上传构建产物到 GitHub Pages

2. **部署（Deploy）**：
   - 将构建产物部署到 GitHub Pages

## 路径配置说明

项目配置了智能路径处理：

- **本地开发/构建**：使用根路径 `/`，资源路径为 `/assets/...`
- **GitHub Pages 部署**：自动添加仓库前缀 `/vue-docs-ui/`，资源路径为 `/vue-docs-ui/assets/...`

这样确保：
- ✅ 本地 `npm run build` 和 `npm run preview` 正常工作
- ✅ GitHub Pages 部署时路径正确
- ✅ 无需手动修改配置

## 故障排除

### 构建失败
- 检查 Actions 标签页中的错误日志
- 确保 `package.json` 中的构建脚本正常工作
- 确保所有依赖都在 `package.json` 中正确声明

### 权限错误
- 确保仓库设置中启用了 GitHub Pages
- 检查工作流权限设置

### 页面无法访问
- 等待几分钟，GitHub Pages 部署可能需要一些时间
- 检查仓库设置中的 Pages 配置
- 确保构建产物包含 `index.html` 文件

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 在文件中添加你的域名（如 `docs.yoursite.com`）
3. 在你的 DNS 提供商处设置 CNAME 记录指向 `<用户名>.github.io`

## 手动触发部署

你可以在 GitHub 仓库的 **Actions** 标签页手动触发工作流：

1. 点击 **Actions** 标签
2. 选择 "构建和部署到 GitHub Pages" 工作流
3. 点击 **Run workflow** 按钮
4. 选择分支并点击 **Run workflow** 