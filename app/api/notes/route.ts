// app/api/notes/route.ts — 笔记列表（GET）
// 前台：仅 PUBLISHED；后台（登录+内容权限）：全部状态。支持 ?status= 过滤。
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canManageContent } from "@/lib/auth";
import type { Prisma, NoteStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type NoteItem = Prisma.NoteGetPayload<{
  include: {
    category: true;
    tags: { include: { tag: true } };
    author: { select: { phone: true } };
  };
}>;

export async function GET(req: Request) {
  const session = getSession();
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const managed = canManageContent(session);

  const where: Prisma.NoteWhereInput = {};
  if (status && managed) where.status = status as NoteStatus;
  else if (!managed) where.status = "PUBLISHED";

  const notes = await prisma.note.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    include: { category: true, tags: { include: { tag: true } }, author: { select: { phone: true } } },
  });

  return NextResponse.json({
    managed,
    items: notes.map((n) => serializeNote(n)),
  });
}

function serializeNote(n: NoteItem) {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    coverPath: n.coverPath,
    summary: n.summary,
    status: n.status,
    series: n.series,
    authorName: n.author?.phone,
    category: n.category ? { id: n.category.id, name: n.category.name, slug: n.category.slug } : null,
    tags: n.tags?.map((t) => t.tag.name) ?? [],
    publishedAt: n.publishedAt?.toISOString() ?? null,
    createdAt: n.createdAt.toISOString(),
  };
}