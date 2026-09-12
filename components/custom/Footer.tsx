// components/custom/Footer.tsx — 页脚
// 变更11：版权 + 备案占位 + 「管理后台」入口（仅登录角色可见）
import Link from "next/link";

interface Props {
  /** 登录态（T3 接 /api/me 后由父级传入；MOCK 阶段默认访客） */
  loggedIn?: boolean;
}

export default function Footer({ loggedIn = false }: Props) {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-100 py-12 text-center">
      <p className="text-[13px] text-neutral-400 mb-2">© 2026 渔夫阿凯的AI仓库</p>
      <p className="text-[13px] text-neutral-400 mb-2">备案号占位 | 内容在持续整理中</p>
      {loggedIn && (
        <p>
          <Link href="/admin" className="text-[13px] text-neutral-400 hover:text-brand-600">
            管理后台
          </Link>
        </p>
      )}
    </footer>
  );
}