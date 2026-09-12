// app/(public)/category/page.tsx — F3 笔记分享：按主题分类分组展示（无筛选栏）
import CategorySection from "@/components/custom/CategorySection";
import { getNotesGroupedByCategory, pageIntros } from "@/lib/data";

export const metadata = {
  title: "笔记分享 - 渔夫阿凯的AI仓库",
};

export default function CategoryPage() {
  const groups = getNotesGroupedByCategory();

  return (
    <>
      <p className="content-container text-center text-neutral-600 pt-6 pb-12">{pageIntros.notes}</p>
      <main className="content-container pb-20">
        {groups.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p>这个篮子里还没有鱼。</p>
          </div>
        ) : (
          groups.map((g) => (
            <CategorySection key={g.category.id} category={g.category} notes={g.items} />
          ))
        )}
      </main>
    </>
  );
}