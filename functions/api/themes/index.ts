export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const guideId = url.searchParams.get('guideId');

    // Migration for keywords column in themes table
    try {
      await DB.prepare(`ALTER TABLE themes ADD COLUMN keywords TEXT`).run();
    } catch (e) {}

    // Create theme_posts table if not exists
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS theme_posts (
        theme_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        PRIMARY KEY (theme_id, post_id),
        FOREIGN KEY (theme_id) REFERENCES themes(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `).run();

    let query = `
      SELECT t.*, COUNT(tp.post_id) as post_count
      FROM themes t
      LEFT JOIN theme_posts tp ON t.id = tp.theme_id
    `;
    const params: any[] = [];

    if (guideId) {
      query += ` WHERE t.guide_id = ?`;
      params.push(guideId);
    }

    query += ` GROUP BY t.id ORDER BY t.created_at DESC`;

    const { results } = await DB.prepare(query).bind(...params).all();

    const formattedThemes = results.map((t: any) => ({
      ...t,
      keywords: t.keywords ? JSON.parse(t.keywords) : []
    }));

    return new Response(JSON.stringify({ success: true, data: formattedThemes }), {
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
    const { guideId, title, description, thumbnail, tags, postIds } = body;

    if (!guideId || !title || !thumbnail) {
      return new Response(JSON.stringify({ error: '필수 항목이 누락되었습니다.' }), { status: 400 });
    }

    const themeId = crypto.randomUUID();

    // 1. 테마 기본 정보 저장
    await DB.prepare(`
      INSERT INTO themes (id, guide_id, title, description, image_url, keywords)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      themeId,
      guideId,
      title,
      description || '',
      thumbnail,
      JSON.stringify(tags || [])
    ).run();

    // 2. 테마 포스트 연결
    if (Array.isArray(postIds) && postIds.length > 0) {
      const inserts = postIds.map((postId, index) => {
        return DB.prepare(`
          INSERT INTO theme_posts (theme_id, post_id, sort_order)
          VALUES (?, ?, ?)
        `).bind(themeId, postId, index);
      });
      await DB.batch(inserts);
    }

    return new Response(JSON.stringify({ success: true, data: { id: themeId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
