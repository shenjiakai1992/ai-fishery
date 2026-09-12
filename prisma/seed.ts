// prisma/seed.ts — 数据库初始化种子数据
// 执行：pnpm db:seed（或 pnpm prisma db seed）
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始播种种子数据...");

  // ========== 1. 主题分类（8 类，中台变更9）==========
  const categories = [
    { name: "写作辅助", slug: "writing", order: 1 },
    { name: "编程开发", slug: "coding", order: 2 },
    { name: "效率提升", slug: "efficiency", order: 3 },
    { name: "创意设计", slug: "design", order: 4 },
    { name: "数据分析", slug: "data", order: 5 },
    { name: "知识检索", slug: "search", order: 6 },
    { name: "提示词工程", slug: "prompt", order: 7 },
    { name: "AI基础与趋势", slug: "ai-basics", order: 8 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
  }
  console.log(`  ✅ 主题分类：${categories.length} 个`);

  // ========== 2. 标签建议词表（25 个，PRD 4.0）==========
  const tags = [
    // AI工具
    { name: "ChatGPT", group: "AI工具" },
    { name: "Claude", group: "AI工具" },
    { name: "TRAE", group: "AI工具" },
    { name: "Cursor", group: "AI工具" },
    { name: "DeepSeek", group: "AI工具" },
    { name: "Gemini", group: "AI工具" },
    { name: "Midjourney", group: "AI工具" },
    // 技术概念
    { name: "LLM", group: "技术概念" },
    { name: "RAG", group: "技术概念" },
    { name: "Agent", group: "技术概念" },
    { name: "Token", group: "技术概念" },
    { name: "Embedding", group: "技术概念" },
    { name: "Fine-tuning", group: "技术概念" },
    { name: "API", group: "技术概念" },
    // 能力方向
    { name: "代码生成", group: "能力方向" },
    { name: "文案写作", group: "能力方向" },
    { name: "图片生成", group: "能力方向" },
    { name: "数据分析", group: "能力方向" },
    { name: "知识检索", group: "能力方向" },
    // 使用门槛
    { name: "零门槛", group: "使用门槛" },
    { name: "需配置", group: "使用门槛" },
    { name: "需编程", group: "使用门槛" },
    // 内容形式
    { name: "教程", group: "内容形式" },
    { name: "实战", group: "内容形式" },
    { name: "踩坑记录", group: "内容形式" },
  ];

  for (const t of tags) {
    await prisma.tag.upsert({
      where: { name: t.name },
      update: { group: t.group },
      create: t,
    });
  }
  console.log(`  ✅ 标签：${tags.length} 个`);

  // ========== 3. 站点与页面配置（F11）==========
  // 站点级（1 条）
  await prisma.siteConfig.upsert({
    where: { pageKey: "site" },
    update: {},
    create: {
      pageKey: "site",
      siteName: "渔夫阿凯的AI仓库",
      siteIntro: "一个 AI 学习者的杂货铺，学到的好东西、踩的坑、随手记的想法都往里扔。",
    },
  });

  // 页面级（5 条，仅 pageIntro）
  const pageIntros = [
    { pageKey: "home", pageIntro: "最新笔记，看看最近在折腾什么。" },
    { pageKey: "notes", pageIntro: "按主题分类整理的学习笔记。" },
    { pageKey: "skills", pageIntro: "好用的 AI Skill 推荐与自开发工具。" },
    { pageKey: "services", pageIntro: "我开发的 AI 相关服务与产品。" },
    { pageKey: "about", pageIntro: "关于渔夫阿凯，以及怎么联系我。" },
  ];

  for (const p of pageIntros) {
    await prisma.siteConfig.upsert({
      where: { pageKey: p.pageKey },
      update: { pageIntro: p.pageIntro },
      create: p,
    });
  }
  console.log(`  ✅ 站点配置：1 站点级 + ${pageIntros.length} 页面级`);

  // ========== 4. 关于页时间线（初始 3 条）==========
  const timelines = [
    { year: 2024, title: "开始系统学习 AI", description: "从 LLM 基础概念入手，接触 ChatGPT、Claude 等工具。", order: 1 },
    { year: 2025, title: "用 AI 做产品", description: "尝试把 AI 融入实际工作流，沉淀第一个 AI 辅助编程项目。", order: 2 },
    { year: 2026, title: "建仓库分享", description: "搭建这个站点，把学习笔记和实战经验系统化沉淀。", order: 3 },
  ];

  // 先清空再重建（简单幂等）
  await prisma.timelineEntry.deleteMany();
  for (const t of timelines) {
    await prisma.timelineEntry.create({ data: t });
  }
  console.log(`  ✅ 关于页时间线：${timelines.length} 条`);

  // ========== 5. 关于页交流入口卡片（初始 3 张）==========
  const contacts = [
    { title: "微信交流", description: "加好友请备注「AI仓库」", linkUrl: "#", order: 1 },
    { title: "GitHub", description: "看看我的代码仓库", linkUrl: "https://github.com/", order: 2 },
    { title: "邮箱", description: "有合作或想法欢迎邮件", linkUrl: "mailto:hello@example.com", order: 3 },
  ];

  await prisma.contactCard.deleteMany();
  for (const c of contacts) {
    await prisma.contactCard.create({ data: c });
  }
  console.log(`  ✅ 交流入口卡片：${contacts.length} 张`);

  // ========== 6. 管理员账号（白名单手机号）==========
  const adminPhones = (process.env.ADMIN_WHITELIST_PHONES || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (adminPhones.length > 0) {
    for (const phone of adminPhones) {
      await prisma.user.upsert({
        where: { phone },
        update: { role: Role.ADMIN, status: "ACTIVE" },
        create: {
          phone,
          name: phone === adminPhones[0] ? "渔夫阿凯" : `协作者-${phone.slice(-4)}`,
          role: Role.ADMIN,
          status: "ACTIVE",
        },
      });
    }
    console.log(`  ✅ 管理员账号：${adminPhones.length} 个（${adminPhones.join(", ")}）`);
  } else {
    console.log("  ⚠️  未设置 ADMIN_WHITELIST_PHONES，跳过管理员账号创建");
  }

  console.log("\n🎉 种子数据播种完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
