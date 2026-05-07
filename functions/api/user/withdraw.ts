export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: '사용자 ID가 필요합니다.' }), { status: 400 });
    }

    // 사용자와 관련된 모든 데이터를 연쇄적으로 삭제하여 제약 조건 오류를 방지합니다.
    const statements = [
      'DELETE FROM followers WHERE follower_id = ? OR following_id = ?',
      'DELETE FROM likes WHERE user_id = ?',
      'DELETE FROM bookmarks WHERE user_id = ?',
      'DELETE FROM reviews WHERE user_id = ?',
      'DELETE FROM user_maps WHERE user_id = ?',
      'DELETE FROM theme_posts WHERE theme_id IN (SELECT id FROM themes WHERE guide_id = ?)',
      'DELETE FROM themes WHERE guide_id = ?',
      'DELETE FROM post_views WHERE post_id IN (SELECT id FROM posts WHERE guide_id = ?)',
      'DELETE FROM theme_posts WHERE post_id IN (SELECT id FROM posts WHERE guide_id = ?)',
      'DELETE FROM likes WHERE post_id IN (SELECT id FROM posts WHERE guide_id = ?)',
      'DELETE FROM bookmarks WHERE post_id IN (SELECT id FROM posts WHERE guide_id = ?)',
      'DELETE FROM reviews WHERE post_id IN (SELECT id FROM posts WHERE guide_id = ?)',
      'DELETE FROM posts WHERE guide_id = ?',
      'DELETE FROM users WHERE id = ?'
    ];

    for (const sql of statements) {
      try {
        if (sql.includes('OR following_id = ?')) {
          await DB.prepare(sql).bind(userId, userId).run();
        } else {
          await DB.prepare(sql).bind(userId).run();
        }
      } catch (e) {
        // 특정 테이블이 없거나 쿼리가 실패해도 다른 데이터 삭제를 계속 진행합니다.
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
