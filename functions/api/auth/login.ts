export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: '이메일과 비밀번호를 입력해주세요.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user: any = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: '가입되지 않은 이메일입니다.' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const passwordHash = await hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return new Response(JSON.stringify({ error: '비밀번호가 일치하지 않습니다.' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Login success
    // In a real app, we would set a session cookie or return a JWT
    return new Response(JSON.stringify({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        nickname: user.nickname,
        profileImageUrl: user.profile_image_url,
        trustScore: user.trust_score,
        isOfficial: user.is_official
      } 
    }), {
      status: 200,
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
