# Deployment

Learn how to deploy your Vue Docs UI documentation site to various hosting platforms.

## Build Process

### Build Command

Generate a production build:

```bash
npm run build
```

This creates a `dist` folder with optimized static files.

### Build Configuration

Configure build settings in `vite.config.js`:

```javascript
export default {
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          docs: ['vue-docs-ui']
        }
      }
    }
  }
}
```

## Static Site Hosting

### Netlify

1. **Connect Repository**
   - Connect your GitHub/GitLab repository to Netlify

2. **Build Settings**
   ```bash
   # Build command
   npm run build
   
   # Publish directory
   dist
   ```

3. **Netlify Configuration**
   
   Create `netlify.toml`:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [build.environment]
     NODE_VERSION = "18"
   ```

4. **Custom Domain**
   ```toml
   # Custom domain configuration
   [context.production]
     environment = { BASE_URL = "https://your-domain.com" }
   ```

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Vercel Configuration**
   
   Create `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "framework": "vite",
     "routes": [
       { "handle": "filesystem" },
       { "src": "/.*", "dest": "/index.html" }
     ]
   }
   ```

### GitHub Pages

1. **GitHub Actions Workflow**
   
   Create `.github/workflows/deploy.yml`:
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
         
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

2. **Base Path Configuration**
   
   If deploying to a subdirectory (e.g., `username.github.io/repo-name`):
   ```javascript
   // vite.config.js
   export default {
     base: '/repo-name/'
   }
   ```

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

3. **Firebase Configuration**
   
   `firebase.json`:
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

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Server Deployment

### Docker

1. **Dockerfile**
   ```dockerfile
   # Build stage
   FROM node:18-alpine AS build
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   # Production stage
   FROM nginx:alpine
   
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Nginx Configuration**
   
   `nginx.conf`:
   ```nginx
   events {
     worker_connections 1024;
   }
   
   http {
     include       /etc/nginx/mime.types;
     default_type  application/octet-stream;
     
     server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;
       
       # Handle client-side routing
       location / {
         try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
         expires 1y;
         add_header Cache-Control "public, immutable";
       }
     }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t vue-docs-ui .
   docker run -p 80:80 vue-docs-ui
   ```

### Traditional Web Server

#### Apache

Create `.htaccess` in the root directory:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Handle client-side routing
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
</IfModule>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## CI/CD Pipeline

### Complete GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint
      run: npm run lint
      
    - name: Test
      run: npm run test
      
    - name: Build
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  deploy-staging:
    name: Deploy to Staging
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: Deploy to Staging
      # Your staging deployment steps
      run: echo "Deploy to staging"

  deploy-production:
    name: Deploy to Production
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: Deploy to Production
      # Your production deployment steps
      run: echo "Deploy to production"
```

## Environment Configuration

### Environment Variables

```bash
# .env.production
VITE_APP_TITLE="My Documentation"
VITE_API_BASE_URL="https://api.example.com"
VITE_GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
```

### Runtime Configuration

```typescript
// config/runtime.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  environment: import.meta.env.MODE
}
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --analyze
```

### Code Splitting

```typescript
// Lazy load routes
const routes = [
  {
    path: '/guide',
    component: () => import('./pages/Guide.vue')
  },
  {
    path: '/examples',
    component: () => import('./pages/Examples.vue')
  }
]
```

### Asset Optimization

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['vue-docs-ui'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
}
```

## Security Headers

### Netlify

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

### Nginx

```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Monitoring and Analytics

### Google Analytics

```yaml
# site.yaml
analytics:
  google:
    enabled: true
    id: "GA-XXXXXXXXX"
```

### Performance Monitoring

```typescript
// Monitor performance
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0]
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart)
  })
}
```

## Troubleshooting

### Common Issues

1. **404 errors on refresh**
   - Configure server for SPA routing
   - Add proper redirects

2. **Build failures**
   - Check Node.js version compatibility
   - Clear node_modules and package-lock.json

3. **Asset loading issues**
   - Verify base path configuration
   - Check relative path references

### Debug Mode

```bash
# Enable debug logging
DEBUG=vue-docs-ui npm run build
```

### Health Checks

```typescript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
})
``` 