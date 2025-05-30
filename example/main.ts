// 开箱即用示例 - 仅需3行代码！
import createDocsApp from '../dist/vue-docs-ui.es.js'
import '../dist/style.css'

// 启动文档应用
createDocsApp({
  configPath: '/config/site.yaml',
  el: '#app'
})

// 就这么简单！无需创建任何组件 