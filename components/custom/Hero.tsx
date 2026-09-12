// components/custom/Hero.tsx — Hero 站名区（站点级配置固定显示，变更11：前台无顶栏）
import { site } from "@/lib/data";

export default function Hero() {
  return (
    <header className="pt-20 pb-12 text-center bg-neutral-0">
      <div className="content-container">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 text-neutral-900">
          {site.siteName}
        </h1>
        <p className="text-[17px] text-neutral-600 max-w-[520px] mx-auto">{site.siteIntro}</p>
      </div>
    </header>
  );
}