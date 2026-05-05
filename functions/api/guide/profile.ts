export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: '가이드 ID가 필요합니다.' }), { status: 400 });
    }

    // 1. 가이드 기본 정보 조회
    const user = await DB.prepare(`
      SELECT id, email, nickname, profile_image_url, trust_score, is_official, created_at
      FROM users
      WHERE id = ?
    `).bind(id).first() as any;

    if (!user) {
      return new Response(JSON.stringify({ error: '가이드를 찾을 수 없습니다.' }), { status: 404 });
    }

    // 2. 가이드가 작성한 포스트 조회
    const { results: posts } = await DB.prepare(`
      SELECT 
        p.id, p.restaurant_name, p.address, p.category, p.content, p.review, p.rating, 
        p.images, p.tags, p.editor_mode, p.story_blocks, p.menu_items, p.likes, p.created_at,
        p.latitude, p.longitude, p.phone
      FROM posts p
      WHERE p.guide_id = ?
      ORDER BY p.created_at DESC
    `).bind(id).all();

    // JSON 필드 파싱 헬퍼 함수
    const safeParse = (str: any) => {
      if (typeof str !== 'string') return str || [];
      try {
        return JSON.parse(str || '[]');
      } catch (e) {
        console.error('JSON parse error:', str);
        return [];
      }
    };

    const formattedPosts = posts.map((p: any) => ({
      ...p,
      images: safeParse(p.images),
      tags: safeParse(p.tags),
      story_blocks: safeParse(p.story_blocks),
      menu_items: safeParse(p.menu_items),
      place: {
        id: p.id,
        name: p.restaurant_name,
        address: p.address,
        category: p.category,
        latitude: p.latitude,
        longitude: p.longitude,
        phone: p.phone
      }
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        ...user,
        posts: formattedPosts,
        followers: 0, // 추후 팔로우 기능 연동
        bio: '맛있는 음식과 멋진 공간을 기록합니다.' // 추후 bio 컬럼 추가 시 연동
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
