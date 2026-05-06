export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { guideId, top20Ids } = body; // top20Ids is an array of post IDs in order

    if (!guideId || !Array.isArray(top20Ids)) {
      return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), { status: 400 });
    }

    // 1. 기존 가이드의 모든 포스트 top_rank 초기화
    await DB.prepare(`UPDATE posts SET top_rank = NULL WHERE guide_id = ?`).bind(guideId).run();

    // 2. 새로운 top_rank 업데이트 (최대 20개)
    const updates = top20Ids.slice(0, 20).map((id, index) => {
      return DB.prepare(`UPDATE posts SET top_rank = ? WHERE id = ? AND guide_id = ?`)
        .bind(index + 1, id, guideId);
    });

    if (updates.length > 0) {
      await DB.batch(updates);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
