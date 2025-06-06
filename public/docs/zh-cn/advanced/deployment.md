# 部署

本指南将帮助您将 Vue Docs UI 文档网站部署到各种平台。

## 🏗️ 构建准备

### 1. 环境变量

创建 `.env.production` 文件：

```bash
# 生产环境配置
VITE_API_URL=https://your-api.com
VITE_BASE_URL=/your-docs/
VITE_GA_ID=GA_MEASUREMENT_ID

# AI 配置
VITE_OPENAI_API_KEY=your-openai-key
VITE_CLAUDE_API_KEY=your-claude-key
```

### 2. 构建配置

更新 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/your-docs/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          'vue-docs-ui': ['vue-docs-ui']
        }
      }
    }
  }
})
```

### 3. 构建脚本

```json
{
  "scripts": {
    "build": "vite build",
    "build:prod": "NODE_ENV=production vite build",
    "preview": "vite preview",
    "analyze": "vite build --mode analyze"
  }
}
```

## 🚀 静态网站部署

### Netlify

#### 方式一：Git 集成（推荐）

1. **连接仓库**
   ```bash
   # 推送代码到 GitHub/GitLab
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Netlify 配置**
   - 登录 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择您的仓库
   - 配置构建设置：

   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### 方式二：手动部署

```bash
# 构建项目
npm run build

# 安装 Netlify CLI
npm install -g netlify-cli

# 登录并部署
netlify login
netlify deploy --prod --dir=dist
```

### Vercel

#### 方式一：Git 集成

1. **连接仓库**
   - 登录 [Vercel](https://vercel.com)
   - 导入 Git 仓库
   - 配置项目设置

2. **Vercel 配置**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "dist" }
       }
     ],
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "dest": "/index.html" }
     ]
   }
   ```

#### 方式二：CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 构建项目
npm run build

# 部署
vercel --prod
```

### GitHub Pages

#### 方式一：GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### 方式二：gh-pages

```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 添加部署脚本
npm pkg set scripts.deploy="gh-pages -d dist"

# 构建并部署
npm run build
npm run deploy
```

### Firebase Hosting

1. **安装 Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **初始化项目**
   ```bash
   firebase init hosting
   ```

3. **配置 `firebase.json`**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **部署**
   ```bash
   npm run build
   firebase deploy
   ```

## 🐳 容器化部署

### Docker

#### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 处理单页应用路由
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API 代理（如果需要）
        location /api/ {
            proxy_pass http://your-api-server/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### 构建和运行

```bash
# 构建镜像
docker build -t my-docs .

# 运行容器
docker run -d -p 80:80 my-docs

# 使用 Docker Compose
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  docs:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # 如果需要 API 服务
  api:
    image: your-api-image
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=your-db-url
    restart: unless-stopped
```

### Kubernetes

#### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vue-docs-ui
  labels:
    app: vue-docs-ui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vue-docs-ui
  template:
    metadata:
      labels:
        app: vue-docs-ui
    spec:
      containers:
      - name: vue-docs-ui
        image: your-registry/vue-docs-ui:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: vue-docs-ui-service
spec:
  selector:
    app: vue-docs-ui
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vue-docs-ui-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - your-docs.com
    secretName: vue-docs-ui-tls
  rules:
  - host: your-docs.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vue-docs-ui-service
            port:
              number: 80
```

## ☁️ 云平台部署

### AWS S3 + CloudFront

#### 1. S3 配置

```bash
# 安装 AWS CLI
npm install -g aws-cli

# 配置 AWS 凭证
aws configure

# 创建 S3 存储桶
aws s3 mb s3://your-docs-bucket

# 配置存储桶策略
aws s3api put-bucket-policy --bucket your-docs-bucket --policy file://bucket-policy.json
```

#### bucket-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-docs-bucket/*"
    }
  ]
}
```

#### 2. 部署脚本

```bash
#!/bin/bash
# deploy-aws.sh

# 构建项目
npm run build

# 同步到 S3
aws s3 sync dist/ s3://your-docs-bucket --delete

# 清除 CloudFront 缓存
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "部署完成！"
```

### Azure Static Web Apps

#### 1. GitHub Actions 配置

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

### Google Cloud Platform

#### 1. App Engine 部署

```yaml
# app.yaml
runtime: nodejs18

handlers:
- url: /
  static_files: dist/index.html
  upload: dist/index.html

- url: /(.*)
  static_files: dist/\1
  upload: dist/(.*)

- url: /.*
  static_files: dist/index.html
  upload: dist/index.html
```

#### 2. 部署命令

```bash
# 安装 Google Cloud SDK
gcloud init

# 构建项目
npm run build

# 部署到 App Engine
gcloud app deploy
```

## 🔧 服务器部署

### Nginx

#### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 2. 配置文件

```nginx
# /etc/nginx/sites-available/your-docs
server {
    listen 80;
    server_name your-docs.com;
    root /var/www/your-docs;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # 单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### 3. 启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/your-docs /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

### Apache

#### 1. 配置 Virtual Host

```apache
# /etc/apache2/sites-available/your-docs.conf
<VirtualHost *:80>
    ServerName your-docs.com
    DocumentRoot /var/www/your-docs
    
    # 启用压缩
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # 单页应用重写
    RewriteEngine On
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    
    # 缓存设置
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

#### 2. 启用站点

```bash
# 启用站点
sudo a2ensite your-docs.conf

# 启用必要模块
sudo a2enmod rewrite
sudo a2enmod expires
sudo a2enmod deflate

# 重启 Apache
sudo systemctl restart apache2
```

## 🔒 HTTPS 配置

### Let's Encrypt（免费）

#### 1. 安装 Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### 2. 获取证书

```bash
# Nginx
sudo certbot --nginx -d your-docs.com

# Apache
sudo certbot --apache -d your-docs.com
```

#### 3. 自动续期

```bash
# 添加到 crontab
sudo crontab -e

# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

### 自定义证书

#### Nginx HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-docs.com;
    
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # 其他配置...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-docs.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 监控与分析

### 性能监控

#### 1. 添加监控脚本

```javascript
// 在 index.html 中添加
<script>
// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');

// 性能监控
window.addEventListener('load', function() {
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // 发送性能数据
    ga('send', 'timing', 'Performance', 'Load Time', loadTime);
  }
});
</script>
```

#### 2. 错误监控

```javascript
// 错误捕获
window.addEventListener('error', function(e) {
  ga('send', 'exception', {
    'exDescription': e.error.toString(),
    'exFatal': false
  });
});

// 未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', function(e) {
  ga('send', 'exception', {
    'exDescription': 'Unhandled Promise Rejection: ' + e.reason,
    'exFatal': false
  });
});
```

## 🚨 故障排除

### 常见问题

#### 1. 路由 404 错误

**问题**: 刷新页面或直接访问路由时出现 404
**解决**: 配置服务器重写规则，将所有请求重定向到 `index.html`

#### 2. 静态资源加载失败

**问题**: CSS/JS 文件 404
**解决**: 检查 `vite.config.js` 中的 `base` 配置

#### 3. CORS 错误

**问题**: API 请求被 CORS 阻止
**解决**: 配置服务器 CORS 头或使用代理

```nginx
# Nginx CORS 配置
location /api/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    proxy_pass http://your-api-server/;
}
```

#### 4. 内存不足

**问题**: 构建时内存不足
**解决**: 增加 Node.js 内存限制

```bash
# 增加内存限制
node --max-old-space-size=4096 node_modules/.bin/vite build
```

## 📋 部署检查清单

### 部署前检查

- [ ] 环境变量配置正确
- [ ] API 密钥已配置（生产环境）
- [ ] 构建成功无错误
- [ ] 所有路由可访问
- [ ] 静态资源加载正常
- [ ] 响应式设计测试
- [ ] SEO 标签配置
- [ ] 性能优化完成

### 部署后验证

- [ ] 网站可正常访问
- [ ] HTTPS 配置正确
- [ ] 所有功能正常工作
- [ ] 搜索功能正常
- [ ] AI 助手功能正常
- [ ] 多语言切换正常
- [ ] 主题切换正常
- [ ] 移动端适配正常

## 📚 下一步

- 查看 [性能优化](/advanced/performance) 指南
- 学习 [SEO 优化](/advanced/seo) 最佳实践
- 探索 [CDN 配置](/advanced/cdn) 选项 