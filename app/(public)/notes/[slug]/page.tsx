// app/(public)/notes/[slug]/page.tsx — F2 笔记详情页（独立阅读体验，不走统一 Tab）
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/custom/Footer";
import { notes } from "@/lib/data";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props) {
  const note = notes.find((n) => n.slug === params.slug);
  if (!note) return { title: "笔记不存在 - 渔夫阿凯的AI仓库" };
  return { title: `${note.title} - 渔夫阿凯的AI仓库` };
}

export default function NoteDetailPage({ params }: Props) {
  const note = notes.find((n) => n.slug === params.slug);
  if (!note) notFound();

  // 上下篇（MOCK：按数组顺序）
  const idx = notes.findIndex((n) => n.id === note.id);
  const prev = idx > 0 ? notes[idx - 1] : undefined;
  const next = idx < notes.length - 1 ? notes[idx + 1] : undefined;

  return (
    <main className="min-h-screen">
      {/* 顶部栏：站名 + 返回（不参与全站 Tab 结构） */}
      <div className="h-16 border-b border-neutral-100 bg-neutral-0">
        <div className="content-container h-full flex items-center justify-between">
          <Link href="/" className="font-bold text-neutral-900 tracking-tight">
            渔夫阿凯的AI仓库
          </Link>
          <a className="text-sm text-neutral-400 hover:text-brand-600" href="#footer">
            管理
          </a>
        </div>
      </div>

      <article className="content-container max-w-[760px] py-10">
        <Link
          href="/category"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 mb-8 hover:text-brand-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回笔记列表
        </Link>

        <header className="mb-10 pb-8 border-b border-neutral-100">
          <div className="flex items-center gap-3 flex-wrap mb-4 text-sm text-neutral-400">
            <span>{note.date}</span>
            {note.category && (
              <span className="px-2.5 py-1 rounded-sm text-xs font-medium bg-brand-50 text-brand-700">
                {note.category.name}
              </span>
            )}
            <span>{[note.series, ...note.tags].filter(Boolean).join(" · ") || note.tags.join(" · ")}</span>
          </div>
          <h1 className="text-3xl md:text-[34px] font-bold leading-tight text-neutral-900 mb-3">
            {note.title}
          </h1>
          {note.sourceTitle && (
            <p className="text-sm text-neutral-400">
              学习来源：
              <a
                href={note.sourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {note.sourceTitle}
              </a>
            </p>
          )}
        </header>

        <div
          // 正文：直接渲染上传的自包含 HTML（MOCK 阶段用 bodyHtml）
          className="prose"
          dangerouslySetInnerHTML={{ __html: note.bodyHtml || "" }}
        />

        {/* 来源说明 */}
        <div className="bg-brand-50 border border-brand-100 rounded-md p-5 my-8">
          <h4 className="text-sm font-semibold text-neutral-900 mb-2">学习来源</h4>
          <p className="text-sm text-neutral-600">
            本文整理自 {note.sourceTitle || "相关资料"} 及个人实践记录。如有错漏，欢迎指出。
          </p>
        </div>

        {/* 上下篇 */}
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
          {prev ? (
            <Link href={`/notes/${prev.slug}`} className="block bg-neutral-0 border border-neutral-200 rounded-md p-5 hover:bg-brand-50 hover:border-brand-200">
              <span className="block text-xs text-neutral-400 mb-1.5">上一篇</span>
              <strong className="text-base text-neutral-900">{prev.title}</strong>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/notes/${next.slug}`} className="block bg-neutral-0 border border-neutral-200 rounded-md p-5 hover:bg-brand-50 hover:border-brand-200">
              <span className="block text-xs text-neutral-400 mb-1.5">下一篇</span>
              <strong className="text-base text-neutral-900">{next.title}</strong>
            </Link>
          ) : <span />}
        </nav>
      </article>

      <div id="footer">
        <Footer />
      </div>
    </main>
  );
}