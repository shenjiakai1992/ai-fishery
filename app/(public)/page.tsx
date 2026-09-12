// app/(public)/page.tsx — 首页：最新笔记 + 查看更多
import Link from "next/link";
import NoteCard from "@/components/custom/NoteCard";
import { notes, pageIntros } from "@/lib/data";

export default function HomePage() {
  // 首页展示最新 10 篇（MOCK 展示全部）
  const latest = notes.slice(0, 10);

  return (
    <>
      {/* 页面简介（F11 页面级配置，Tab 下方） */}
      <p className="content-container text-center text-neutral-600 pt-6 pb-12">{pageIntros.home}</p>

      <section className="content-container pb-20">
        <div className="flex items-baseline justify-between mb-7">
          <span className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">最新笔记</span>
          <span className="text-sm text-neutral-400">{latest.length} 篇</span>
        </div>

        {latest.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p>仓库还是空的，好货马上就来。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latest.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/category"
            className="inline-flex items-center gap-1 text-[15px] font-medium text-link px-4 py-2 rounded-md hover:bg-brand-50"
          >
            查看更多 →
          </Link>
        </div>
      </section>
    </>
  );
}