// lib/slug.ts — slug 生成/校验工具
// 笔记 title → 唯一 slug；上传时若冲突追加序号。
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    // 中文保留，非中文/非字母数字替换为 -
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** 追加一个 -n 后缀以解决唯一性冲突 */
export function uniqueSlug(base: string, index: number): string {
  return index === 0 ? base : `${base}-${index}`;
}