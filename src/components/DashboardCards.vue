<template>
  <div class="dashboard-cards">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">学习中心</h1>
      <p class="page-description">欢迎来到动手学机器学习，开始您的AI学习之旅</p>
    </div>
    
    <!-- 卡片网格布局 -->
    <div class="cards-grid">
      <!-- 左侧卡片组 -->
      <div class="cards-column-left">
        <!-- 学习进度卡片 -->
        <div class="card progress-card">
          <div class="card-header">
            <div class="card-icon">📊</div>
            <div class="card-title-group">
              <h3 class="card-title">学习进度</h3>
              <p class="card-subtitle">跟踪您的学习进展</p>
            </div>
          </div>
          <div class="card-content">
            <div class="progress-item">
              <div class="progress-label">
                <span class="progress-name">已完成章节</span>
                <span class="progress-value">3 / 10</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 30%"></div>
              </div>
            </div>
            <div class="progress-item">
              <div class="progress-label">
                <span class="progress-name">练习完成度</span>
                <span class="progress-value">15 / 25</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 60%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 快速访问卡片 -->
        <div class="card quick-access-card">
          <div class="card-header">
            <div class="card-icon">⚡</div>
            <div class="card-title-group">
              <h3 class="card-title">快速访问</h3>
              <p class="card-subtitle">常用章节和资源</p>
            </div>
          </div>
          <div class="card-content">
            <div class="quick-links">
              <router-link to="/books/chapter1" class="quick-link">
                <span class="link-icon">🤖</span>
                <span class="link-text">初探机器学习</span>
                <span class="link-arrow">→</span>
              </router-link>
              <router-link to="/books/chapter2" class="quick-link">
                <span class="link-icon">📐</span>
                <span class="link-text">数学基础</span>
                <span class="link-arrow">→</span>
              </router-link>
              <router-link to="/books/chapter4" class="quick-link">
                <span class="link-icon">📈</span>
                <span class="link-text">线性回归</span>
                <span class="link-arrow">→</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧大卡片 -->
      <div class="cards-column-right">
        <!-- 章节导航卡片 -->
        <div class="card chapters-card">
          <div class="card-header">
            <div class="card-icon">📚</div>
            <div class="card-title-group">
              <h3 class="card-title">课程章节</h3>
              <p class="card-subtitle">系统化的机器学习课程内容</p>
            </div>
          </div>
          <div class="card-content">
            <div class="chapters-grid">
              <div class="chapter-item" v-for="chapter in chapters" :key="chapter.id">
                <router-link :to="chapter.path" class="chapter-link">
                  <div class="chapter-header">
                    <span class="chapter-icon">{{ chapter.icon }}</span>
                    <div class="chapter-info">
                      <h4 class="chapter-title">{{ chapter.title }}</h4>
                      <p class="chapter-description">{{ chapter.description }}</p>
                    </div>
                  </div>
                  <div class="chapter-meta">
                    <span class="chapter-duration">{{ chapter.duration }}</span>
                    <span class="chapter-status" :class="chapter.status">
                      {{ getStatusText(chapter.status) }}
                    </span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DashboardCards',
  setup() {
    const chapters = ref([
      {
        id: 1,
        title: '初探机器学习',
        description: '了解AI的基础概念和机器学习的核心思想',
        icon: '🤖',
        path: '/books/chapter1',
        duration: '2小时',
        status: 'completed'
      },
      {
        id: 2,
        title: '机器学习的数学基础',
        description: '线性代数、概率论和微积分基础',
        icon: '📐',
        path: '/books/chapter2',
        duration: '3小时',
        status: 'in-progress'
      },
      {
        id: 3,
        title: '处理领域问题',
        description: '如何分析和解决实际问题',
        icon: '🎯',
        path: '/books/chapter3',
        duration: '1.5小时',
        status: 'pending'
      },
      {
        id: 4,
        title: '线性回归',
        description: '第一个机器学习算法的详细解析',
        icon: '📈',
        path: '/books/chapter4',
        duration: '2.5小时',
        status: 'pending'
      },
      {
        id: 5,
        title: '神经网络与多层感知机',
        description: '深度学习的基础架构',
        icon: '🧠',
        path: '/books/chapter8',
        duration: '4小时',
        status: 'pending'
      },
      {
        id: 6,
        title: '卷积神经网络',
        description: '图像处理的利器CNN',
        icon: '🖼️',
        path: '/books/chapter9',
        duration: '3.5小时',
        status: 'pending'
      }
    ])
    
    const getStatusText = (status) => {
      const statusMap = {
        completed: '已完成',
        'in-progress': '进行中',
        pending: '未开始'
      }
      return statusMap[status] || '未知'
    }
    
    return {
      chapters,
      getStatusText
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-cards {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  margin-bottom: 2rem;
  
  .page-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
  }
  
  .page-description {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: var(--text-color-light);
    margin: 0;
    line-height: 1.5;
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 640px) {
    gap: 0.75rem;
  }
}

.cards-column-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
  
  @media (max-width: 1024px) {
    gap: 1rem;
  }
  
  @media (max-width: 640px) {
    gap: 0.75rem;
  }
}

.cards-column-right {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

// 基础卡片样式
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-color-light);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    border-color: var(--border-color);
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color-light);
  
  .card-icon {
    font-size: 1.5rem;
    line-height: 1;
  }
  
  .card-title-group {
    flex: 1;
    
    .card-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
    }
    
    .card-subtitle {
      font-size: 0.875rem;
      color: var(--text-color-light);
      margin: 0;
    }
  }
}

.card-content {
  padding: 1.5rem;
}

// 进度卡片
.progress-card {
  .progress-item {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      
      .progress-name {
        font-size: 0.875rem;
        color: var(--text-color);
        font-weight: 500;
      }
      
      .progress-value {
        font-size: 0.875rem;
        color: var(--text-color-light);
        font-weight: 600;
      }
    }
    
    .progress-bar {
      height: 6px;
      background: var(--bg-color-secondary);
      border-radius: 3px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }
  }
}

// 快速访问卡片
.quick-access-card {
  .quick-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .quick-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--bg-color-hover);
      color: var(--primary-color);
    }
    
    .link-icon {
      font-size: 1.2rem;
    }
    
    .link-text {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .link-arrow {
      font-size: 1rem;
      color: var(--text-color-light);
      transition: transform 0.2s ease;
    }
    
    &:hover .link-arrow {
      transform: translateX(2px);
      color: var(--primary-color);
    }
  }
}

// 章节卡片
.chapters-card {
  .chapters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    @media (max-width: 640px) {
      gap: 0.75rem;
    }
  }
  
  .chapter-item {
    min-width: 0; // 防止溢出
    
    .chapter-link {
      display: block;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--border-color-light);
      text-decoration: none;
      color: var(--text-color);
      transition: all 0.2s ease;
      box-sizing: border-box;
      
      @media (max-width: 640px) {
        padding: 0.875rem;
      }
      
      &:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
      }
      
      .chapter-header {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        min-width: 0; // 防止溢出
        
        .chapter-icon {
          font-size: 1.5rem;
          line-height: 1;
          flex-shrink: 0; // 防止图标被压缩
        }
        
        .chapter-info {
          flex: 1;
          min-width: 0; // 防止溢出
          
          .chapter-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-color);
            margin: 0 0 0.25rem 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            
            @media (max-width: 640px) {
              font-size: 0.9rem;
            }
          }
          
          .chapter-description {
            font-size: 0.8rem;
            color: var(--text-color-light);
            margin: 0;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            
            @media (max-width: 640px) {
              font-size: 0.75rem;
              -webkit-line-clamp: 1;
            }
          }
        }
      }
      
      .chapter-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        
        .chapter-duration {
          font-size: 0.75rem;
          color: var(--text-color-muted);
          flex-shrink: 0;
        }
        
        .chapter-status {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
          flex-shrink: 0;
          
          @media (max-width: 640px) {
            padding: 0.2rem 0.4rem;
            font-size: 0.7rem;
          }
          
          &.completed {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
          }
          
          &.in-progress {
            background: rgba(59, 130, 246, 0.1);
            color: #2563eb;
          }
          
          &.pending {
            background: var(--bg-color-secondary);
            color: var(--text-color-muted);
          }
        }
      }
    }
  }
}
</style> 