export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    
    // JOIN을 통해 작성자 정보를 포함하여 최신순으로 가져옴
    const { results } = await DB.prepare(`
      SELECT 
        p.*, 
        u.nickname as guide_nickname, 
        u.profile_image_url as guide_profile_image,
        u.trust_score as guide_trust_score
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
        trustScore: row.guide_trust_score
      },
      place: {
        name: row.restaurant_name,
        address: row.address,
        category: row.category
      },
      content: row.content,
      rating: row.rating,
      likes: row.likes || 0, // DB에 없으면 0으로 처리
      tags: row.tags ? JSON.parse(row.tags) : [],
      images: JSON.parse(row.images || '[]'),
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
      rating, 
      images,
      tags 
    } = body;

    if (!guide_id || !restaurant_name) {
      return new Response(JSON.stringify({ error: '필수 정보가 누락되었습니다.' }), { status: 400 });
    }

    const id = crypto.randomUUID();
    
    // DB에 저장 (tags와 likes 컬럼이 없을 수도 있으므로 일단 기본 컬럼 위주로 저장)
    // 만약 컬럼이 없다면 에러가 날 것이므로, 안전하게 처리하려면 PRAGMA를 확인해야 함
    // 하지만 여기서는 스키마에 정의된 것을 기준으로 작성함
    await DB.prepare(`
      INSERT INTO posts (id, guide_id, restaurant_name, address, category, content, rating, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, 
      guide_id, 
      restaurant_name, 
      address, 
      category, 
      content, 
      rating, 
      JSON.stringify(images || [])
    ).run();

    // tags 컬럼이 나중에 추가될 수 있으므로, 별도의 UPDATE 시도를 할 수도 있음
    try {
      await DB.prepare(`UPDATE posts SET tags = ?, likes = ? WHERE id = ?`)
        .bind(JSON.stringify(tags || []), 0, id)
        .run();
    } catch (e) {
      console.log('tags or likes column might not exist yet');
    }

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
