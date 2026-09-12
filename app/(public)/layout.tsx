// app/(public)/layout.tsx — 前台统一布局
// 变更11：Hero(站名+简介) + 吸顶居中Tab + 页面简介 + 内容区 + 页脚
import Hero from "@/components/custom/Hero";
import CenterTabs from "@/components/custom/CenterTabs";
import Footer from "@/components/custom/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <CenterTabs />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}