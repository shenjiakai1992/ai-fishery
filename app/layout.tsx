import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "渔夫阿凯的AI仓库",
  description: "一个普通人用 AI 学 AI 的杂货铺。学到的好东西、踩的坑、随手记的想法都往里扔。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} antialiased bg-neutral-0 text-neutral-900`}
      >
        {children}
      </body>
    </html>
  );
}