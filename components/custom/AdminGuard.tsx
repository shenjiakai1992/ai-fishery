// components/custom/AdminGuard.tsx — 后台登录态守卫（客户端）
// T4 占位：调用 /api/me 判断登录态；未登录提示并跳转 /login。
// T3 后端就绪后：middleware 做服务端拦截，本组件负责前端交互层兜底。
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.loggedIn) setState("ok");
        else setState("denied");
      })
      .catch(() => setState("denied"));
  }, []);

  if (state === "loading") {
    return <p className="p-8 text-sm text-neutral-400">加载中…</p>;
  }

  if (state === "denied") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-neutral-600">需要登录后才能进入管理后台</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 rounded-md bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          去登录
        </button>
      </div>
    );
  }

  return <>{children}</>;
}