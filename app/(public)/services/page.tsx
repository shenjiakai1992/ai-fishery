// app/(public)/services/page.tsx — F5 AI服务：全部横向大卡片（无分类无筛选）
import ServiceCard from "@/components/custom/ServiceCard";
import { services, pageIntros } from "@/lib/data";

export const metadata = {
  title: "AI服务 - 渔夫阿凯的AI仓库",
};

export default function ServicesPage() {
  return (
    <>
      <p className="content-container text-center text-neutral-600 pt-6 pb-12">{pageIntros.services}</p>
      <main className="content-container pb-20">
        {services.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p>服务还在打磨中。</p>
          </div>
        ) : (
          services.map((s) => <ServiceCard key={s.id} service={s} />)
        )}
      </main>
    </>
  );
}