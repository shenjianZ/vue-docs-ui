// PWA 助手函数
let deferredPrompt = null
let swRegistration = null

/**
 * 注册 Service Worker
 */
export async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported in this browser')
    return null
  }

  try {
    // 注册 Service Worker
    swRegistration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    console.log('Service Worker registered successfully:', swRegistration.scope)

    // 监听 Service Worker 更新
    swRegistration.addEventListener('updatefound', () => {
      const newWorker = swRegistration.installing
      console.log('New Service Worker found, installing...')

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // 有新的 Service Worker 可用
            showUpdateNotification()
          } else {
            // Service Worker 首次安装成功
            console.log('Service Worker installed for the first time')
            showInstallNotification()
          }
        }
      })
    })

    // 监听 Service Worker 控制权变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed, reloading page...')
      window.location.reload()
    })

    return swRegistration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

/**
 * 显示安装通知
 */
function showInstallNotification() {
  if (window.createToast) {
    window.createToast({
      type: 'success',
      title: 'PWA 已启用',
      message: '文档现在可以离线访问了！',
      duration: 5000
    })
  }
}

/**
 * 显示更新通知
 */
function showUpdateNotification() {
  if (window.createToast) {
    window.createToast({
      type: 'info',
      title: '新版本可用',
      message: '点击更新以获取最新功能',
      duration: 0, // 不自动消失
      actions: [
        {
          text: '更新',
          action: () => updateSW()
        },
        {
          text: '稍后',
          action: () => {}
        }
      ]
    })
  } else {
    // 备用通知方式
    if (confirm('发现新版本，是否立即更新？')) {
      updateSW()
    }
  }
}

/**
 * 更新 Service Worker
 */
export function updateSW() {
  if (swRegistration && swRegistration.waiting) {
    // 发送消息给等待中的 Service Worker
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }
}

/**
 * 缓存指定 URL 列表
 */
export async function cacheUrls(urls) {
  if (swRegistration && swRegistration.active) {
    swRegistration.active.postMessage({
      type: 'CACHE_URLS',
      urls: urls
    })
  } else {
    console.warn('Service Worker not active, cannot cache URLs')
  }
}

/**
 * 清除所有缓存
 */
export async function clearCache() {
  if (swRegistration && swRegistration.active) {
    swRegistration.active.postMessage({
      type: 'CLEAR_CACHE'
    })
  }
}

/**
 * 获取缓存信息
 */
export async function getCacheInfo() {
  return new Promise((resolve) => {
    if (swRegistration && swRegistration.active) {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data)
      }
      
      swRegistration.active.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      )
    } else {
      resolve(null)
    }
  })
}

/**
 * 监听安装提示事件
 */
export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    // 阻止默认的安装提示
    event.preventDefault()
    // 保存事件，稍后可以手动触发
    deferredPrompt = event
    
    console.log('Install prompt saved')
    
    // 显示自定义安装提示
    showInstallPrompt()
  })
}

/**
 * 显示安装提示
 */
function showInstallPrompt() {
  // 检查是否已经安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return // 已经安装
  }
  
  // 创建安装提示
  const installBanner = document.createElement('div')
  installBanner.className = 'install-banner'
  installBanner.innerHTML = `
    <div class="install-banner-content">
      <div class="install-banner-icon">📱</div>
      <div class="install-banner-text">
        <strong>安装 Vue Docs UI</strong>
        <p>获得更好的离线体验</p>
      </div>
      <div class="install-banner-actions">
        <button class="install-btn" onclick="installPWA()">安装</button>
        <button class="dismiss-btn" onclick="dismissInstallPrompt()">稍后</button>
      </div>
    </div>
  `
  
  // 设置样式
  installBanner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    max-width: 400px;
    margin: 0 auto;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    animation: slideInUp 0.3s ease-out;
  `
  
  document.body.appendChild(installBanner)
  
  // 添加全局安装函数
  window.installPWA = installPWA
  window.dismissInstallPrompt = dismissInstallPrompt
  
  // 10秒后自动隐藏
  setTimeout(() => {
    if (document.body.contains(installBanner)) {
      dismissInstallPrompt()
    }
  }, 10000)
}

/**
 * 触发 PWA 安装
 */
export async function installPWA() {
  if (!deferredPrompt) {
    console.warn('Install prompt not available')
    return false
  }
  
  try {
    // 显示安装提示
    deferredPrompt.prompt()
    
    // 等待用户响应
    const choiceResult = await deferredPrompt.userChoice
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt')
      dismissInstallPrompt()
      return true
    } else {
      console.log('User dismissed the install prompt')
      return false
    }
  } catch (error) {
    console.error('Install prompt failed:', error)
    return false
  } finally {
    deferredPrompt = null
  }
}

/**
 * 关闭安装提示
 */
export function dismissInstallPrompt() {
  const installBanner = document.querySelector('.install-banner')
  if (installBanner) {
    installBanner.style.animation = 'slideOutDown 0.3s ease-out'
    setTimeout(() => {
      if (document.body.contains(installBanner)) {
        document.body.removeChild(installBanner)
      }
    }, 300)
  }
  
  // 清理全局函数
  delete window.installPWA
  delete window.dismissInstallPrompt
}

/**
 * 检查是否在 PWA 模式下运行
 */
export function isPWAMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true
}

/**
 * 监听 PWA 安装完成事件
 */
export function listenForAppInstalled() {
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    
    if (window.createToast) {
      window.createToast({
        type: 'success',
        title: '安装成功',
        message: 'Vue Docs UI 已添加到您的设备',
        duration: 3000
      })
    }
    
    // 清理安装提示
    deferredPrompt = null
    dismissInstallPrompt()
  })
}

/**
 * 网络状态监听
 */
export function setupNetworkListener() {
  let isOnline = navigator.onLine
  
  const updateNetworkStatus = () => {
    const newStatus = navigator.onLine
    
    if (newStatus !== isOnline) {
      isOnline = newStatus
      
      if (isOnline) {
        console.log('Network connection restored')
        if (window.createToast) {
          window.createToast({
            type: 'success',
            title: '网络已恢复',
            message: '您现在可以正常访问最新内容',
            duration: 3000
          })
        }
      } else {
        console.log('Network connection lost')
        if (window.createToast) {
          window.createToast({
            type: 'warning',
            title: '网络连接中断',
            message: '您仍可以浏览已缓存的内容',
            duration: 5000
          })
        }
      }
      
      // 派发自定义事件
      window.dispatchEvent(new CustomEvent('networkstatuschange', {
        detail: { isOnline }
      }))
    }
  }
  
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)
  
  return isOnline
}

/**
 * 初始化 PWA 功能
 */
export async function initPWA() {
  console.log('Initializing PWA features...')
  
  // 注册 Service Worker
  await registerSW()
  
  // 监听安装提示
  listenForInstallPrompt()
  
  // 监听安装完成
  listenForAppInstalled()
  
  // 设置网络状态监听
  setupNetworkListener()
  
  // 如果是 PWA 模式，添加特殊样式
  if (isPWAMode()) {
    document.documentElement.classList.add('pwa-mode')
    console.log('Running in PWA mode')
  }
  
  console.log('PWA features initialized')
}

/**
 * 预缓存关键资源
 */
export async function precacheResources(urls) {
  try {
    await cacheUrls(urls)
    console.log('Resources precached:', urls)
  } catch (error) {
    console.error('Failed to precache resources:', error)
  }
}

// 添加必要的 CSS 动画
const style = document.createElement('style')
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(100%);
    }
  }
  
  .install-banner-content {
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }
  
  .install-banner-icon {
    font-size: 2rem;
  }
  
  .install-banner-text {
    flex: 1;
  }
  
  .install-banner-text strong {
    display: block;
    color: var(--text-color);
    margin-bottom: 0.25rem;
  }
  
  .install-banner-text p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-color-light);
  }
  
  .install-banner-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .install-btn,
  .dismiss-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }
  
  .install-btn {
    background: var(--primary-color);
    color: white;
  }
  
  .install-btn:hover {
    background: var(--primary-color-dark);
  }
  
  .dismiss-btn {
    background: transparent;
    color: var(--text-color-light);
    border: 1px solid var(--border-color);
  }
  
  .dismiss-btn:hover {
    background: var(--bg-color-hover);
  }
  
  /* PWA 模式下的特殊样式 */
  .pwa-mode .header-nav {
    padding-top: env(safe-area-inset-top);
  }
  
  .pwa-mode .docs-layout {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  @media (max-width: 768px) {
    .install-banner {
      left: 10px !important;
      right: 10px !important;
    }
    
    .install-banner-content {
      padding: 0.75rem;
    }
    
    .install-banner-actions {
      flex-direction: column;
    }
    
    .install-btn,
    .dismiss-btn {
      width: 100%;
    }
  }
`
document.head.appendChild(style) 