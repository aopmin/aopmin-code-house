import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { gitPlugin } from '@vuepress/plugin-git'

export default defineUserConfig({
  base: '/code-house/',
  title: "aopmin的代码小屋",
  description: "Java后端、微服务、分布式技术笔记",
  bundler: viteBundler(),

  plugins: [
    gitPlugin(),
  ],

  extendsPage(page) {
    // 计算字数和阅读时间
    const content = page.content || ''
    // 去除 frontmatter 和 HTML 标签
    const text = content.replace(/---[\s\S]*?---/, '').replace(/<[^>]*>/g, '').replace(/[#*`\[\]()!>|_~{}-]/g, '')
    const wordCount = text.replace(/\s+/g, '').length
    const readingTime = Math.max(1, Math.ceil(wordCount / 300))
    page.data.wordCount = wordCount
    page.data.readingTime = readingTime
  },

  theme: recoTheme({
    logo: "/logo.png",
    author: "aopmin",
    authorAvatar: "/head.png",
    colorMode: "dark",
    // 这里仓库地址你写错了，一并修正
    docsRepo: "https://github.com/aopmin/code-house",
    docsBranch: "blog-page", // 你的部署分支是 blog-page，不是 main
    docsDir: "docs",
    lastUpdatedText: "更新时间",
    // 侧边文档分组
    series: {
      "/blogs/": [
        { text: "博客文章", children: ["/guide"] },
      ],
    },
    // 顶部导航栏
    navbar: [
      { text: "首页", link: "/" },
      { text: "导航", link: "/nav/" },
      { text: "Spring", link: "/categories/category1/1.html" },
      { text: "MyBatis", link: "/categories/category2/1.html" },
      { text: "综合", link: "/categories/reco/1.html" },
      { text: "标签", link: "/tags/tag1/1.html" },
      {
        text: "更多",
        children: [
          { text: "博客指南", link: "/blogs/other/guide" },
          { text: "主题教程", link: "/theme-reco/theme" },
          { text: "友情链接", link: "/friendship-link" },
        ],
      },
    ],
    // 首页公告栏
    bulletin: {
      body: [
        {
          type: "text",
          content: `欢迎来到我的技术博客，记录Java后端、Dubbo、Redis、Kafka实战踩坑经验`,
          style: "font-size: 12px;",
        },
        { type: "hr" },
        {
          type: "text",
          content: `<li>如有问题可在文章评论区留言交流</li>`,
          style: "font-size: 12px;",
        },
      ],
    },
  }),
});