// components/custom/SkillCard.tsx — Skill 带图卡片
// F4：名称/描述/分类/标签/外链；卡片点击跳转外部链接
import type { Skill } from "@/lib/data";

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-neutral-0 border border-neutral-200 rounded-lg p-5 transition-transform hover:-translate-y-0.5 hover:shadow-card hover:border-brand-200"
    >
      <div className="w-full aspect-[16/10] rounded-md mb-4 bg-gradient-to-br from-brand-100 to-brand-200" />
      <h3 className="text-xl font-semibold mb-2 text-neutral-900 truncate">{skill.name}</h3>
      <p className="text-[15px] text-neutral-600 leading-relaxed mb-3 line-clamp-2">{skill.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {skill.category && (
          <span className="px-2.5 py-1 rounded-sm text-xs font-medium bg-brand-50 text-brand-700">
            {skill.category.name}
          </span>
        )}
        {skill.tags.map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-sm text-xs font-medium bg-neutral-100 text-neutral-600">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}