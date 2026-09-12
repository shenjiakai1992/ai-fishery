// components/custom/NoteCard.tsx — 笔记摘要卡片
// 设计系统 6.3：白底/1px边框/圆角12/内边20/封面16:10/悬浮上移2px
import Link from "next/link";
import type { Note } from "@/lib/data";

export default function NoteCard({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="block bg-neutral-0 border border-neutral-200 rounded-lg p-5 transition-transform hover:-translate-y-0.5 hover:shadow-card hover:border-brand-200"
    >
      <div
        className="w-full aspect-[16/10] rounded-md mb-4 object-cover bg-gradient-to-br from-brand-100 to-brand-200"
        // 有封面时用背景图代替（演示用渐变占位）
        style={note.coverPath ? { backgroundImage: `url(${note.coverPath})`, backgroundSize: "cover" } : {}}
      />
      <div className="flex items-center gap-3 flex-wrap mb-2.5 text-[13px] text-neutral-400">
        <span>{note.date}</span>
        {note.category && (
          <span className="px-2.5 py-1 rounded-sm text-xs font-medium bg-brand-50 text-brand-700">
            {note.category.name}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-neutral-900 truncate">{note.title}</h3>
      <p className="text-[15px] text-neutral-600 leading-relaxed line-clamp-2">{note.summary}</p>
    </Link>
  );
}