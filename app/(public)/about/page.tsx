// app/(public)/about/page.tsx — F6 关于页：简介/时间线/交流入口（F11 配置动态渲染）
import { profileIntro, timeline, contactCards, pageIntros } from "@/lib/data";

export const metadata = {
  title: "关于我 - 渔夫阿凯的AI仓库",
};

export default function AboutPage() {
  return (
    <>
      <p className="content-container text-center text-neutral-600 pt-6 pb-12">{pageIntros.about}</p>
      <main className="content-container pb-20 space-y-16">
        {/* 个人介绍 */}
        <section>
          <p className="text-lg leading-relaxed text-neutral-600">{profileIntro}</p>
        </section>

        {/* 时间线 */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-neutral-900 tracking-tight">时间线</h2>
          <div className="space-y-6">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-6">
                <div className="w-20 shrink-0 text-right">
                  <span className="font-bold text-neutral-900">{t.year}</span>
                </div>
                <div className="border-l-2 border-neutral-100 pl-6 pb-2">
                  <h3 className="font-semibold text-neutral-900 mb-1">{t.title}</h3>
                  <p className="text-[15px] text-neutral-600">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 交流入口卡片 */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-neutral-900 tracking-tight">交流</h2>
          <div className="flex flex-col gap-4">
            {contactCards.map((c) => (
              <a
                key={c.title}
                href={c.linkUrl}
                className="block bg-neutral-0 border border-neutral-200 rounded-lg p-6 transition-colors hover:bg-brand-50 hover:border-brand-200"
              >
                <h3 className="font-semibold text-neutral-900 mb-1">{c.title}</h3>
                <p className="text-[15px] text-neutral-600">{c.description}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}