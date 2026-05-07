export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;

    const columns = ['review', 'tags', 'editor_mode', 'story_blocks', 'menu_items', 'likes', 'latitude', 'longitude', 'phone', 'is_paid', 'top_rank'];
    for (const col of columns) {
      try {
        await DB.prepare(`ALTER TABLE posts ADD COLUMN ${col} TEXT`).run();
      } catch (e) {}
    }

    // follows 테이블이 없을 경우 생성
    try {
      await DB.prepare(`
        CREATE TABLE IF NOT EXISTS follows (
          id TEXT PRIMARY KEY,
          follower_id TEXT NOT NULL,
          following_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(follower_id, following_id)
        )
      `).run();
    } catch (e) {}
    
    // JOIN을 통해 작성자 정보를 포함하여 최신순으로 가져옴
    const { results } = await DB.prepare(`
      SELECT 
        p.id, p.guide_id, p.restaurant_name, p.address, p.category, 
        p.content, p.review, p.rating, p.images, p.tags, 
        p.editor_mode, p.story_blocks, p.menu_items, p.likes, p.created_at,
        p.latitude, p.longitude, p.phone, p.is_paid, p.top_rank,
        u.nickname as guide_nickname, 
        u.profile_image_url as guide_profile_image,
        u.trust_score as guide_trust_score,
        u.bio as guide_bio,
        (SELECT COUNT(*) FROM posts WHERE guide_id = p.guide_id) as guide_post_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = p.guide_id) as guide_follower_count
      FROM posts p
      JOIN users u ON p.guide_id = u.id
      ORDER BY p.created_at DESC
    `).all();

    // 프런트엔드에서 기대하는 포맷으로 변환
    const posts = results.map((row: any) => ({
      id: row.id,
      guide: {
        id: row.guide_id,
        nickname: row.guide_nickname,
        profileImageUrl: row.guide_profile_image,
        trustScore: row.guide_trust_score,
        bio: row.guide_bio,
        postCount: row.guide_post_count,
        followers: row.guide_follower_count
      },
      place: {
        name: row.restaurant_name,
        address: row.address,
        category: row.category,
        latitude: row.latitude,
        longitude: row.longitude,
        phone: row.phone
      },
      content: row.content,
      review: row.review,
      rating: row.rating,
      likes: row.likes || 0, // DB에 없으면 0으로 처리
      tags: row.tags ? JSON.parse(row.tags) : [],
      images: JSON.parse(row.images || '[]'),
      isPaid: row.is_paid === '1' || row.is_paid === 1,
      topRank: row.top_rank ? parseInt(row.top_rank) : null,
      createdAt: row.created_at
    }));

    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { 
      guide_id, 
      restaurant_name, 
      address, 
      category, 
      content, 
      review,
      rating, 
      images,
      tags,
      editor_mode,
      story_blocks,
      menu_items,
      latitude,
      longitude,
      phone,
      is_paid
    } = body;

    if (!guide_id || !restaurant_name) {
      return new Response(JSON.stringify({ error: '필수 정보가 누락되었습니다.' }), { status: 400 });
    }

    const id = crypto.randomUUID();
    
    // DB 컬럼이 없을 경우를 대비해 ALTER TABLE 시도 (무시 가능)
    const columns = ['review', 'tags', 'editor_mode', 'story_blocks', 'menu_items', 'likes', 'latitude', 'longitude', 'phone', 'is_paid'];
    for (const col of columns) {
      try {
        await DB.prepare(`ALTER TABLE posts ADD COLUMN ${col} TEXT`).run();
      } catch (e) {}
    }

    // DB에 저장
    await DB.prepare(`
      INSERT INTO posts (
        id, guide_id, restaurant_name, address, category, 
        content, review, rating, images, tags, 
        editor_mode, story_blocks, menu_items, latitude, longitude, phone, is_paid
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, 
      guide_id, 
      restaurant_name, 
      address, 
      category, 
      content,
      review || '',
      rating, 
      JSON.stringify(images || []),
      JSON.stringify(tags || []),
      editor_mode || 'simple',
      JSON.stringify(story_blocks || []),
      JSON.stringify(menu_items || []),
      latitude || null,
      longitude || null,
      phone || '',
      is_paid ? 1 : 0
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
