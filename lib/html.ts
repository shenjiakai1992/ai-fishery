// lib/html.ts — HTML 解析与回写（cheerio）
// 中台变更5：上传 HTML 时自动解析 <head> 中 <meta name="note:*"> 预填表单，确认后回写 <head>
// 中台变更12：解析正文所有 <img> 相对路径，随笔记上传并改写为 CDN/绝对地址
import * as cheerio from "cheerio";

/** 从 HTML <head> 解析出的笔记元信息（约定命名空间 note:*） */
export interface NoteMeta {
  title?: string;
  summary?: string;
  series?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  audience: string[]; // 中台变更5：受众（逗号或多行分隔）
  coverPath?: string;
  slug?: string;
}

const META_NS = "note:";

/** 解析 <head> 中全部 <meta name="note:*">，返回结构化元信息 */
export function parseNoteMeta(html: string): NoteMeta {
  const $ = cheerio.load(html);
  const meta: NoteMeta = { audience: [] };
  $('meta[name^="note:"]').each((_, el) => {
    const key = $(el).attr("name")?.replace(META_NS, "");
    const content = $(el).attr("content") ?? "";
    if (!key) return;
    switch (key) {
      case "title":
        meta.title = content;
        break;
      case "summary":
        meta.summary = content;
        break;
      case "series":
        meta.series = content || undefined;
        break;
      case "source-title":
        meta.sourceTitle = content || undefined;
        break;
      case "source-url":
        meta.sourceUrl = content || undefined;
        break;
      case "audience":
        meta.audience = content
          .split(/[,，\n;；]/)
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "cover-path":
        meta.coverPath = content || undefined;
        break;
      case "slug":
        meta.slug = content || undefined;
        break;
    }
  });
  return meta;
}

/**
 * 回写 <head>：以 note:* meta 形式写入表单确认后的元信息。
 * title 同时写回 <title>；其余用 <meta name="note:xxx">。
 */
export function writeMetaToHtml(html: string, meta: NoteMeta): string {
  const $ = cheerio.load(html);
  const head = $("head").first();

  // 先清掉旧的 note:* meta，避免残留
  head.find('meta[name^="note:"]').remove();

  const setMeta = (name: string, value?: string) => {
    if (!value) return;
    head.append(`<meta name="note:${name}" content="${escapeAttr(value)}">`);
  };

  if (meta.title) {
    head.find("title").first().text(meta.title);
    setMeta("title", meta.title);
  }
  setMeta("summary", meta.summary);
  setMeta("series", meta.series);
  setMeta("source-title", meta.sourceTitle);
  setMeta("source-url", meta.sourceUrl);
  setMeta("audience", meta.audience.join(","));
  setMeta("cover-path", meta.coverPath);
  setMeta("slug", meta.slug);

  return $.html();
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 扫描正文所有 <img>，返回其 src 列表。
 * 变更12：用于把相对路径本地图片随笔记上传。
 */
export function extractImageSrcs(html: string): string[] {
  const $ = cheerio.load(html);
  const srcs: string[] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    if (src) srcs.push(src);
  });
  return srcs;
}

/**
 * 变更12：上传正文图片到 CDN 后，把 HTML 中相对路径 src 改写为绝对 CDN 地址。
 * @param cdnBase 例如 https://cdn.example.com/notes/{noteId}
 */
export function rewriteImageSrcs(html: string, cdnBase: string): string {
  const $ = cheerio.load(html);
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    if (src && !/^(https?:)?\/\//i.test(src) && !src.startsWith("data:")) {
      // 相对路径（含 /uploads/... 或相对文件名）拼到 CDN 目录下
      const name = src.replace(/^\/+/, "");
      $(el).attr("src", `${cdnBase}/${name}`);
    }
  });
  return $.html();
}