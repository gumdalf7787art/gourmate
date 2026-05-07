export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const followerId = searchParams.get('followerId');
  const followingId = searchParams.get('followingId');

  if (!followerId) {
    return Response.json({ success: false, error: 'Follower ID is required' }, { status: 400 });
  }

  try {
    if (followingId) {
      // Check if following specific user
      const result = await context.env.DB.prepare(
        'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?'
      ).bind(followerId, followingId).first();
      
      return Response.json({ success: true, isFollowing: !!result });
    } else {
      // Get all followed guides for user
      const results = await context.env.DB.prepare(`
        SELECT u.id, u.nickname, u.profile_image_url as profileImageUrl, u.trust_score as trustScore, u.bio,
               (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers,
               (SELECT SUM(likes) FROM posts WHERE guide_id = u.id) as likes
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ?
        ORDER BY f.created_at DESC
      `).bind(followerId).all();

      const guides = results.results.map((g: any) => ({
        ...g,
        bio: g.bio || '맛있는 음식과 멋진 공간을 기록합니다.',
        likes: g.likes || 0
      }));

      return Response.json({ success: true, data: guides });
    }
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { followerId, followingId } = await context.request.json() as { followerId: string, followingId: string };

    if (!followerId || !followingId) {
      return Response.json({ success: false, error: 'Both IDs are required' }, { status: 400 });
    }

    if (followerId === followingId) {
      return Response.json({ success: false, error: 'Cannot follow yourself' }, { status: 400 });
    }

    // 1. Get follower's nickname to create message
    const follower = await context.env.DB.prepare(
      'SELECT nickname FROM users WHERE id = ?'
    ).bind(followerId).first() as { nickname: string } | null;

    // 2. Insert follow record
    await context.env.DB.prepare(
      'INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)'
    ).bind(followerId, followingId).run();

    // 3. Create notification for the target user (followingId) - Wrap in try-catch to be resilient
    try {
      // Use fallback nickname if not found
      const followerNickname = follower?.nickname || '새로운 미식가';
      const message = `${followerNickname}님이 회원님을 팔로우하기 시작했습니다. 👤`;
      
      await context.env.DB.prepare(
        'INSERT INTO notifications (user_id, type, from_user_id, message, link) VALUES (?, ?, ?, ?, ?)'
      ).bind(followingId, 'follow', followerId, message, `/guide/${followerId}`).run();
      
      console.log(`Notification created for ${followingId} from ${followerId}`);
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const followerId = searchParams.get('followerId');
  const followingId = searchParams.get('followingId');

  if (!followerId || !followingId) {
    return Response.json({ success: false, error: 'Both IDs are required' }, { status: 400 });
  }

  try {
    await context.env.DB.prepare(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?'
    ).bind(followerId, followingId).run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};
