export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const guideId = url.searchParams.get('guideId');

    if (!guideId) {
      return new Response(JSON.stringify({ error: 'Guide ID가 필요합니다.' }), { status: 400 });
    }

    // 1. 컬럼 추가 (is_read) - 이미 있을 경우 무시
    try {
      await DB.prepare(`ALTER TABLE reviews ADD COLUMN is_read INTEGER DEFAULT 0`).run();
    } catch (e) {}

    // 2. 내가 쓴 포스트에 달린 모든 댓글 가져오기 (작성자 정보 및 포스트 제목 포함)
    const { results } = await DB.prepare(`
      SELECT 
        r.id, r.post_id, r.user_id, r.parent_id, r.content, r.created_at, r.is_read,
        u.nickname as reviewer_nickname, u.profile_image_url as reviewer_image,
        p.restaurant_name as post_title
      FROM reviews r
      JOIN posts p ON r.post_id = p.id
      JOIN users u ON r.user_id = u.id
      WHERE p.guide_id = ? AND r.user_id != ?
      ORDER BY r.created_at DESC
    `).bind(guideId, guideId).all();

    return new Response(JSON.stringify({ success: true, data: results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

// 댓글 읽음 처리 API (PATCH)
export const onRequestPatch: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { reviewIds } = body;

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Review IDs가 필요합니다.' }), { status: 400 });
    }

    const placeholders = reviewIds.map(() => '?').join(',');
    await DB.prepare(`
      UPDATE reviews SET is_read = 1 WHERE id IN (${placeholders})
    `).bind(...reviewIds).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
