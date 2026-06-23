<template>
  <GenericContainer width-style="full" class="timeline-wrapper">
    <div class="milestone-page">
      <!-- 左侧：炫酷时间轴 -->
      <main class="timeline-main">
        <header class="timeline-header">
          <h1 class="timeline-title">
            <span class="title-icon">⏳</span>
            时间轴
            <span class="title-sub">Timeline</span>
          </h1>
          <p class="timeline-desc">记录 {{ posts.length }} 篇文章的成长轨迹</p>
        </header>

        <div class="timeline-list">
          <div class="timeline-line"></div>
          <ul class="timeline-content">
            <li
              v-for="(item, index) in timelineData"
              :key="item.year"
              class="timeline-year-group"
              :style="{ animationDelay: index * 0.12 + 's' }"
            >
              <div class="year-marker">
                <span class="year-dot"></span>
                <h2 class="year-label">{{ item.year }}</h2>
                <span class="year-count">{{ item.data.length }} 篇</span>
              </div>

              <ul class="year-posts">
                <li
                  v-for="(post, pidx) in item.data"
                  :key="pidx"
                  class="post-card"
                  :style="{ animationDelay: (index * 0.12 + pidx * 0.06) + 's' }"
                >
                  <span class="post-date">{{ post.date }}</span>
                  <RouterLink class="post-title" :to="post.path">{{ post.title }}</RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </main>

      <!-- 右侧面板 -->
      <aside class="sidebar-panel">
        <div class="sidebar-card">
          <div class="avatar-wrap">
            <div class="avatar-ring"></div>
            <img class="avatar-img" :src="withBase('/head.png')" alt="avatar" />
          </div>
          <h2 class="author-name">{{ themeData.author || 'aopmin' }}</h2>
          <p class="author-bio">童话是一种生活态度，仅此而已。</p>

          <div class="stats-grid">
            <RouterLink to="/posts.html" class="stat-item stat-link">
              <span class="stat-number">{{ posts.length }}</span>
              <span class="stat-label">文章</span>
            </RouterLink>
            <RouterLink v-if="firstCategoryLink" :to="firstCategoryLink" class="stat-item stat-link">
              <span class="stat-number">{{ categoryCount }}</span>
              <span class="stat-label">分类</span>
            </RouterLink>
            <div v-else class="stat-item">
              <span class="stat-number">{{ categoryCount }}</span>
              <span class="stat-label">分类</span>
            </div>
            <RouterLink v-if="firstTagLink" :to="firstTagLink" class="stat-item stat-link">
              <span class="stat-number">{{ tagCount }}</span>
              <span class="stat-label">标签</span>
            </RouterLink>
            <div v-else class="stat-item">
              <span class="stat-number">{{ tagCount }}</span>
              <span class="stat-label">标签</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ timelineCount }}</span>
              <span class="stat-label">时间轴</span>
            </div>
          </div>

          <div class="sidebar-links">
            <RouterLink to="/" class="side-link">🏠 回到首页</RouterLink>
            <RouterLink to="/posts.html" class="side-link">📄 所有文章</RouterLink>
          </div>
        </div>
      </aside>
    </div>
  </GenericContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { useExtendPageData } from '@vuepress-reco/vuepress-plugin-page/composables'
import { useThemeData } from '@vuepress/plugin-theme-data/client'
import GenericContainer from '@components/GenericContainer/index.vue'

const formatISODate = (ISODate = '') => {
  const dateStr = ISODate.replace('T', ' ').replace('Z', '').split('.')[0]
  return dateStr.replace(/(\s00:00:00)$/, '')
}

const { posts, categorySummary } = useExtendPageData()
const themeData = useThemeData()

const categoryCount = computed(() => Object.keys(categorySummary || {}).length)

const firstCategoryLink = computed(() => {
  const keys = Object.keys(categorySummary || {})
  if (!keys.length) return ''
  const catKey = keys[0]
  const items = categorySummary[catKey]?.items || {}
  const firstVal = Object.values(items)[0] as any
  if (firstVal?.categoryValue) return `/categories/${firstVal.categoryValue}/1.html`
  return ''
})

const tagCount = computed(() => {
  const tags = new Set<string>()
  posts.forEach((p: any) => {
    const t = p.frontmatter?.tags
    if (Array.isArray(t)) t.forEach((tag: string) => tags.add(tag))
    else if (typeof t === 'string') tags.add(t)
  })
  return tags.size
})

const firstTagLink = computed(() => {
  const tags = new Set<string>()
  posts.forEach((p: any) => {
    const t = p.frontmatter?.tags
    if (Array.isArray(t)) t.forEach((tag: string) => tags.add(tag))
    else if (typeof t === 'string') tags.add(t)
  })
  const first = [...tags][0]
  return first ? `/tags/${first}/1.html` : ''
})

const timelineCount = computed(() => posts.filter((p: any) => p.frontmatter?.date).length)

const dataMap: Record<string, any[]> = {}
posts.forEach((post: any) => {
  if (!post.frontmatter?.date) return
  const connector = post.frontmatter.date.includes('/') ? '/' : '-'
  const [year, month, day] = (formatISODate(post.frontmatter.date).split(' ')[0] || '').split(connector)
  if (!year || !month || !day) return
  if (!dataMap[year]) {
    dataMap[year] = [{ ...post, date: `${month}${connector}${day}` }]
    return
  }
  dataMap[year].push({ ...post, date: `${month}${connector}${day}` })
})

const timelineData = computed(() =>
  Object.keys(dataMap)
    .sort((a, b) => Number(b) - Number(a))
    .map(year => ({ year, data: dataMap[year] }))
)
</script>

<style>
/* ========== 外层覆盖 ========== */
.timeline-wrapper .theme-main {
  max-width: 100% !important;
  padding: 0 !important;
  display: block !important;
}

/* ========== 页面整体 ========== */
.milestone-page {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - var(--navbar-height, 60px));
  background: var(--c-bg);
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

/* ========== 左侧时间轴（炫酷版） ========== */
.timeline-main {
  flex: 1;
  padding: 40px 40px 80px;
}

.timeline-header {
  margin-bottom: 40px;
  text-align: center;
}
.timeline-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--c-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.title-icon { font-size: 1.5rem; }
.title-sub {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--c-text-lighter);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-left: 4px;
}
.timeline-desc {
  margin: 6px 0 0;
  color: var(--c-text-lighter);
  font-size: 0.85rem;
}

/* 时间轴容器 */
.timeline-list {
  position: relative;
  padding-left: 36px;
}

/* 发光竖线 */
.timeline-line {
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(180deg,
    var(--reco-primary, #3b82f6) 0%,
    #6366f1 25%,
    #10b981 50%,
    #f59e0b 75%,
    var(--reco-primary, #3b82f6) 100%);
  background-size: 100% 200%;
  animation: line-glow 6s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}
@keyframes line-glow {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 0% 100%; }
}

.timeline-content {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 年份组 */
.timeline-year-group {
  position: relative;
  margin-bottom: 32px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 年份标记 */
.year-marker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
}
.year-dot {
  position: absolute;
  left: -36px;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--reco-primary, #3b82f6), #6366f1);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
  z-index: 2;
  animation: dot-pulse 3s ease-in-out infinite;
}
@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.5); }
  50%      { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 32px rgba(99, 102, 241, 0.3); }
}
.year-label {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-text);
}
.year-count {
  font-size: 0.75rem;
  color: var(--c-text-lighter);
  background: var(--c-bg-lightest, rgba(128, 128, 128, 0.06));
  padding: 2px 8px;
  border-radius: 8px;
}

/* 文章列表 */
.year-posts {
  list-style: none;
  padding: 0;
  margin: 0 0 0 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.post-card {
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--c-bg-lightest, rgba(128, 128, 128, 0.03));
  border: 1px solid transparent;
  transition: all 0.25s ease;
}
.post-card:hover {
  background: var(--c-bg-light, rgba(128, 128, 128, 0.06));
  border-color: rgba(59, 130, 246, 0.15);
  transform: translateX(4px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.post-date {
  min-width: 44px;
  font-size: 0.78rem;
  color: var(--c-text-lighter);
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.post-title {
  font-size: 0.9rem;
  color: var(--c-text);
  text-decoration: none;
  transition: color 0.2s;
}
.post-card:hover .post-title {
  color: var(--reco-primary, #3b82f6);
}

/* ========== 右侧面板 ========== */
.sidebar-panel {
  width: 270px;
  min-width: 270px;
  position: sticky;
  top: var(--navbar-height, 60px);
  height: calc(100vh - var(--navbar-height, 60px));
  overflow-y: auto;
  border-left: 1px solid var(--c-border, rgba(148, 163, 184, 0.1));
  background: var(--c-bg);
  padding: 36px 18px 24px;
  box-sizing: border-box;
  z-index: 5;
}

.sidebar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.avatar-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  margin-bottom: 6px;
}
.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--reco-primary, #3b82f6), #10b981, #6366f1, #f59e0b, var(--reco-primary, #3b82f6));
  animation: ring-spin 4s linear infinite;
}
.avatar-img {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--c-bg);
  z-index: 1;
}
@keyframes ring-spin { to { transform: rotate(360deg); } }

.author-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-text);
}
.author-bio {
  margin: 0;
  font-size: 0.78rem;
  color: var(--c-text-lighter);
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  margin: 14px 0 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  border-radius: 10px;
  background: var(--c-bg-lightest, rgba(128, 128, 128, 0.05));
  border: 1px solid var(--c-border, rgba(128, 128, 128, 0.06));
  transition: all 0.25s;
}
.stat-link {
  text-decoration: none;
  cursor: pointer;
}
.stat-item:hover {
  background: rgba(59, 130, 246, 0.07);
  border-color: rgba(59, 130, 246, 0.18);
  transform: translateY(-1px);
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--reco-primary, #3b82f6), #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.stat-label {
  font-size: 0.7rem;
  color: var(--c-text-lighter);
  margin-top: 2px;
}

/* 侧边链接 */
.sidebar-links {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.side-link {
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--c-text-light);
  text-decoration: none;
  transition: all 0.2s;
  background: var(--c-bg-lightest, rgba(128, 128, 128, 0.03));
  border: 1px solid var(--c-border, rgba(128, 128, 128, 0.05));
}
.side-link:hover {
  color: var(--reco-primary, #3b82f6);
  background: rgba(59, 130, 246, 0.07);
  border-color: rgba(59, 130, 246, 0.18);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .milestone-page { flex-direction: column; }
  .sidebar-panel {
    width: 100%;
    min-width: unset;
    height: auto;
    position: relative;
    top: 0;
    padding: 20px 16px;
    border-left: none;
    border-top: 1px solid var(--c-border);
  }
  .stats-grid { max-width: 280px; margin: 14px auto 16px; }
  .timeline-main { padding: 20px 16px 60px 28px; }
  .timeline-title { font-size: 1.3rem; }
}
</style>
