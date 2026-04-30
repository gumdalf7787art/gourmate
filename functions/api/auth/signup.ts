export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { email, password, nickname } = body;

    // Validation
    if (!email || !password || !nickname) {
      return new Response(JSON.stringify({ error: '필수 입력 항목이 누락되었습니다.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if email already exists
    const existingEmail = await DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existingEmail) {
      return new Response(JSON.stringify({ error: '이미 가입된 이메일입니다.' }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if nickname already exists
    const existingNickname = await DB.prepare('SELECT id FROM users WHERE nickname = ?').bind(nickname).first();
    if (existingNickname) {
      return new Response(JSON.stringify({ error: '이미 사용 중인 닉네임입니다.' }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate ID and Hash Password
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    // Insert user
    await DB.prepare('INSERT INTO users (id, email, password_hash, nickname) VALUES (?, ?, ?, ?)')
      .bind(id, email, passwordHash, nickname)
      .run();

    return new Response(JSON.stringify({ 
      success: true, 
      user: { id, email, nickname } 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function hashPassword(password: string) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
