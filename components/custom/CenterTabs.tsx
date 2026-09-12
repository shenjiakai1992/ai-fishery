// components/custom/CenterTabs.tsx — 居中 Tab 导航（吸顶）
// 变更11：前台无顶部导航条，站名由 Hero 承载；Tab 吸顶 sticky；移动端 flex-wrap 换行不做汉堡
import Link from "next/link";

export interface TabItem {
  key: string;
  label: string;
  href: string;
}

const TABS: TabItem[] = [
  { key: "notes", label: "笔记分享", href: "/category" },
  { key: "skills", label: "Skill推荐", href: "/skills" },
  { key: "services", label: "AI服务", href: "/services" },
  { key: "about", label: "关于我", href: "/about" },
];

export default function CenterTabs({ active }: { active?: string }) {
  return (
    <nav className="sticky top-0 z-50 bg-neutral-0 border-b border-neutral-100">
      <div className="content-container flex justify-center flex-wrap gap-8 md:gap-8 py-4">
        {TABS.map((tab) => {
          // 首页也把「笔记分享」设为激活态
          const isActive = active ? tab.key === active : (tab.href === "/category" && active === undefined);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`text-2xl font-bold whitespace-nowrap pb-2 border-b-[3px] transition-colors ${
                isActive
                  ? "text-neutral-900 border-brand-500"
                  : "text-neutral-400 border-transparent hover:text-brand-600"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}