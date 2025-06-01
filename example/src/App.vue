<template>
  <div id="app">
    <!-- 直接使用vue-docs-ui组件 -->
    <DocsLayout :config="config" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DocsLayout } from '../..'

// 配置数据
const config = ref({})

// 加载配置
onMounted(async () => {
  try {
    // 从配置文件加载
    const response = await fetch('/config/site.yaml')
    if (response.ok) {
      const yaml = await import('js-yaml')
      const yamlText = await response.text()
      config.value = yaml.load(yamlText)
      console.log('配置加载成功:', config.value)
    }
  } catch (error) {
    console.error('配置加载失败:', error)
    // 使用默认配置
    config.value = {
      site: {
        title: "Vue Docs UI Demo",
        description: "主题系统演示",
        logo: "🎨"
      },
      theme: {
        theme: "vue",
        defaultMode: "auto",
        allowToggle: true,
        showThemeSwitcher: true
      }
    }
  }
})
</script>

<style>
#app {
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 确保全局样式生效 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style> 