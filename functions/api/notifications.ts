export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { searchParams } = new URL(context.request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  try {
    const results = await context.env.DB.prepare(
      'SELECT id, type, message, is_read as isRead, created_at as createdAt, from_user_id as fromUserId, link FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(userId).all();

    return Response.json({ success: true, data: results.results });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};

export const onRequestPatch: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { notificationId } = await context.request.json() as { notificationId: number };

    if (!notificationId) {
      return Response.json({ success: false, error: 'Notification ID is required' }, { status: 400 });
    }

    await context.env.DB.prepare(
      'UPDATE notifications SET is_read = 1 WHERE id = ?'
    ).bind(notificationId).run();

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};
