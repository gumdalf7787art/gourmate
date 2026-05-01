export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { DB } = context.env;
    const body = await context.request.json() as any;
    const { userId, nickname, profileImageUrl, oldPassword, newPassword } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: '사용자 ID가 필요합니다.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Get current user
    const user: any = await DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
    if (!user) {
      return new Response(JSON.stringify({ error: '사용자를 찾을 수 없습니다.' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let passwordHash = user.password_hash;
    let passwordChanged = false;

    // 2. If new password is provided
    if (newPassword) {
      if (!oldPassword) {
        return new Response(JSON.stringify({ error: '비밀번호를 변경하려면 기존 비밀번호를 입력해야 합니다.' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const oldHash = await hashPassword(oldPassword);
      if (user.password_hash !== oldHash) {
        return new Response(JSON.stringify({ error: '기존 비밀번호가 일치하지 않습니다.' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      passwordHash = await hashPassword(newPassword);
      passwordChanged = true;
    }

    // 3. Update DB
    await DB.prepare('UPDATE users SET nickname = ?, profile_image_url = ?, password_hash = ? WHERE id = ?')
      .bind(nickname || user.nickname, profileImageUrl || user.profile_image_url, passwordHash, userId)
      .run();

    return new Response(JSON.stringify({ 
      success: true,
      passwordChanged,
      user: {
        id: userId,
        nickname: nickname || user.nickname,
        profileImageUrl: profileImageUrl || user.profile_image_url
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
