// app/api/site-config/route.ts — F11 站点与页面配置（GET，公开）
// 返回：站点级(siteName/siteIntro) + 各页面 pageIntro + 关于页(时间线/交流卡片)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const configs = await prisma.siteConfig.findMany();

  const site = configs.find((c) => c.pageKey === "site");
  const pageIntros: Record<string, string> = {};
  for (const c of configs) {
    if (c.pageKey !== "site" && c.pageIntro) pageIntros[c.pageKey] = c.pageIntro;
  }

  const timeline = await prisma.timelineEntry.findMany({ orderBy: { order: "asc" } });
  const contactCards = await prisma.contactCard.findMany({ orderBy: { order: "asc" } });

  return NextResponse.json({
    siteName: site?.siteName,
    siteIntro: site?.siteIntro,
    pageIntros,
    about: {
      timeline: timeline.map((t) => ({ year: t.year, title: t.title, description: t.description })),
      contactCards: contactCards.map((c) => ({ title: c.title, description: c.description, linkUrl: c.linkUrl })),
    },
  });
}