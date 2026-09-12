// app/admin/layout.tsx — 后台外壳布局
// T4 占位：顶部后台条 + 侧边导航（笔记/Skill/AI服务/标签/埋点/站点配置）
// 登录态拦截（走 /api/me）；T3 middleware 加一层服务端兜底
import Link from "next/link";
import AdminGuard from "@/components/custom/AdminGuard";

const NAV = [
  { href: "/admin", label: "概览" },
  { href: "/admin/notes", label: "笔记管理" },
  { href: "/admin/skills", label: "Skill管理" },
  { href: "/admin/services", label: "AI服务管理" },
  { href: "/admin/tags", label: "标签管理" },
  { href: "/admin/analytics", label: "埋点看板" },
  { href: "/admin/site", label: "站点配置" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* 顶部条：返回前台 + 用户 */}
      <header className="h-14 bg-neutral-900 text-white flex items-center px-6 justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold tracking-tight">渔夫阿凯的管理后台</span>
          <Link href="/" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
            ← 返回前台
          </Link>
        </div>
        <span className="text-[13px] text-neutral-400">管理员</span>
      </header>

      <div className="flex flex-1">
        {/* 侧边导航 */}
        <aside className="w-52 shrink-0 bg-neutral-0 border-r border-neutral-100 py-4 hidden md:block">
          <nav className="space-y-1 px-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-[15px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 内容 */}
        <main className="flex-1">
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>
    </div>
  );
}