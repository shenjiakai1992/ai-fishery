// app/(public)/skills/page.tsx — F4 Skill推荐：按主题分类分组展示（未分类放末尾）
import CategorySection from "@/components/custom/CategorySection";
import SkillCard from "@/components/custom/SkillCard";
import { skills, categories, pageIntros } from "@/lib/data";

export const metadata = {
  title: "Skill推荐 - 渔夫阿凯的AI仓库",
};

export default function SkillsPage() {
  // 按分类分组；无分类的放末尾
  const grouped = categories
    .map((cat) => ({
      category: cat,
      items: skills.filter((s) => s.category?.id === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  const uncategorized = skills.filter((s) => !s.category);

  return (
    <>
      <p className="content-container text-center text-neutral-600 pt-6 pb-12">{pageIntros.skills}</p>
      <main className="content-container pb-20">
        {grouped.map((g) => (
          <CategorySection key={g.category.id} category={g.category} skills={g.items} />
        ))}

        {uncategorized.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3.5 h-3.5 rounded-full shrink-0 bg-neutral-400" />
              <h2 className="text-xl font-bold tracking-tight text-neutral-400">其他</h2>
              <span className="text-sm text-neutral-400 ml-auto">{uncategorized.length} 个</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {uncategorized.map((s) => (
                <SkillCard key={s.id} skill={s} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}