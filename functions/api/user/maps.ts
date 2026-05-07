export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');
  const mapId = searchParams.get('mapId');

  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  try {
    if (mapId) {
      // Get posts for a specific map or ALL maps
      const query = mapId === 'all' 
        ? `SELECT DISTINCT p.*, u.nickname as guide_nickname, u.profile_image_url as guide_profile_image
           FROM user_map_items umi
           JOIN user_maps um ON umi.map_id = um.id
           JOIN posts p ON umi.post_id = p.id
           JOIN users u ON p.guide_id = u.id
           WHERE um.user_id = ?
           ORDER BY umi.created_at DESC`
        : `SELECT p.*, u.nickname as guide_nickname, u.profile_image_url as guide_profile_image
           FROM user_map_items umi
           JOIN posts p ON umi.post_id = p.id
           JOIN users u ON p.guide_id = u.id
           WHERE umi.map_id = ?
           ORDER BY umi.created_at DESC`;

      const results = await context.env.DB.prepare(query).bind(mapId === 'all' ? userId : mapId).all();

      const posts = results.results.map((post: any) => ({
        ...post,
        images: JSON.parse(post.images || '[]'),
        tags: JSON.parse(post.tags || '[]'),
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
    } else {
      // Get all maps for user
      const results = await context.env.DB.prepare(`
        SELECT m.*, COUNT(umi.post_id) as post_count
        FROM user_maps m
        LEFT JOIN user_map_items umi ON m.id = umi.map_id
        WHERE m.user_id = ?
        GROUP BY m.id
        ORDER BY m.created_at DESC
      `).bind(userId).all();

      return Response.json({ success: true, data: results.results });
    }
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const data = await context.request.json() as any;
    const { action, userId, mapId, postId, name } = data;

    if (action === 'create_map') {
      if (!userId || !name) {
        return Response.json({ success: false, error: 'User ID and Name are required' }, { status: 400 });
      }
      const id = crypto.randomUUID();
      await context.env.DB.prepare(
        'INSERT INTO user_maps (id, user_id, name) VALUES (?, ?, ?)'
      ).bind(id, userId, name).run();
      return Response.json({ success: true, id });
    } 
    
    if (action === 'add_item') {
      if (!mapId || !postId) {
        return Response.json({ success: false, error: 'Map ID and Post ID are required' }, { status: 400 });
      }
      await context.env.DB.prepare(
        'INSERT OR IGNORE INTO user_map_items (map_id, post_id) VALUES (?, ?)'
      ).bind(mapId, postId).run();
      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const action = searchParams.get('action');
  const mapId = searchParams.get('mapId');
  const postId = searchParams.get('postId');

  try {
    if (action === 'delete_map' && mapId) {
      await context.env.DB.batch([
        context.env.DB.prepare('DELETE FROM user_map_items WHERE map_id = ?').bind(mapId),
        context.env.DB.prepare('DELETE FROM user_maps WHERE id = ?').bind(mapId)
      ]);
      return Response.json({ success: true });
    }

    if (action === 'remove_item' && mapId && postId) {
      await context.env.DB.prepare(
        'DELETE FROM user_map_items WHERE map_id = ? AND post_id = ?'
      ).bind(mapId, postId).run();
      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};
