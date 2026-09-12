// app/api/analytics/route.ts — 埋点上报（POST，公开）
// 中台变更7/10：eventType 仅 page_view | card_click，携带分类/标签/系列维度。
// 前端用 sendBeacon 上报，故返回需快速 2xx。
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_EVENTS = ["page_view", "card_click"];

interface EventInput {
  eventType?: string;
  pageType?: string;
  noteId?: string;
  cardType?: string;
  targetId?: string;
  categoryId?: string;
  series?: string;
  referrer?: string;
  path?: string;
  ua?: string;
  sessionId?: string;
}

export async function POST(req: Request) {
  let list: EventInput[];
  try {
    const body = await req.json();
    list = Array.isArray(body) ? body : [body];
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 逐条写入，单条失败不影响其余（埋点可容忍）
  const results = [];
  for (const ev of list) {
    if (!VALID_EVENTS.includes(ev?.eventType ?? "")) continue;
    try {
      const created = await prisma.analyticsEvent.create({
        data: {
          eventType: ev.eventType!,
          pageType: ev.pageType,
          noteId: ev.noteId || null,
          cardType: ev.cardType,
          targetId: ev.targetId,
          categoryId: ev.categoryId || null,
          series: ev.series,
          referrer: ev.referrer,
          path: ev.path,
          ua: ev.ua,
          sessionId: ev.sessionId,
          // T3 TODO：tags 写入 AnalyticsEventTag（传入 tagIds 或 tag 名查 id）
        },
      });
      results.push(created.id);
    } catch {
      // 忽略单条失败
    }
  }

  return NextResponse.json({ ok: true, received: results.length });
}