// app/admin/page.tsx — 后台概览页（占位）
// MVP 看板 5 个纯列表视图（笔记PV/卡片点击/分类PV/标签点击/按日）在埋点数据就绪后接入。
// 当前为静态占位卡片，展示后台已规划模块入口。
import { notes, categories } from "@/lib/data";

export const metadata = {
  title: "后台概览 - 渔夫阿凯的AI仓库",
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight mb-6">概览</h1>

      {/* 统计占位 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "笔记数", value: notes.length },
          { label: "主题分类", value: categories.length },
          { label: "今日 PV", value: "—" },
          { label: "卡片点击", value: "—" },
        ].map((s) => (
          <div key={s.label} className="bg-neutral-0 border border-neutral-200 rounded-lg p-5">
            <p className="text-sm text-neutral-400 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 待接入模块 */}
      <div className="bg-neutral-0 border border-neutral-100 rounded-lg p-6 text-sm text-neutral-500">
        <p className="font-medium text-neutral-700 mb-2">后台模块（T3 后端就绪后逐一接入）</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>笔记管理：状态流转（草稿→待发→发布→下线）+ HTML 上传（自动解析 meta）</li>
          <li>Skill 推荐 / AI 服务 / 标签 / 埋点看板 / 站点配置</li>
          <li>当前为 MOCK 占位，登录态由 /api/me 控制</li>
        </ul>
      </div>
    </div>
  );
}