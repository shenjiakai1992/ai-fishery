// app/api/skills/grouped/route.ts — F4 Skill 按主题分类分组（GET，公开）
// 有分类的按分类分组；未分类放末尾。
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SkillItem = Prisma.SkillGetPayload<{
  include: { category: true; tags: { include: { tag: true } } };
}>;

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });
  const skills = await prisma.skill.findMany({
    orderBy: [{ order: "asc" }],
    include: { category: true, tags: { include: { tag: true } } },
  });

  const grouped = categories
    .map((cat) => {
      const items = skills.filter((s) => s.categoryId === cat.id);
      return items.length ? { category: { id: cat.id, name: cat.name, slug: cat.slug }, items: items.map(ser) } : null;
    })
    .filter(Boolean);

  const uncategorized = skills.filter((s) => !s.categoryId);

  return NextResponse.json({ grouped, uncategorized: uncategorized.map(ser) });
}

function ser(s: SkillItem) {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    url: s.url,
    coverPath: s.coverPath,
    category: s.category ? { id: s.category.id, name: s.category.name, slug: s.category.slug } : null,
    tags: s.tags?.map((t) => t.tag.name) ?? [],
  };
}