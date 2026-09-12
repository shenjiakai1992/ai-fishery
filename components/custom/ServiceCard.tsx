// components/custom/ServiceCard.tsx — AI服务横向大卡片（F5）
// 无分类无筛选；含名称/描述/标签/状态标签
import type { Service } from "@/lib/data";

const STATUS_MAP: Record<Service["status"], { text: string; className: string }> = {
  DEVELOPING: { text: "开发中", className: "bg-neutral-100 text-neutral-600" },
  BETA: { text: "测试版", className: "bg-orange-50 text-orange-700" },
  LIVE: { text: "已上线", className: "bg-emerald-50 text-emerald-700" },
};

export default function ServiceCard({ service }: { service: Service }) {
  const status = STATUS_MAP[service.status];
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-neutral-0 border border-neutral-200 rounded-lg p-6 mb-4 transition-transform hover:-translate-y-0.5 hover:shadow-card hover:border-brand-200"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-xl font-semibold text-neutral-900">{service.name}</h3>
        <span className={`shrink-0 px-2.5 py-1 rounded-sm text-xs font-medium ${status.className}`}>
          {status.text}
        </span>
      </div>
      <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">{service.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {service.tags.map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-sm text-xs font-medium bg-neutral-100 text-neutral-600">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}