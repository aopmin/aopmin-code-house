import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  title: "aopmin的代码小屋",
  description: "Java后端、微服务、分布式技术笔记",
  bundler: viteBundler(),
  theme: recoTheme({
    logo: "/logo.png",
    author: "aopmin",
    authorAvatar: "/head.png",
    colorMode: "dark",
    docsRepo: "https://github.com/你的github账号/aopmin-code-house",
    docsBranch: "main",
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