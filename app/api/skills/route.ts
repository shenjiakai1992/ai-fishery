// app/api/skills/route.ts — Skill 列表（GET，公开；后台写需要认证）
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canManageContent } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SkillItem = Prisma.SkillGetPayload<{
  include: { category: true; tags: { include: { tag: true } } };
}>;

interface SkillInput {
  name?: string;
  description?: string;
  url?: string;
  categoryId?: string;
  order?: number;
}

const SKILL_INCLUDE = { category: true, tags: { include: { tag: true } } } as const;

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: [{ order: "asc" }], include: SKILL_INCLUDE });
  return NextResponse.json({ items: skills.map(ser) });
}

export async function POST(req: Request) {
  const session = getSession();
  if (!canManageContent(session)) return NextResponse.json({ error: "无权限" }, { status: 403 });

  let body: SkillInput;
  try {
    body = (await req.json()) as SkillInput;
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
  if (!body?.name || !body?.description || !body?.url) {
    return NextResponse.json({ error: "name/description/url 必填" }, { status: 400 });
  }

  const skill = await prisma.skill.create({
    data: {
      name: body.name,
      description: body.description,
      url: body.url,
      categoryId: body.categoryId || null,
      order: body.order ?? 0,
      // T3 TODO：tags 通过 SkillTag 中间表关联（body.tags）
    },
    include: SKILL_INCLUDE,
  });
  await prisma.auditLog.create({ data: { userId: session.sub, action: "submit", targetId: skill.id, meta: { kind: "skill" } } });
  return NextResponse.json({ ok: true, item: ser(skill) }, { status: 201 });
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
    order: s.order,
  };
}