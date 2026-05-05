export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: '포스트 ID가 필요합니다.' }), { status: 400 });
    }

    const post = await DB.prepare(`
      SELECT 
        p.*, 
        u.nickname as guide_nickname, 
        u.profile_image_url as guide_profile_image,
        u.trust_score as guide_trust_score
      FROM posts p
      JOIN users u ON p.guide_id = u.id
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
      rating: row.rating,
      likes: row.likes || 0,
      tags: row.tags ? JSON.parse(row.tags) : [],
      images: JSON.parse(row.images || '[]'),
      createdAt: row.created_at
    };

    return new Response(JSON.stringify(result), {
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
      content, 
      rating, 
      images,
      tags,
      category
    } = body;

    // 업데이트 쿼리 실행
    await DB.prepare(`
      UPDATE posts 
      SET content = ?, rating = ?, images = ?, tags = ?, category = ?
      WHERE id = ?
    `).bind(
      content, 
      rating, 
      JSON.stringify(images || []), 
      JSON.stringify(tags || []),
      category,
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
