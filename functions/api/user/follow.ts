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
        SELECT u.id, u.nickname, u.profile_image_url, u.trust_score, 
               (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ?
        ORDER BY f.created_at DESC
      `).bind(followerId).all();

      return Response.json({ success: true, data: results.results });
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

    await context.env.DB.prepare(
      'INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)'
    ).bind(followerId, followingId).run();

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
