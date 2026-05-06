export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: '테마 ID가 필요합니다.' }), { status: 400 });
    }

    // 1. 테마 기본 정보 조회
    const theme = await DB.prepare(`
      SELECT * FROM themes WHERE id = ?
    `).bind(id).first() as any;

    if (!theme) {
      return new Response(JSON.stringify({ error: '테마를 찾을 수 없습니다.' }), { status: 404 });
    }

    // 2. 테마에 포함된 포스트 조회
    const { results: posts } = await DB.prepare(`
      SELECT p.* FROM posts p
      JOIN theme_posts tp ON p.id = tp.post_id
      WHERE tp.theme_id = ?
      ORDER BY tp.sort_order ASC
    `).bind(id).all();

    // JSON 필드 파싱
    const safeParse = (str: any) => {
      if (typeof str !== 'string') return Array.isArray(str) ? str : [];
      try {
        const parsed = JSON.parse(str || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    };

    const formattedPosts = posts.map((p: any) => ({
      ...p,
      images: safeParse(p.images),
      tags: safeParse(p.tags),
      place: {
        id: p.id,
        name: p.restaurant_name,
        address: p.address,
        category: p.category,
        latitude: p.latitude,
        longitude: p.longitude
      }
    }));

    const formattedTheme = {
      ...theme,
      keywords: safeParse(theme.keywords),
      posts: formattedPosts
    };

    return new Response(JSON.stringify({ success: true, data: formattedTheme }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestPatch: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const body = await context.request.json() as any;
    const { title, description, thumbnail, tags, postIds } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '테마 ID가 필요합니다.' }), { status: 400 });
    }

    // 1. 테마 기본 정보 수정
    await DB.prepare(`
      UPDATE themes 
      SET title = ?, description = ?, image_url = ?, keywords = ?
      WHERE id = ?
    `).bind(
      title,
      description || '',
      thumbnail,
      JSON.stringify(tags || []),
      id
    ).run();

    // 2. 테마 포스트 연결 수정 (기존 것 삭제 후 다시 삽입)
    if (Array.isArray(postIds)) {
      await DB.prepare(`DELETE FROM theme_posts WHERE theme_id = ?`).bind(id).run();
      
      if (postIds.length > 0) {
        const inserts = postIds.map((postId, index) => {
          return DB.prepare(`
            INSERT INTO theme_posts (theme_id, post_id, sort_order)
            VALUES (?, ?, ?)
          `).bind(id, postId, index);
        });
        await DB.batch(inserts);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: '테마 ID가 필요합니다.' }), { status: 400 });
    }

    await DB.prepare(`DELETE FROM themes WHERE id = ?`).bind(id).run();
    await DB.prepare(`DELETE FROM theme_posts WHERE theme_id = ?`).bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
