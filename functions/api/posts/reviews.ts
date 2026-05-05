export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const postId = url.searchParams.get('postId');

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID가 필요합니다.' }), { status: 400 });
    }

    // 리뷰 테이블 자동 생성 (없을 경우)
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        parent_id TEXT,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `).run();

    const { results } = await DB.prepare(`
      SELECT 
        r.id, r.post_id, r.user_id, r.parent_id, r.content, r.created_at,
        u.nickname, u.profile_image_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.post_id = ?
      ORDER BY r.created_at ASC
    `).bind(postId).all();

    return new Response(JSON.stringify({ success: true, data: results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { post_id, user_id, content, parent_id } = body;

    if (!post_id || !user_id || !content) {
      return new Response(JSON.stringify({ error: '필수 정보가 누락되었습니다.' }), { status: 400 });
    }

    const id = crypto.randomUUID();

    await DB.prepare(`
      INSERT INTO reviews (id, post_id, user_id, content, parent_id)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, post_id, user_id, content, parent_id || null).run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
