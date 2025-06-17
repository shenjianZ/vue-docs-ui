<template>
  <footer class="footer-nav" v-if="footerConfig.enabled">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="footer-main">
        <!-- Logo 和品牌信息 -->
        <div class="footer-brand">
          <div class="brand-logo">
            <img 
              v-if="isImageLogo(siteInfo.logo)" 
              :src="siteInfo.logo" 
              :alt="siteInfo.title"
              class="logo-image"
            />
            <span v-else class="logo-text">{{ siteInfo.logo }}</span>
          </div>
                    <h3 class="brand-title">{{ siteInfo.title }}</h3>
          <p class="brand-description">{{ siteInfo.description }}</p>
          
          <!-- Connect Me 区域移动到这里 -->
          
          <div class="connect-section" v-if="footerConfig && footerConfig.social && footerConfig.social.length > 0">
            <div class="connect-links">
              <a 
                v-for="social in footerConfig.social" 
                :key="social.name"
                :href="social.url" 
                :target="getTargetForSocial(social)" 
                :rel="getRelForSocial(social)"
                class="connect-link" 
                :title="getWeChatTitle(social)"
                @click="handleSocialClick(social, $event)"
              >
                <SocialIcons :name="social.icon || social.name" :size="20" />
              </a>
            </div>
          </div>
          

        </div>
        
        <!-- 保留的文档链接 -->
        <div class="footer-links">
          <div class="links-section">
            <h4 class="section-title">{{ t('footer.community') }}</h4>
            <ul class="links-list">
              <li class="link-item">
                <a 
                  :href="getRepositoryLink('discussions')" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link external"
                  @click="handleLinkClick('discussions')"
                >
                  {{ t('footer.discussions') }}
                  <ExternalLink :size="14" class="external-icon" />
                </a>
              </li>
              <li class="link-item">
                <a 
                  :href="getRepositoryLink('issues')" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link external"
                >
                  {{ t('footer.issues') }}
                  <ExternalLink :size="14" class="external-icon" />
                </a>
              </li>
              <li class="link-item">
                <a 
                  :href="getRepositoryLink('contributing')" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link external"
                >
                  {{ t('footer.contributing') }}
                  <ExternalLink :size="14" class="external-icon" />
                </a>
              </li>
              <li class="link-item">
                <a 
                  :href="getRepositoryLink('releases')" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link external"
                >
                  {{ t('footer.releases') }}
                  <ExternalLink :size="14" class="external-icon" />
                </a>
              </li>
            </ul>
          </div>
          
          <div class="links-section">
            <h4 class="section-title">{{ t('footer.support') }}</h4>
            <ul class="links-list">
              <li class="link-item">
                <router-link to="/examples" class="footer-link">
                  {{ t('footer.examples') }}
                </router-link>
              </li>
              <li class="link-item">
                <a 
                  :href="getRepositoryLink('source')" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link external"
                >
                  {{ t('footer.sourceCode') }}
                  <ExternalLink :size="14" class="external-icon" />
                </a>
              </li>
              <li class="link-item">
                <a 
                  :href="getRepositoryLink('license')" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link external"
                >
                  {{ t('footer.license') }}
                  <ExternalLink :size="14" class="external-icon" />
                </a>
              </li>
              <li class="link-item">
                <a 
                  href="#" 
                  class="footer-link"
                  @click.prevent="scrollToTop"
                >
                  {{ t('footer.backToTop') }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        </div>
      
      <!-- 分割线 -->
      <div class="footer-divider"></div>
      
      <!-- 底部信息 -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>{{ footerConfig.copyright }}</p>
          <p class="build-info">
            {{ t('footer.builtWith') }} 
            <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="tech-link">Vue.js</a>
            {{ t('common.and') }}
            <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" class="tech-link">Vite</a>
          </p>
        </div>
        
        <div class="footer-meta">
          <div class="version-info">
            <span class="version-badge">v{{ packageVersion }}</span>
            <span class="update-time">{{ t('footer.lastUpdated') }}: {{ lastUpdated }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ExternalLink } from 'lucide-vue-next'
import { loadConfig, getSiteInfo, getNavbarConfig, getFooterConfig } from '../utils/config'
import SocialIcons from './SocialIcons.vue'

export default {
  name: 'FooterNav',
  components: {
    ExternalLink,
    SocialIcons,
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const router = useRouter()
    const { t } = useI18n()
    const siteInfo = reactive({})
    const navItems = ref([])
    const footerConfig = ref({ enabled: false, social: [], repository: {} })
    const packageVersion = ref('1.0.10')
    const lastUpdated = ref('')
    
    // 从props或inject获取配置
    const docsConfig = props.config || inject('docsConfig', {})
    
    // 判断logo是否为图片链接
    const isImageLogo = (logo) => {
      if (!logo || typeof logo !== 'string') {
        return false
      }
      const isUrl = logo.match(/^(https?:\/\/|\/|\.\/|\.\.\/)/i)
      const hasImageExt = logo.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)(\?.*)?$/i)
      return !!isUrl && !!hasImageExt
    }
    
    // 获取最新commit时间
    const getLastCommitTime = async () => {
      const repository = footerConfig.value.repository
      if (!repository || !repository.url) {
        return new Date().toLocaleDateString('zh-CN')
      }
      
      try {
        // 从GitHub URL提取用户名和仓库名
        const match = repository.url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
        if (!match) {
          return new Date().toLocaleDateString('zh-CN')
        }
        
        const [, owner, repo] = match
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
        
        // 设置请求超时
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
        
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Vue-Docs-UI'
          }
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const commits = await response.json()
          if (commits.length > 0) {
            const commitDate = new Date(commits[0].commit.committer.date)
            return commitDate.toLocaleDateString('zh-CN')
          }
        } else if (response.status === 403) {
          // API速率限制，使用备选方案
          console.warn('GitHub API速率限制，使用备选时间')
          return getAlternativeUpdateTime()
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('获取commit时间超时')
        } else {
          console.warn('获取最新commit时间失败:', error)
        }
      }
      
      // 如果获取失败，使用备选方案
      return getAlternativeUpdateTime()
    }
    
    // 备选的更新时间方案
    const getAlternativeUpdateTime = () => {
      // 优先使用配置文件中的lastUpdated
      const configLastUpdated = footerConfig.value?.lastUpdated
      if (configLastUpdated) {
        try {
          return new Date(configLastUpdated).toLocaleDateString('zh-CN')
        } catch {
          // 配置时间格式错误，继续使用默认方案
        }
      }
      
      // 备用默认时间
      const projectLastUpdate = '2024-12-19'
      try {
        return new Date(projectLastUpdate).toLocaleDateString('zh-CN')
      } catch {
        return new Date().toLocaleDateString('zh-CN')
      }
    }
    
    // 初始化配置
    const initConfig = async () => {
      try {
        await loadConfig()
        
        const siteData = getSiteInfo()
        const navData = getNavbarConfig()
        const footerData = getFooterConfig()
        
        Object.assign(siteInfo, siteData)
        navItems.value = navData.items || []
        
        // 确保footer配置正确赋值
        if (footerData) {
          footerConfig.value = {
            enabled: footerData.enabled !== false,
            social: footerData.social || [],
            repository: footerData.repository || {
              url: 'https://github.com/shenjianZ/vue-docs-ui',
              branch: 'master'
            },
            copyright: footerData.copyright || '© 2024 Vue Docs UI. All rights reserved.'
          }
        } else {
          // 使用默认配置
          footerConfig.value = { 
            enabled: true, 
            social: [
              { name: 'email', url: 'mailto:contact@example.com', icon: 'mail' },
              { name: 'github', url: 'https://github.com/shenjianZ', icon: 'github' }
            ],
            repository: {
              url: 'https://github.com/shenjianZ/vue-docs-ui',
              branch: 'master'
            },
            copyright: '© 2024 Vue Docs UI. All rights reserved.'
          }
        }
        
        // 获取最新commit时间
        lastUpdated.value = await getLastCommitTime()
      } catch (error) {
        console.error('配置加载失败:', error)
        // 设置默认配置
        footerConfig.value = { 
          enabled: true, 
          social: [
            { name: 'email', url: 'mailto:contact@example.com', icon: 'mail' },
            { name: 'github', url: 'https://github.com/shenjianZ', icon: 'github' }
          ],
          repository: {
            url: 'https://github.com/shenjianZ/vue-docs-ui',
            branch: 'master'
          },
          copyright: '© 2024 Vue Docs UI. All rights reserved.'
        }
        lastUpdated.value = new Date().toLocaleDateString('zh-CN')
      }
    }
    
    // 监听语言切换事件
    const handleLocaleChange = () => {
      initConfig()
    }
    
    // 回到顶部
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    
    // 获取仓库相关链接
    const getRepositoryLink = (type) => {
      const repository = footerConfig.value?.repository
      
      if (!repository || !repository.url) {
        return '#'
      }
      
      const baseUrl = repository.url
      const branch = repository.branch || 'master'
      
      let link = ''
      switch (type) {
        case 'discussions':
          link = `${baseUrl}/discussions`
          break
        case 'issues':
          link = `${baseUrl}/issues`
          break
        case 'contributing':
          link = `${baseUrl}/blob/${branch}/CONTRIBUTING.md`
          break
        case 'releases':
          link = `${baseUrl}/releases`
          break
        case 'source':
          link = baseUrl
          break
        case 'license':
          link = `${baseUrl}/blob/${branch}/LICENSE`
          break
        default:
          link = baseUrl
      }
      
      return link
    }
    
    // 初始化
    onMounted(async () => {
      await initConfig()
      window.addEventListener('locale-changed', handleLocaleChange)
    })
    
    // 处理导航点击
    const handleNavClick = (item) => {
      if (!item.external) {
        router.push(item.link)
      }
    }
    
    // 处理链接点击
    const handleLinkClick = (link) => {
      if (typeof link === 'string') {
        // 处理字符串类型的链接（如 'discussions'）
        const url = getRepositoryLink(link)
        return
      }
      
      if (!link.external) {
        router.push(link.link)
      }
    }
    
    // 获取社交链接的target属性
    const getTargetForSocial = (social) => {
      if (social.url.startsWith('mailto:') || social.url.startsWith('weixin://') || social.url.startsWith('mqqapi://')) {
        return undefined
      }
      return '_blank'
    }
    
    // 获取社交链接的rel属性
    const getRelForSocial = (social) => {
      if (social.url.startsWith('mailto:') || social.url.startsWith('weixin://') || social.url.startsWith('mqqapi://')) {
        return undefined
      }
      return 'noopener noreferrer'
    }
    
    // 获取移动端社交应用的特殊标题
    const getWeChatTitle = (social) => {
      if (social.name === 'wechat') {
        return '点击添加微信好友（移动端）'
      }
      if (social.name === 'qq') {
        return '点击查看QQ名片（移动端）'
      }
      return t(`footer.${social.name}`)
    }
    
    // 处理社交链接点击
    const handleSocialClick = (social, event) => {
      // 检测是否为移动端
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (social.name === 'wechat' && social.url.startsWith('weixin://')) {
        if (!isMobile) {
          event.preventDefault()
          // 在桌面端显示提示
          const wechatId = social.url.split('?')[1]
          alert('请在手机上点击此链接，或直接添加微信号：' + wechatId)
          return false
        }
      }
      
      if (social.name === 'qq' && social.url.startsWith('mqqapi://')) {
        if (!isMobile) {
          event.preventDefault()
          // 从QQ链接中提取QQ号
          const qqMatch = social.url.match(/uin=(\d+)/)
          const qqNumber = qqMatch ? qqMatch[1] : '未知'
          alert('请在手机上点击此链接，或直接添加QQ号：' + qqNumber)
          return false
        }
      }
      
      return true
    }
    
          return {
        siteInfo,
        navItems,
        footerConfig,
        packageVersion,
        lastUpdated,
        isImageLogo,
        scrollToTop,
        getRepositoryLink,
        handleNavClick,
        handleLinkClick,
        getTargetForSocial,
        getRelForSocial,
        getWeChatTitle,
        handleSocialClick,
        t
      }
  }
}
</script>

<style lang="scss" scoped>
.footer-nav {
  background: var(--bg-color-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem 1.5rem;
    
    @media (max-width: 768px) {
      padding: 2rem 1rem 1rem;
    }
  }
  
  .footer-main {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    margin-bottom: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }
  }
  
  .footer-brand {
    .brand-logo {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      
      .logo-image {
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius);
        margin-right: 0.75rem;
      }
      
      .logo-text {
        font-size: 2rem;
        margin-right: 0.75rem;
      }
    }
    
    .brand-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--heading-color);
      margin: 0 0 0.5rem 0;
    }
    
    .brand-description {
      color: var(--text-color-light);
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
      max-width: 280px;
    }
    
    .connect-section {
      .connect-links {
        display: flex;
        gap: 0.75rem;
        
        .connect-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius);
          background: var(--bg-color);
          color: var(--text-color-light);
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          
          &:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  .footer-links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
  
  .links-section {
    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--heading-color);
      margin: 0 0 1rem 0;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 20px;
        height: 2px;
        background: var(--primary-color);
        border-radius: 1px;
      }
    }
    
    .links-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .link-item {
      margin-bottom: 0.5rem;
    }
    
    .footer-link {
      display: inline-flex;
      align-items: center;
      color: var(--text-color-light);
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      padding: 0.25rem 0;
      
      &:hover {
        color: var(--primary-color);
        padding-left: 0.25rem;
      }
      
      &.external {
        .external-icon {
          margin-left: 0.25rem;
          opacity: 0.6;
        }
      }
    }
  }
  
  .footer-divider {
    height: 1px;
    background: var(--border-color);
    margin: 2rem 0 1.5rem;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }
  }
  
  .footer-copyright {
    p {
      color: var(--text-color-muted);
      font-size: 0.875rem;
      margin: 0 0 0.25rem 0;
    }
    
    .build-info {
      margin-top: 0.25rem;
      
      .tech-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .footer-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
    
    @media (max-width: 768px) {
      align-items: center;
    }
  }
  
  .version-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: var(--text-color-muted);
    
    .version-badge {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: var(--border-radius);
      font-weight: 500;
      font-size: 0.7rem;
    }
  }
}

// 深色模式特殊处理
.dark .footer-nav {
  background: var(--bg-color);
  border-top-color: var(--border-color);
}
</style> 