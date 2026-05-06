export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID가 필요합니다.' }), { status: 400 });
    }

    // 1. 테이블 초기화 (Post Views & Bookmarks)
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS post_views (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        viewer_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `).run();

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `).run();

    // 2. 기본 통계 조회 (내 포스팅 기준)
    // 총 조회수 (임시로 posts 테이블의 likes 값을 활용하거나 post_views 합산)
    const totalViewsRes = await DB.prepare(`
      SELECT COUNT(*) as count FROM post_views pv
      JOIN posts p ON pv.post_id = p.id
      WHERE p.guide_id = ?
    `).bind(userId).first() as any;

    const totalLikesRes = await DB.prepare(`
      SELECT SUM(likes) as count FROM posts WHERE guide_id = ?
    `).bind(userId).first() as any;

    const totalCommentsRes = await DB.prepare(`
      SELECT COUNT(*) as count FROM reviews r
      JOIN posts p ON r.post_id = p.id
      WHERE p.guide_id = ?
    `).bind(userId).first() as any;

    const totalBookmarksRes = await DB.prepare(`
      SELECT COUNT(*) as count FROM bookmarks b
      JOIN posts p ON b.post_id = p.id
      WHERE p.guide_id = ?
    `).bind(userId).first() as any;

    // 3. 인기 포스팅 순위 (조회수 기준)
    const topPosts = await DB.prepare(`
      SELECT 
        p.id, p.restaurant_name, p.images, p.likes, p.rating,
        (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) as views_total,
        (SELECT COUNT(*) FROM post_views WHERE post_id = p.id AND created_at >= date('now')) as views_daily,
        (SELECT COUNT(*) FROM post_views WHERE post_id = p.id AND created_at >= date('now', 'start of month')) as views_monthly
      FROM posts p
      WHERE p.guide_id = ?
      ORDER BY views_total DESC
      LIMIT 5
    `).bind(userId).all();

    // 4. 최근 댓글
    const recentComments = await DB.prepare(`
      SELECT 
        r.id, r.content, r.created_at,
        u.nickname as author, u.profile_image_url as profile,
        p.restaurant_name as postName
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN posts p ON r.post_id = p.id
      WHERE p.guide_id = ?
      ORDER BY r.created_at DESC
      LIMIT 4
    `).bind(userId).all();

    // 5. 트렌드 데이터 (주간 기준 예시)
    const weekTrend = await DB.prepare(`
      SELECT 
        strftime('%w', pv.created_at) as day_of_week,
        COUNT(*) as count
      FROM post_views pv
      JOIN posts p ON pv.post_id = p.id
      WHERE p.guide_id = ? AND pv.created_at >= date('now', '-7 days')
      GROUP BY day_of_week
      ORDER BY day_of_week ASC
    `).bind(userId).all();

    // 요일별 데이터 채우기 (0=일요일, ..., 6=토요일)
    const trendDataWeek = Array(7).fill(0);
    weekTrend.results.forEach((row: any) => {
      trendDataWeek[parseInt(row.day_of_week)] = row.count;
    });

    const data = {
      stats: {
        totalViews: totalViewsRes?.count || 0,
        totalLikes: totalLikesRes?.count || 0,
        totalBookmarks: totalBookmarksRes?.count || 0,
        totalComments: totalCommentsRes?.count || 0,
        viewsGrowth: 0
      },
      topPosts: topPosts.results.map((p: any) => ({
        id: p.id,
        likes: p.likes,
        rating: p.rating,
        images: JSON.parse(p.images || '[]'),
        place: {
          name: p.restaurant_name
        },
        views: {
          daily: p.views_daily,
          monthly: p.views_monthly,
          total: p.views_total
        }
      })),
      recentComments: recentComments.results.map((c: any) => ({
        id: c.id,
        content: c.content,
        author: c.author,
        profile: c.profile,
        postName: c.postName,
        time: formatRelativeTime(c.created_at)
      })),
      trendData: {
        week: trendDataWeek,
        today: [0, 0, 0, 0, 0, 0, 0],
        month: [0, 0, 0, 0],
        year: Array(12).fill(0)
      }
    };

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}
