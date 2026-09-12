// middleware.ts — 后台路由鉴权拦截（Edge）
// 说明：Edge 运行时无法用 node 版 jsonwebtoken 校验，故此处做「会话 Cookie 存在性」预检：
// · 无 Cookie → 直接跳 /login
// · 有 Cookie → 放行，真实签名/有效期校验交由 /api/me（node 运行时）与 AdminGuard 兜底
// T3 TODO：如需 Edge 端完整验签，改用 @panva/jose 签发+校验，与 lib/auth.ts 保持一致
import { NextResponse, type NextRequest } from "next/server";

// 与 lib/auth.ts 的 SESSION_COOKIE 保持一致；此处独立定义避免把 node 库引入 edge bundle
const SESSION_COOKIE = "ai_fishery_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin 全部需要登录
  if (pathname.startsWith("/admin")) {
    const hasCookie = req.cookies.has(SESSION_COOKIE);
    if (!hasCookie) {
      const login = req.nextUrl.clone();
      login.pathname = "/login";
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};