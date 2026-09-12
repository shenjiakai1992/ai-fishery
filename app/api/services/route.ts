// app/api/services/route.ts — AI 服务（GET，公开全量；F5 无分类不分块）
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canManageContent } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type ServiceItem = Prisma.ServiceGetPayload<{ include: { tags: { include: { tag: true } } } }>;

interface ServiceInput {
  name?: string;
  description?: string;
  url?: string;
  status?: "DEVELOPING" | "BETA" | "LIVE";
  order?: number;
}

const SERVICE_INCLUDE = { tags: { include: { tag: true } } } as const;

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: [{ order: "asc" }], include: SERVICE_INCLUDE });
  return NextResponse.json({ items: services.map(ser) });
}

export async function POST(req: Request) {
  const session = getSession();
  if (!canManageContent(session)) return NextResponse.json({ error: "无权限" }, { status: 403 });

  let body: ServiceInput;
  try {
    body = (await req.json()) as ServiceInput;
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
  if (!body?.name || !body?.description || !body?.url) {
    return NextResponse.json({ error: "name/description/url 必填" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      name: body.name,
      description: body.description,
      url: body.url,
      status: body.status ?? "DEVELOPING",
      order: body.order ?? 0,
      // T3 TODO：ServiceTag 关联 body.tags
    },
    include: SERVICE_INCLUDE,
  });
  await prisma.auditLog.create({ data: { userId: session.sub, action: "submit", targetId: service.id, meta: { kind: "service" } } });
  return NextResponse.json({ ok: true, item: ser(service) }, { status: 201 });
}

function ser(s: ServiceItem) {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    url: s.url,
    coverPath: s.coverPath,
    status: s.status,
    order: s.order,
    tags: s.tags?.map((t) => t.tag.name) ?? [],
  };
}