export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const keyword = url.searchParams.get('q') || '';

    // 로그용 데이터 (개발자 도구에서 확인 가능)
    const debugInfo = {
      receivedKeyword: keyword,
      timestamp: new Date().toISOString()
    };

    if (!keyword.trim()) {
      return new Response(JSON.stringify({ 
        success: true, 
        data: { posts: [], guides: [] },
        _debug: debugInfo
      }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const searchKeyword = `%${keyword.trim()}%`;

    // 1. 포스트 검색 (식당명, 카테고리, 내용) - COALESCE로 NULL 처리
    const { results: posts } = await DB.prepare(`
      SELECT 
        p.id, p.restaurant_name, p.address, p.category, p.content, p.rating, p.images, p.likes,
        u.nickname as guide_nickname, u.profile_image_url as guide_profile_image
      FROM posts p
      JOIN users u ON p.guide_id = u.id
      WHERE 
        COALESCE(p.restaurant_name, '') LIKE ? OR 
        COALESCE(p.category, '') LIKE ? OR 
        COALESCE(p.content, '') LIKE ? OR 
        COALESCE(u.nickname, '') LIKE ?
      ORDER BY p.created_at DESC
      LIMIT 20
    `).bind(searchKeyword, searchKeyword, searchKeyword, searchKeyword).all();

    // 2. 가이드 검색 - bio 컬럼 제거 (존재하지 않음)
    const { results: guides } = await DB.prepare(`
      SELECT id, nickname, profile_image_url, trust_score
      FROM users
      WHERE 
        COALESCE(nickname, '') LIKE ?
      LIMIT 10
    `).bind(searchKeyword).all();

    // 3. 테마 검색 추가
    const { results: themes } = await DB.prepare(`
      SELECT t.*, u.nickname as guide_nickname, u.profile_image_url as guide_profile_image
      FROM themes t
      JOIN users u ON t.guide_id = u.id
      WHERE 
        COALESCE(t.title, '') LIKE ? OR 
        COALESCE(t.description, '') LIKE ?
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
            id: p.id,
            name: p.restaurant_name,
            address: p.address,
            category: p.category
          }
        })),
        guides: guides.map((g: any) => ({
          ...g,
          profileImageUrl: g.profile_image_url,
          trustScore: g.trust_score || 50
        })),
        themes: themes.map((t: any) => ({
          ...t,
          imageUrl: t.image_url,
          guide: {
            nickname: t.guide_nickname,
            profileImageUrl: t.guide_profile_image
          }
        }))
      },
      _debug: { ...debugInfo, guidesCount: guides.length, postsCount: posts.length, themesCount: themes.length }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ 
      error: err.message,
      success: false
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
