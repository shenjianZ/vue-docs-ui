// Service Worker for Vue Docs UI PWA
const CACHE_NAME = 'vue-docs-ui-v1.0.0'
const OFFLINE_URL = '/offline.html'

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  // CSS 和 JS 文件将在运行时添加
]

// 需要缓存的 API 路径模式
const CACHE_PATTERNS = [
  /^\/docs\//,
  /^\/api\//,
  /\.md$/,
  /\.json$/,
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/
]

// Service Worker 安装事件
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets...')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        // 强制激活新的 Service Worker
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error)
      })
  )
})

// Service Worker 激活事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // 立即控制所有客户端
      self.clients.claim()
    ])
  )
})

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') {
    return
  }
  
  // 不缓存 Chrome 扩展请求
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }
  
  // 不缓存开发者工具请求
  if (event.request.url.includes('__webpack_dev_server__')) {
    return
  }
  
  const url = new URL(event.request.url)
  
  // 处理导航请求（页面请求）
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigateRequest(event.request))
    return
  }
  
  // 处理静态资源请求
  if (shouldCache(event.request)) {
    event.respondWith(handleStaticRequest(event.request))
    return
  }
  
  // 处理 API 请求
  if (isApiRequest(event.request)) {
    event.respondWith(handleApiRequest(event.request))
    return
  }
})

// 处理导航请求（页面请求）
async function handleNavigateRequest(request) {
  try {
    // 首先尝试从网络获取
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存成功的响应
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url)
    
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 如果缓存中也没有，返回离线页面
    return caches.match(OFFLINE_URL)
  }
}

// 处理静态资源请求
async function handleStaticRequest(request) {
  try {
    // 先尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 缓存中没有，从网络获取
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存成功的响应
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('Failed to fetch static resource:', request.url)
    
    // 对于关键资源，可以返回一个占位符
    if (request.url.includes('.css')) {
      return new Response('/* Offline CSS */', {
        headers: { 'Content-Type': 'text/css' }
      })
    }
    
    if (request.url.includes('.js')) {
      return new Response('// Offline JS', {
        headers: { 'Content-Type': 'application/javascript' }
      })
    }
    
    // 其他资源返回网络错误响应
    return new Response('Resource not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// 处理 API 请求
async function handleApiRequest(request) {
  try {
    // API 请求优先从网络获取
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // 缓存 API 响应（有选择地缓存）
      if (shouldCacheApiResponse(request)) {
        const cache = await caches.open(CACHE_NAME)
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('API request failed, trying cache for:', request.url)
    
    // 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // 添加一个标识表示这是离线响应
      const offlineResponse = cachedResponse.clone()
      offlineResponse.headers.set('X-Served-From-Cache', 'true')
      return offlineResponse
    }
    
    // 返回离线 API 响应
    return new Response(JSON.stringify({
      error: 'API not available offline',
      message: '网络连接不可用，请检查网络设置'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// 判断是否应该缓存请求
function shouldCache(request) {
  const url = request.url
  return CACHE_PATTERNS.some(pattern => pattern.test(url))
}

// 判断是否是 API 请求
function isApiRequest(request) {
  const url = request.url
  return url.includes('/api/') || url.includes('.json') || url.includes('.md')
}

// 判断是否应该缓存 API 响应
function shouldCacheApiResponse(request) {
  const url = request.url
  
  // 缓存文档内容
  if (url.includes('.md') || url.includes('/docs/')) {
    return true
  }
  
  // 缓存配置文件
  if (url.includes('site.yaml') || url.includes('config.json')) {
    return true
  }
  
  // 不缓存用户相关的 API
  if (url.includes('/user/') || url.includes('/auth/')) {
    return false
  }
  
  return true
}

// 消息处理（用于与主线程通信）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting()
        break
      case 'CACHE_URLS':
        cacheUrls(event.data.urls)
        break
      case 'CLEAR_CACHE':
        clearAllCaches()
        break
      case 'GET_CACHE_INFO':
        getCacheInfo().then(info => {
          event.ports[0].postMessage(info)
        })
        break
    }
  }
})

// 缓存指定的 URL 列表
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(urls)
    console.log('Successfully cached URLs:', urls)
  } catch (error) {
    console.error('Failed to cache URLs:', error)
  }
}

// 清理所有缓存
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    )
    console.log('All caches cleared')
  } catch (error) {
    console.error('Failed to clear caches:', error)
  }
}

// 获取缓存信息
async function getCacheInfo() {
  try {
    const cache = await caches.open(CACHE_NAME)
    const requests = await cache.keys()
    const cacheUrls = requests.map(request => request.url)
    
    return {
      cacheName: CACHE_NAME,
      cacheSize: cacheUrls.length,
      cacheUrls: cacheUrls
    }
  } catch (error) {
    console.error('Failed to get cache info:', error)
    return {
      cacheName: CACHE_NAME,
      cacheSize: 0,
      cacheUrls: []
    }
  }
}

// 后台同步（当网络恢复时同步数据）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(backgroundSync())
  }
})

// 后台同步处理
async function backgroundSync() {
  try {
    console.log('Performing background sync...')
    
    // 可以在这里添加后台同步逻辑
    // 比如同步用户数据、发送离线时的反馈等
    
    // 更新缓存中的关键资源
    const criticalUrls = ['/manifest.json', '/']
    await cacheUrls(criticalUrls)
    
    console.log('Background sync completed')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push 通知处理
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || '您有新的文档更新',
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: data.tag || 'docs-update',
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: '查看',
          icon: '/icon-view.png'
        },
        {
          action: 'dismiss',
          title: '忽略',
          icon: '/icon-dismiss.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || '文档更新', options)
    )
  }
})

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'view') {
    // 打开相关页面
    const url = event.notification.data.url || '/'
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})

console.log('Service Worker loaded successfully') 