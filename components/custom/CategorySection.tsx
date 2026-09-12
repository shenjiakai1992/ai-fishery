// components/custom/CategorySection.tsx — 分类分组区块
// 变更9/10：F3/F4 按主题分类分组展示；区块标题带主题色圆点；空分类不渲染
import type { Category, Note, Skill } from "@/lib/data";
import NoteCard from "./NoteCard";
import SkillCard from "./SkillCard";

interface Props {
  category: Category;
  notes?: Note[];
  skills?: Skill[];
}

export default function CategorySection({ category, notes, skills }: Props) {
  const hasNotes = notes && notes.length > 0;
  const hasSkills = skills && skills.length > 0;
  if (!hasNotes && !hasSkills) return null; // 空分类不渲染

  const count = notes?.length ?? skills?.length ?? 0;
  const label = hasNotes ? "篇" : "个";

  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0"
          style={{ background: category.color, boxShadow: `0 0 0 4px ${category.color}1f` }}
        />
        <h2 className="text-xl font-bold tracking-tight" style={{ color: category.color }}>
          {category.name}
        </h2>
        <span className="text-sm text-neutral-400 ml-auto">
          {count} {label}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasNotes && notes!.map((n) => <NoteCard key={n.id} note={n} />)}
        {hasSkills && skills!.map((s) => <SkillCard key={s.id} skill={s} />)}
      </div>
    </section>
  );
}