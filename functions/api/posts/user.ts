export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: '사용자 ID가 필요합니다.' }), { status: 400 });
    }

    const { results } = await DB.prepare(`
      SELECT 
        p.*, 
        u.nickname as guide_nickname, 
        u.profile_image_url as guide_profile_image,
        u.trust_score as guide_trust_score
      FROM posts p
      JOIN users u ON p.guide_id = u.id
      WHERE p.guide_id = ?
      ORDER BY p.created_at DESC
    `).bind(userId).all();

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
      likes: row.likes || 0,
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
