export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');
  const themeId = searchParams.get('themeId');

  if (!userId || !themeId) {
    return Response.json({ success: false, error: 'User ID and Theme ID are required' }, { status: 400 });
  }

  try {
    const result = await context.env.DB.prepare(
      'SELECT 1 FROM theme_follows WHERE user_id = ? AND theme_id = ?'
    ).bind(userId, themeId).first();
    
    return Response.json({ success: true, isFollowed: !!result });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { userId, themeId } = await context.request.json() as { userId: string, themeId: string };

    if (!userId || !themeId) {
      return Response.json({ success: false, error: 'User ID and Theme ID are required' }, { status: 400 });
    }

    // 1. Create table if not exists
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS theme_follows (
        user_id TEXT NOT NULL,
        theme_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(user_id, theme_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (theme_id) REFERENCES themes(id)
      )
    `).run();

    // 2. Insert follow record
    await context.env.DB.prepare(
      'INSERT OR IGNORE INTO theme_follows (user_id, theme_id) VALUES (?, ?)'
    ).bind(userId, themeId).run();

    // 3. Send notification to theme owner
    try {
      // Get theme info
      const themeInfo = await context.env.DB.prepare(
        'SELECT guide_id, title FROM themes WHERE id = ?'
      ).bind(themeId).first() as { guide_id: string, title: string } | null;

      // Get follower nickname
      const follower = await context.env.DB.prepare(
        'SELECT nickname FROM users WHERE id = ?'
      ).bind(userId).first() as { nickname: string } | null;

      if (themeInfo && themeInfo.guide_id !== userId) {
        const followerNickname = follower?.nickname || '새로운 미식가';
        const message = `${followerNickname}님이 회원님의 '${themeInfo.title}' 테마를 구독하기 시작했습니다. 📂`;
        
        await context.env.DB.prepare(
          "INSERT INTO notifications (user_id, type, from_user_id, message, link, created_at) VALUES (?, ?, ?, ?, ?, DATETIME('now', '+9 hours'))"
        ).bind(themeInfo.guide_id, 'theme_follow', userId, message, `/theme/${themeId}`).run();
      }
    } catch (notifError) {
      console.error('Failed to create theme follow notification:', notifError);
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');
  const themeId = searchParams.get('themeId');

  if (!userId || !themeId) {
    return Response.json({ success: false, error: 'User ID and Theme ID are required' }, { status: 400 });
  }

  try {
    await context.env.DB.prepare(
      'DELETE FROM theme_follows WHERE user_id = ? AND theme_id = ?'
    ).bind(userId, themeId).run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};
