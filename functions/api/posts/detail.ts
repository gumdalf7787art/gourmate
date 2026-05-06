export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    // DB 스키마 보정 (컬럼 누락 대비)
    const columns = ['review', 'tags', 'editor_mode', 'story_blocks', 'menu_items', 'likes', 'latitude', 'longitude', 'phone', 'is_paid', 'top_rank'];
    for (const col of columns) {
      try {
        await DB.prepare(`ALTER TABLE posts ADD COLUMN ${col} TEXT`).run();
      } catch (e) {}
    }

    if (!id) {
      return new Response(JSON.stringify({ error: '포스트 ID가 필요합니다.' }), { status: 400 });
    }

    const post = await DB.prepare(`
      SELECT 
        p.id, p.guide_id, p.restaurant_name, p.address, p.category, 
        p.content, p.review, p.rating, p.images, p.tags, 
        p.editor_mode, p.story_blocks, p.menu_items, p.likes, p.created_at,
        p.latitude, p.longitude, p.phone, p.is_paid, p.top_rank,
        u.nickname as guide_nickname, 
        u.profile_image_url as guide_profile_image,
        u.trust_score as guide_trust_score
      FROM posts p
      LEFT JOIN users u ON p.guide_id = u.id
      WHERE p.id = ?
    `).bind(id).first();

    if (!post) {
      return new Response(JSON.stringify({ error: '포스트를 찾을 수 없습니다.' }), { status: 404 });
    }

    const row: any = post;
    const result = {
      id: row.id,
      guide: {
        id: row.guide_id,
        nickname: row.guide_nickname,
        profileImageUrl: row.guide_profile_image,
        trustScore: row.guide_trust_score
      },
      place: {
        id: row.id, // 장소 ID가 따로 없으면 포스트 ID나 다른 식별자 사용
        name: row.restaurant_name,
        address: row.address,
        category: row.category,
        latitude: row.latitude,
        longitude: row.longitude,
        phone: row.phone
      },
      content: row.content,
      review: row.review || '',
      rating: row.rating,
      likes: row.likes || 0,
      tags: row.tags ? JSON.parse(row.tags) : [],
      images: JSON.parse(row.images || '[]'),
      editor_mode: row.editor_mode || 'simple',
      story_blocks: row.story_blocks ? JSON.parse(row.story_blocks) : [],
      menu_items: row.menu_items ? JSON.parse(row.menu_items) : [],
      isPaid: row.is_paid === '1' || row.is_paid === 1,
      topRank: row.top_rank ? parseInt(row.top_rank) : null,
      createdAt: row.created_at
    };

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPatch: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const body = await context.request.json() as any;

    if (!id) {
      return new Response(JSON.stringify({ error: '포스트 ID가 필요합니다.' }), { status: 400 });
    }

    const { 
      content = '', 
      review = '',
      rating = 0, 
      images = [],
      tags = [],
      category = '',
      editor_mode = 'simple',
      story_blocks = [],
      menu_items = [],
      latitude = null,
      longitude = null,
      phone = null,
      is_paid = 0,
      top_rank = null
    } = body;

    // PATCH 시에도 컬럼 누락 대비
    const columns = ['review', 'tags', 'editor_mode', 'story_blocks', 'menu_items', 'likes', 'latitude', 'longitude', 'phone', 'is_paid'];
    for (const col of columns) {
      try {
        await DB.prepare(`ALTER TABLE posts ADD COLUMN ${col} TEXT`).run();
      } catch (e) {}
    }

    // 업데이트 쿼리 실행
    await DB.prepare(`
      UPDATE posts 
      SET content = ?, review = ?, rating = ?, images = ?, tags = ?, 
          category = ?, editor_mode = ?, story_blocks = ?, menu_items = ?,
          latitude = ?, longitude = ?, phone = ?, is_paid = ?, top_rank = ?
      WHERE id = ?
    `).bind(
      String(content), 
      String(review),
      Number(rating), 
      JSON.stringify(images), 
      JSON.stringify(tags),
      String(category),
      String(editor_mode),
      JSON.stringify(story_blocks),
      JSON.stringify(menu_items),
      latitude ? String(latitude) : null,
      longitude ? String(longitude) : null,
      phone ? String(phone) : null,
      is_paid ? 1 : 0,
      top_rank ? parseInt(top_rank) : null,
      id
    ).run();

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

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: '포스트 ID가 필요합니다.' }), { status: 400 });
    }

    await DB.prepare(`DELETE FROM posts WHERE id = ?`).bind(id).run();

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
