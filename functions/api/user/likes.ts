export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');
  const postId = searchParams.get('postId');

  if (!userId || !postId) {
    return Response.json({ success: false, error: 'User ID and Post ID are required' }, { status: 400 });
  }

  try {
    const result = await context.env.DB.prepare(
      'SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?'
    ).bind(userId, postId).first();
    
    return Response.json({ success: true, isLiked: !!result });
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

    // Use a transaction to update both the likes table and the post's like count
    await context.env.DB.batch([
      context.env.DB.prepare('INSERT OR IGNORE INTO likes (user_id, post_id) VALUES (?, ?)').bind(userId, postId),
      context.env.DB.prepare('UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = ?').bind(postId)
    ]);

    // Send notification to post owner
    try {
      // 1. Get post owner and restaurant name
      const postInfo = await context.env.DB.prepare(
        'SELECT guide_id, restaurant_name FROM posts WHERE id = ?'
      ).bind(postId).first() as { guide_id: string, restaurant_name: string } | null;

      // 2. Get liker's nickname
      const liker = await context.env.DB.prepare(
        'SELECT nickname FROM users WHERE id = ?'
      ).bind(userId).first() as { nickname: string } | null;

      if (postInfo && postInfo.guide_id !== userId) {
        const likerNickname = liker?.nickname || '새로운 미식가';
        const message = `${likerNickname}님이 회원님의 '${postInfo.restaurant_name}' 포스팅을 좋아합니다. ❤️`;
        
        await context.env.DB.prepare(
          "INSERT INTO notifications (user_id, type, from_user_id, message, link, created_at) VALUES (?, ?, ?, ?, ?, DATETIME('now', '+9 hours'))"
        ).bind(postInfo.guide_id, 'like', userId, message, `/post/${postId}`).run();
      }
    } catch (notifError) {
      console.error('Failed to create like notification:', notifError);
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
    // Use a transaction to update both the likes table and the post's like count
    const exists = await context.env.DB.prepare('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?').bind(userId, postId).first();
    
    if (exists) {
      await context.env.DB.batch([
        context.env.DB.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').bind(userId, postId),
        context.env.DB.prepare('UPDATE posts SET likes = MAX(0, COALESCE(likes, 0) - 1) WHERE id = ?').bind(postId)
      ]);
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};
