// lib/data.ts — 前端演示数据层（MOCK）
// 说明：数据库/migrate 尚未跑通前，前台页面用本文件演示数据渲染。
// T3 后端 API 就绪后，各页面改用 fetch('/api/...') 替换，本文件保留作回退/离线演示。
// 数据结构对齐 prisma/schema.prisma 中的模型字段。

// ---------- 站点级配置（F11：pageKey='site'） ----------
export const site = {
  siteName: "渔夫阿凯的AI仓库",
  siteIntro:
    "一个普通人用 AI 学 AI 的杂货铺。学到的好东西、踩的坑、随手记的想法都往里扔。",
};

// ---------- 页面级配置（F11：各页面 pageIntro） ----------
export type PageKey = "home" | "notes" | "skills" | "services" | "about";

export const pageIntros: Record<PageKey, string> = {
  home: "最新笔记，看看最近在折腾什么。",
  notes: "按主题分类打捞感兴趣的学习笔记。",
  skills: "好用的 Skill，让 AI 更懂你要什么。",
  services: "我开发或参与的一些 AI 服务与产品。",
  about: "关于渔夫阿凯，以及怎么联系我。",
};

// ---------- 主题分类（8 类） ----------
export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string; // 区块标题圆点色（设计系统 1.5）
}

export const categories: Category[] = [
  { id: "w", name: "写作辅助", slug: "writing", color: "#0EA5E9" },
  { id: "c", name: "编程开发", slug: "coding", color: "#3B82F6" },
  { id: "e", name: "效率提升", slug: "efficiency", color: "#06B6D4" },
  { id: "d", name: "创意设计", slug: "design", color: "#8B5CF6" },
  { id: "a", name: "数据分析", slug: "data", color: "#14B8A6" },
  { id: "k", name: "知识检索", slug: "search", color: "#6366F1" },
  { id: "p", name: "提示词工程", slug: "prompt", color: "#2563EB" },
  { id: "b", name: "AI基础与趋势", slug: "ai-basics", color: "#475569" },
];

// ---------- 笔记 ----------
export interface Note {
  id: string;
  title: string;
  slug: string;
  coverPath?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  category?: Category;
  series?: string;
  tags: string[];
  summary: string;
  date: string; // 展示用日期
  /** 笔记详情正文（MOCK：演示一段 HTML；T3 后改为从上传的 HTML 读取） */
  bodyHtml?: string;
}

const MOCK_BODY = `
<h2>为什么想建这个站</h2>
<p>学 AI 的过程中，我发现很多灵感都散落在聊天记录和本地文件里。与其让它们过期，不如建一个自己的小仓库，把学到的东西、踩过的坑、随手记的想法都存下来。</p>
<p>这个站本身也是学习案例：从需求、PRD、原型到前后端开发，完整走一遍 AI 协作做产品的流程。</p>
<h2>第一步：明确需求</h2>
<p>不要急着写代码。先想清楚三件事：这个站给谁看、要解决什么问题、第一阶段必须有什么功能。</p>
<ul><li>受众：对 AI 感兴趣但不知道从何下手的人。</li><li>问题：内容分散、个人品牌弱。</li><li>MVP：能发笔记、能看笔记、有个关于页。</li></ul>
<blockquote>好的设计不是堆效果，而是让读者一眼就能找到想读的内容。</blockquote>
`;

export const notes: Note[] = [
  {
    id: "n1",
    title: "用 TRAE 从零搭一个个人网站",
    slug: "build-website-with-trae",
    coverPath: "/uploads/demo/trae-website.jpg",
    sourceTitle: "TRAE 官方文档",
    category: categories[1],
    tags: ["TRAE", "教程"],
    summary: "从需求沟通到页面原型，记录第一次用 AI 协作完成网站设计的完整过程。",
    date: "2026/09/03",
    bodyHtml: MOCK_BODY,
  },
  {
    id: "n2",
    title: "Prompt 工程里最容易被忽略的 5 个细节",
    slug: "prompt-engineering-5-details",
    coverPath: "/uploads/demo/prompt.jpg",
    sourceTitle: "oiloil.org 设计参考",
    category: categories[6],
    tags: ["Prompt", "提示词"],
    summary: "不是模板堆得越多效果越好，这几个细节决定了一次对话能不能用。",
    date: "2026/09/01",
    bodyHtml: MOCK_BODY,
  },
  {
    id: "n3",
    title: "深入理解 Transformer 的注意力机制",
    slug: "transformer-attention",
    coverPath: "/uploads/demo/transformer.jpg",
    category: categories[7],
    tags: ["LLM", "Transformer"],
    summary: "从向量、矩阵到 Q/K/V，把 Self-Attention 拆成能动手算的步骤。",
    date: "2026/08/28",
    bodyHtml: MOCK_BODY,
  },
  {
    id: "n4",
    title: "我常用的 8 个 AI 搜索技巧",
    slug: "8-ai-search-tips",
    coverPath: "/uploads/demo/ai-search.jpg",
    category: categories[5],
    tags: ["AI搜索", "效率"],
    summary: "不花钱也能让搜索结果更准，适合日常查资料、找论文、追热点。",
    date: "2026/08/25",
    bodyHtml: MOCK_BODY,
  },
  {
    id: "n5",
    title: "Midjourney 出图效率翻倍的流程",
    slug: "midjourney-workflow",
    coverPath: "/uploads/demo/midjourney.jpg",
    category: categories[3],
    tags: ["Midjourney", "图片生成"],
    summary: "从参考图收集、提示词结构到迭代出图，形成一套稳定的工作流。",
    date: "2026/08/20",
    bodyHtml: MOCK_BODY,
  },
];

// 分类 → 笔记（F3：按主题分类分组；空分类不显示）
export function getNotesGroupedByCategory(): { category: Category; items: Note[] }[] {
  return categories
    .map((cat) => ({
      category: cat,
      items: notes.filter((n) => n.category?.id === cat.id),
    }))
    .filter((g) => g.items.length > 0);
}

// ---------- Skill 推荐（F4） ----------
export interface Skill {
  id: string;
  name: string;
  description: string;
  url: string;
  category?: Category;
  tags: string[];
}

export const skills: Skill[] = [
  {
    id: "s1",
    name: "学习笔记 Skill",
    description: "把任何材料整理成结构化学习笔记。",
    url: "https://example.com/learning-notes",
    category: categories[5],
    tags: ["知识检索", "笔记"],
  },
  {
    id: "s2",
    name: "Prompt 优化器",
    description: "帮你把一段指令打磨成更稳定好用的提示词。",
    url: "https://example.com/prompt-optimizer",
    category: categories[6],
    tags: ["提示词"],
  },
  {
    id: "s3",
    name: "封面生成器",
    description: "根据文章主题自动生成冷色调封面图。",
    url: "https://example.com/cover-generator",
    category: categories[3],
    tags: ["图片生成"],
  },
];

// ---------- AI 服务（F5，无分类，仅标签） ----------
export interface Service {
  id: string;
  name: string;
  description: string;
  url: string;
  status: "DEVELOPING" | "BETA" | "LIVE";
  tags: string[];
}

export const services: Service[] = [
  {
    id: "sv1",
    name: "笔记仓库托管",
    description: "把学习笔记发布成带设计系统的独立页面。",
    url: "https://example.com",
    status: "BETA",
    tags: ["网页应用"],
  },
  {
    id: "sv2",
    name: "内容助手",
    description: "一个帮你把杂笔记整理成文章的助手服务。",
    url: "https://example.com",
    status: "LIVE",
    tags: ["API服务"],
  },
];

// ---------- 关于页（F6） ----------
export const profileIntro =
  "嘿，我是渔夫阿凯。这个仓库是我的 AI 学习杂货铺。学到的好东西、踩的坑、随手记的想法都往里扔。活儿让 AI 干，省下时间咱们摸鱼。欢迎和我一起学，有什么好玩的，也欢迎告诉我。";

export const timeline = [
  { year: 2024, title: "开始系统学习 AI", description: "从 LLM 基础概念入手，接触 OpenAI 等工具。" },
  { year: 2025, title: "用 AI 做产品", description: "尝试把 AI 融入实际工作流，沉淀第一个 AI 辅助编程项目。" },
  { year: 2026, title: "建仓库分享", description: "搭建这个站点，把学习笔记和实战经验系统化沉淀。" },
];

export const contactCards = [
  { title: "微信交流", description: "加好友请备注「AI仓库」", linkUrl: "#" },
  { title: "GitHub", description: "看看我的代码仓库", linkUrl: "https://github.com/" },
  { title: "邮箱", description: "有合作或想法欢迎邮件", linkUrl: "mailto:hello@example.com" },
];

// ---------- 工具 ----------
export function getCategoryColor(slug?: string): string {
  const c = categories.find((x) => x.slug === slug);
  return c ? c.color : "#3B82F6";
}