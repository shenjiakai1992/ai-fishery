// app/api/uploads/route.ts — F8 上传笔记 HTML（POST，需内容权限）
// 流程（中台变更5）：解析 <head> 的 note:* meta → 存储原始 HTML → 返回解析结果供后台表单预填
// 中台变更12：正文相对路径图片随传（当前先列出 img src，随传逻辑在确认步骤实现）
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canManageContent } from "@/lib/auth";
import { getStorage } from "@/lib/storage";
import { parseNoteMeta, extractImageSrcs } from "@/lib/html";

export async function POST(req: Request) {
  const session = getSession();
  if (!canManageContent(session)) return NextResponse.json({ error: "无权限" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请上传 HTML 文件" }, { status: 400 });
  }
  if (!/\.html?$/i.test(file.name)) {
    return NextResponse.json({ error: "仅支持 .html 文件" }, { status: 400 });
  }

  const html = await file.text();
  const meta = parseNoteMeta(html);
  const embeddedImages = extractImageSrcs(html).filter((src) => !/^(https?:)?\/\//i.test(src));

  // 存储原始 HTML（确认信息后再最终落库/回写）
  const storageKey = `notes/raw/${Date.now()}-${file.name}`;
  const saved = await getStorage().putText(storageKey, html);

  await prisma.auditLog.create({
    data: { userId: session.sub, action: "upload", targetId: storageKey, meta: { fileName: file.name } },
  });

  return NextResponse.json(
    {
      ok: true,
      storageKey,
      url: saved.url,
      meta,
      embeddedImages, // 待确认步骤随传
    },
    { status: 201 },
  );
}