export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { userId, password } = body;

    if (!userId || !password) {
      return new Response(JSON.stringify({ error: '데이터가 부족합니다.' }), { status: 400 });
    }

    const user: any = await DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(userId).first();
    if (!user) {
      return new Response(JSON.stringify({ error: '사용자를 찾을 수 없습니다.' }), { status: 404 });
    }

    const hash = await hashPassword(password);
    const isValid = user.password_hash === hash;

    return new Response(JSON.stringify({ isValid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

async function hashPassword(password: string) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
