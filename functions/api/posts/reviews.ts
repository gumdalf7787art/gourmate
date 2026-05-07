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
      INSERT INTO reviews (id, post_id, user_id, content, parent_id, created_at)
      VALUES (?, ?, ?, ?, ?, DATETIME('now', '+9 hours'))
    `).bind(id, post_id, user_id, content, parent_id || null).run();

    // Send notification to post owner
    try {
      // 1. Get post owner and restaurant name
      const postInfo = await DB.prepare(
        'SELECT guide_id, restaurant_name FROM posts WHERE id = ?'
      ).bind(post_id).first() as { guide_id: string, restaurant_name: string } | null;

      // 2. Get reviewer's nickname
      const reviewer = await DB.prepare(
        'SELECT nickname FROM users WHERE id = ?'
      ).bind(user_id).first() as { nickname: string } | null;

      if (postInfo && postInfo.guide_id !== user_id) {
        const reviewerNickname = reviewer?.nickname || '새로운 미식가';
        const message = `${reviewerNickname}님이 회원님의 '${postInfo.restaurant_name}' 포스팅에 댓글을 남겼습니다. 💬`;
        
        await DB.prepare(
          "INSERT INTO notifications (user_id, type, from_user_id, message, link, created_at) VALUES (?, ?, ?, ?, ?, DATETIME('now', '+9 hours'))"
        ).bind(postInfo.guide_id, 'review', user_id, message, `/post/${post_id}`).run();
      }
    } catch (notifError) {
      console.error('Failed to create review notification:', notifError);
    }

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
