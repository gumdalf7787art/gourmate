export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: '사용자 ID가 필요합니다.' }), { status: 400 });
    }

    // 사용자와 관련된 데이터 삭제 (포스팅, 테마 등은 보존하거나 선택적으로 삭제할 수 있으나 여기서는 사용자 정보만 삭제 또는 비활성화)
    // 실제로는 정합성을 위해 트랜잭션을 사용하는 것이 좋습니다.
    
    // 1. 사용자 정보 삭제
    await DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    
    // 2. (선택적) 사용자의 포스팅도 삭제? 
    // 여기서는 일단 사용자 정보만 삭제하는 것으로 구현합니다.

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
