import type { Config } from "tailwindcss";

// 设计系统 v2.0 → Tailwind 映射（冷蓝 + 白色 + 960px 两列）
// 详见 设计/设计系统规范.md
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          400: "#94A3B8",
          600: "#475569",
          900: "#0F172A",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          tertiary: "#64748B",
          link: "#2563EB",
        },
        state: {
          success: "#2E7D32",
          warning: "#EF6C00",
          error: "#C62828",
          info: "#1565C0",
        },
      },
      maxWidth: {
        content: "960px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        20: "80px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(15,23,42,0.06)",
        modal: "0 8px 32px rgba(15,23,42,0.08)",
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
