// app/login/page.tsx — 登录页（管理后台入口）
// 阶段一：手机号验证码登录。T3 后端就绪前为演示稿：
// · 「获取验证码」模拟 60s 倒计时
// · 提交先走 MOCK：提示登录成功并跳转 /admin（T3 接入 /api/auth/login 后替换）
// 设计系统：居中卡片、冷白/中性色、品牌色按钮、960px 内容区
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  // MOCK：模拟发送验证码（T3 接入 /api/auth/sms-send）
  function handleSendCode() {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入 11 位手机号");
      return;
    }
    setError("");
    let n = 60;
    setCount(n);
    const timer = setInterval(() => {
      n -= 1;
      setCount(n);
      if (n <= 0) clearInterval(timer);
    }, 1000);
  }

  // MOCK：提交登录（T3 接入 /api/auth/login 后改真实 fetch）
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入 11 位手机号");
      return;
    }
    if (code.length < 4) {
      setError("请输入验证码");
      return;
    }
    setError("");
    // T3 TODO：const res = await fetch("/api/auth/login", { method:"POST", body: JSON.stringify({ phone, code }) })
    // if (res.ok) router.push("/admin")
    router.push("/admin");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <h1 className="text-center text-2xl font-bold text-neutral-900 tracking-tight mb-1">
          渔夫阿凯的AI仓库
        </h1>
        <p className="text-center text-neutral-400 text-sm mb-8">管理后台登录</p>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-0 border border-neutral-200 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-neutral-600 mb-1.5">手机号</label>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-neutral-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1.5">验证码</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="请输入验证码"
                className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-neutral-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={count > 0}
                className="shrink-0 px-3 py-2 text-sm rounded-md border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50"
              >
                {count > 0 ? `${count}s 后重发` : "获取验证码"}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            登 录
          </button>
        </form>
      </div>
    </main>
  );
}