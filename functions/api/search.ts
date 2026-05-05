export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const keyword = url.searchParams.get('q') || '';

    if (!keyword) {
      return new Response(JSON.stringify({ posts: [], guides: [] }), { status: 200 });
    }

    const searchKeyword = `%${keyword}%`;

    // 1. 포스트 검색 (식당명, 카테고리, 내용)
    const { results: posts } = await DB.prepare(`
      SELECT 
        p.id, p.restaurant_name, p.address, p.category, p.content, p.rating, p.images, p.likes,
        u.nickname as guide_nickname, u.profile_image_url as guide_profile_image
      FROM posts p
      JOIN users u ON p.guide_id = u.id
      WHERE p.restaurant_name LIKE ? OR p.category LIKE ? OR p.content LIKE ? OR u.nickname LIKE ?
      ORDER BY p.created_at DESC
      LIMIT 20
    `).bind(searchKeyword, searchKeyword, searchKeyword, searchKeyword).all();

    // 2. 가이드 검색
    const { results: guides } = await DB.prepare(`
      SELECT id, nickname, profile_image_url, trust_score, bio
      FROM users
      WHERE nickname LIKE ? OR bio LIKE ?
      LIMIT 10
    `).bind(searchKeyword, searchKeyword).all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        posts: posts.map((p: any) => ({
          ...p,
          images: JSON.parse(p.images || '[]'),
          guide: {
            nickname: p.guide_nickname,
            profileImageUrl: p.guide_profile_image
          },
          place: {
            name: p.restaurant_name,
            address: p.address,
            category: p.category
          }
        })),
        guides: guides.map((g: any) => ({
          ...g,
          profileImageUrl: g.profile_image_url,
          trustScore: g.trust_score
        }))
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
