// app/api/me/route.ts — 登录态探测（GET /api/me）
// 变更11：前台页脚「管理后台」入口据此显隐；AdminGuard 据此拦截。
// 返回：{ loggedIn, user?: { id, phone, role } }
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({
    loggedIn: true,
    user: { id: session.sub, phone: session.phone, role: session.role },
  });
}