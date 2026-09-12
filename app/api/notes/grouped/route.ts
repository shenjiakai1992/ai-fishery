// app/api/notes/grouped/route.ts — F3 笔记按主题分类分组（GET，公开）
// 仅返回 PUBLISHED；空分类不返回区块；按分类 order 排序。
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type GroupedNote = Prisma.NoteGetPayload<{
  include: { category: true; tags: { include: { tag: true } } };
}>;

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
  });

  const notes = await prisma.note.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true, tags: { include: { tag: true } } },
  });

  const grouped = categories
    .map((cat) => {
      const items = notes.filter((n) => n.categoryId === cat.id);
      return items.length
        ? {
            category: { id: cat.id, name: cat.name, slug: cat.slug },
            items: items.map((n) => serializeNote(n)),
          }
        : null;
    })
    .filter(Boolean);

  return NextResponse.json({
    grouped,
    categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  });
}

function serializeNote(n: GroupedNote) {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    coverPath: n.coverPath,
    sourceTitle: n.sourceTitle,
    sourceUrl: n.sourceUrl,
    series: n.series,
    summary: n.summary,
    date: n.publishedAt
      ? n.publishedAt.toISOString().slice(0, 10).replace(/-/g, "/")
      : n.createdAt.toISOString().slice(0, 10).replace(/-/g, "/"),
    category: n.category ? { id: n.category.id, name: n.category.name, slug: n.category.slug } : null,
    tags: n.tags?.map((t) => t.tag.name) ?? [],
  };
}