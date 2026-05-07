export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');
  const postId = searchParams.get('postId');

  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  try {
    if (postId) {
      // Check if specific post is bookmarked
      const result = await context.env.DB.prepare(
        'SELECT 1 FROM bookmarks WHERE user_id = ? AND post_id = ?'
      ).bind(userId, postId).first();
      
      return Response.json({ success: true, isBookmarked: !!result });
    } else {
      // Get all bookmarked posts for user
      const results = await context.env.DB.prepare(`
        SELECT p.*, u.nickname as guide_nickname, u.profile_image_url as guide_profile_image
        FROM bookmarks b
        JOIN posts p ON b.post_id = p.id
        JOIN users u ON p.guide_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `).bind(userId).all();

      // Parse JSON fields
      const posts = results.results.map((post: any) => ({
        ...post,
        images: JSON.parse(post.images || '[]'),
        tags: JSON.parse(post.tags || '[]'),
        menu_items: JSON.parse(post.menu_items || '[]'),
        story_blocks: JSON.parse(post.story_blocks || '[]'),
        place: {
          id: post.id,
          name: post.restaurant_name,
          address: post.address,
          category: post.category,
          latitude: post.latitude,
          longitude: post.longitude
        },
        guide: {
          id: post.guide_id,
          nickname: post.guide_nickname,
          profileImageUrl: post.guide_profile_image
        }
      }));

      return Response.json({ success: true, data: posts });
    }
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { userId, postId } = await context.request.json() as { userId: string, postId: string };

    if (!userId || !postId) {
      return Response.json({ success: false, error: 'User ID and Post ID are required' }, { status: 400 });
    }

    await context.env.DB.prepare(
      'INSERT OR IGNORE INTO bookmarks (user_id, post_id) VALUES (?, ?)'
    ).bind(userId, postId).run();

    // Send notification to post owner
    try {
      // 1. Get post owner and restaurant name
      const postInfo = await context.env.DB.prepare(
        'SELECT guide_id, restaurant_name FROM posts WHERE id = ?'
      ).bind(postId).first() as { guide_id: string, restaurant_name: string } | null;

      // 2. Get user's nickname
      const user = await context.env.DB.prepare(
        'SELECT nickname FROM users WHERE id = ?'
      ).bind(userId).first() as { nickname: string } | null;

      if (postInfo && postInfo.guide_id !== userId) {
        const userNickname = user?.nickname || '새로운 미식가';
        const message = `${userNickname}님이 회원님의 '${postInfo.restaurant_name}' 포스팅을 위시리스트에 저장했습니다. 🔖`;
        
        await context.env.DB.prepare(
          "INSERT INTO notifications (user_id, type, from_user_id, message, link, created_at) VALUES (?, ?, ?, ?, ?, DATETIME('now', '+9 hours'))"
        ).bind(postInfo.guide_id, 'bookmark', userId, message, `/post/${postId}`).run();
      }
    } catch (notifError) {
      console.error('Failed to create bookmark notification:', notifError);
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');
  const postId = searchParams.get('postId');

  if (!userId || !postId) {
    return Response.json({ success: false, error: 'User ID and Post ID are required' }, { status: 400 });
  }

  try {
    await context.env.DB.prepare(
      'DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?'
    ).bind(userId, postId).run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};
