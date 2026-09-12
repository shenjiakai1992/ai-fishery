// lib/auth.ts — 认证与会话（JWT + HttpOnly Cookie）
// 阶段一：手机号验证码登录。登录成功后签发 JWT，写入 HttpOnly Cookie（httpOnly+sameSite=lax+secure生产）。
// 权限（中台变更8）：ADMIN（全权限）/COLLABORATOR（内容同权，仅无用户管理）。
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getEnv } from "./env";

export type Role = "ADMIN" | "COLLABORATOR";

export interface Session {
  sub: string; // User.id
  phone: string;
  role: Role;
}

export const SESSION_COOKIE = "ai_fishery_session";

// ---------- 签发 / 校验 ----------

export function signToken(session: Session): string {
  const env = getEnv();
  const options = { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions;
  return jwt.sign(session, env.JWT_SECRET, options);
}

export function verifyToken(token: string): Session | null {
  try {
    const payload = jwt.verify(token, getEnv().JWT_SECRET) as jwt.JwtPayload;
    if (typeof payload?.sub !== "string") return null;
    return {
      sub: payload.sub,
      phone: typeof payload.phone === "string" ? payload.phone : "",
      role: ((payload.role as Session["role"]) ?? "COLLABORATOR"),
    };
  } catch {
    return null;
  }
}

// ---------- Cookie 读写（服务端） ----------

/** 建立会话：返回可直接 set 的 cookie 字符串 */
export function createSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${86400 * 7}${
    secure ? "; Secure" : ""
  }`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/** 从当前请求的 cookie 中解析会话；无/失效返回 null */
export function getSession(): Session | null {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ---------- 权限判断（中台变更8） ----------

/** 是否具备内容操作权限：ADMIN 与 COLLABORATOR 同权 */
export function canManageContent(session: Session | null): session is Session {
  return session !== null && (session.role === "ADMIN" || session.role === "COLLABORATOR");
}

/** 是否管理员（唯一有用户管理权限） */
export function isAdmin(session: Session | null): session is Session {
  return session !== null && session.role === "ADMIN";
}