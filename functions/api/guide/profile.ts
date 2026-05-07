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
      SELECT 
        u.id, u.email, u.nickname, u.profile_image_url, u.trust_score, u.is_official, u.created_at, u.bio,
        (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
        (SELECT COALESCE(SUM(likes), 0) FROM posts WHERE guide_id = u.id) as total_likes
      FROM users u
      WHERE u.id = ?
    `).bind(id).first() as any;

    if (!user) {
      return new Response(JSON.stringify({ error: '가이드를 찾을 수 없습니다.' }), { status: 404 });
    }

    // 2. 가이드가 작성한 포스트 조회
    const { results: posts } = await DB.prepare(`
      SELECT 
        p.id, p.restaurant_name, p.address, p.category, p.content, p.review, p.rating, 
        p.images, p.tags, p.editor_mode, p.story_blocks, p.menu_items, p.likes, p.created_at,
        p.latitude, p.longitude, p.phone, p.is_paid, p.top_rank
      FROM posts p
      WHERE p.guide_id = ?
      ORDER BY p.created_at DESC
    `).bind(id).all();

    // 3. 가이드가 생성한 테마 조회
    const { results: themes } = await DB.prepare(`
      SELECT t.*, COUNT(tp.post_id) as post_count
      FROM themes t
      LEFT JOIN theme_posts tp ON t.id = tp.theme_id
      WHERE t.guide_id = ?
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).bind(id).all();

    // JSON 필드 파싱 헬퍼 함수
    const safeParse = (str: any) => {
      if (typeof str !== 'string') return Array.isArray(str) ? str : [];
      try {
        const parsed = JSON.parse(str || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('JSON parse error:', str);
        return [];
      }
    };

    const formattedPosts = posts.map((p: any) => ({
      ...p,
      createdAt: p.created_at,
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
      },
      isPaid: p.is_paid === '1' || p.is_paid === 1,
      topRank: p.top_rank ? parseInt(p.top_rank) : null
    }));

    const top20Posts = formattedPosts
      .filter(p => p.topRank !== null)
      .sort((a, b) => a.topRank! - b.topRank!);

    const formattedThemes = themes.map((t: any) => ({
      ...t,
      keywords: safeParse(t.keywords)
    }));

    const formattedUser = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImageUrl: user.profile_image_url,
      trustScore: user.trust_score || 0,
      isOfficial: user.is_official === 1,
      createdAt: user.created_at,
      followers: user.follower_count || 0,
      likes: user.total_likes || 0,
      bio: user.bio || '맛있는 음식과 멋진 공간을 기록합니다.'
    };

    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        ...formattedUser,
        posts: formattedPosts,
        top20Posts: top20Posts,
        themes: formattedThemes
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
