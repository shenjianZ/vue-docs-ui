// 临时测试文件
import createDocsApp from '../dist/vue-docs-ui.es.js'

// 测试配置加载
async function testConfig() {
  try {
    const response = await fetch('/config/site.yaml')
    const yamlText = await response.text()
    console.log('YAML content:', yamlText.substring(0, 200) + '...')
    
    // 这里我们手动测试YAML解析
    const config = await fetch('/config/site.yaml').then(r => r.text())
    console.log('Config loaded successfully')
    console.log('First few characters:', config.substring(0, 50))
  } catch (error) {
    console.error('Failed to load config:', error)
  }
}

// testConfig() 