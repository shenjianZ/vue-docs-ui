// 开箱即用示例 - 仅需3行代码！
import createDocsApp from '../dist/vue-docs-ui.es.js'
import '../dist/vue-docs-ui.css'

// 等待DOM加载完成后再启动应用
document.addEventListener('DOMContentLoaded', () => {
  // 启动文档应用
  createDocsApp({
    configPath: '/config/site.yaml',
    el: '#app'
  }).catch(error => {
    console.error('启动文档应用失败:', error)
    // 显示错误信息
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #ef4444;">
          <h2>❌ 加载失败</h2>
          <p>${error.message || '未知错误'}</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">重新加载</button>
        </div>
      `
    }
  })
})

// 就这么简单！无需创建任何组件

