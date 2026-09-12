// app/api/notes/[id]/route.ts — 笔记详情 / 状态流转
// GET：返回单篇（含正文 HTML，从存储读取；草稿仅内容权限可见）
// PATCH：状态流转（草稿→待发→发布→下线），需内容权限；记审计
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canManageContent } from "@/lib/auth";
import { getStorage } from "@/lib/storage";
import type { NoteStatus } from "@prisma/client";

type Ctx = { params: { id: string } };

export async function GET(req: Request, { params }: Ctx) {
  const session = getSession();
  const managed = canManageContent(session);
  const id = params.id;

  const note = await prisma.note.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } }, author: { select: { phone: true } } },
  });
  if (!note) return NextResponse.json({ error: "未找到" }, { status: 404 });
  // 未发布内容仅登录且有内容权限者可见
  if (note.status !== "PUBLISHED" && !managed) {
    return NextResponse.json({ error: "未发布" }, { status: 404 });
  }

  const body = await getStorage().getText(note.htmlPath);
  return NextResponse.json({ note: { ...note, body }, managed });
}

const STATUS_FLOW: Record<string, string[]> = {
  DRAFT: ["PENDING", "PUBLISHED", "OFFLINE"],
  PENDING: ["PUBLISHED", "DRAFT", "OFFLINE"],
  PUBLISHED: ["OFFLINE", "DRAFT"],
  OFFLINE: ["PUBLISHED", "DRAFT"],
};

export async function PATCH(req: Request, { params }: Ctx) {
  const session = getSession();
  if (!canManageContent(session)) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const target = body.status;
  if (!target || !["DRAFT", "PENDING", "PUBLISHED", "OFFLINE"].includes(target)) {
    return NextResponse.json({ error: "无效状态" }, { status: 400 });
  }

  const note = await prisma.note.findUnique({ where: { id: params.id } });
  if (!note) return NextResponse.json({ error: "未找到" }, { status: 404 });
  const allowed = STATUS_FLOW[note.status] ?? [];
  if (!allowed.includes(target)) {
    return NextResponse.json({ error: `不允许从 ${note.status} 流转到 ${target}` }, { status: 400 });
  }

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: {
      status: target as NoteStatus,
      publishedAt: target === "PUBLISHED" ? new Date() : target === "DRAFT" ? null : undefined,
    },
  });
  await prisma.auditLog.create({
    data: { userId: session.sub, action: "publish", targetId: note.id, meta: { from: note.status, to: target } },
  });
  return NextResponse.json({ ok: true, item: { id: updated.id, status: updated.status } });
}