export const onRequestPost: PagesFunction<{ DB: D1Database; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string }> = async (context) => {
  try {
    const { DB, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = context.env;
    const { code } = await context.request.json() as { code: string };

    if (!code) {
      return new Response(JSON.stringify({ error: '인증 코드가 없습니다.' }), { status: 400 });
    }

    // 1. 구글 토큰 요청
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${new URL(context.request.url).origin}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error_description || '토큰 요청 실패' }), { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // 2. 구글 사용자 정보 요청
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const googleUser = await userResponse.json() as any;
    if (googleUser.error) {
      return new Response(JSON.stringify({ error: googleUser.error.message || '사용자 정보 요청 실패' }), { status: 400 });
    }

    const googleId = googleUser.id;
    const nickname = googleUser.name || '구글 사용자';
    const profileImageUrl = googleUser.picture || '';
    const email = googleUser.email;

    // 3. 기존 회원 확인
    let user = await DB.prepare('SELECT * FROM users WHERE id = ? OR email = ?')
      .bind(`google_${googleId}`, email)
      .first() as any;

    if (!user) {
      // 4. 신규 회원이면 자동 가입
      const id = `google_${googleId}`;
      const passwordHash = 'SOCIAL_LOGIN_NO_PASSWORD';
      
      await DB.prepare('INSERT INTO users (id, email, password_hash, nickname, profile_image_url) VALUES (?, ?, ?, ?, ?)')
        .bind(id, email, passwordHash, nickname, profileImageUrl)
        .run();
        
      user = { id, email, nickname, profileImageUrl, trustScore: 50, isOfficial: 0 };
    } else {
      // 기존 회원이면 정보 업데이트
      await DB.prepare('UPDATE users SET nickname = ?, profile_image_url = ? WHERE id = ?')
        .bind(nickname, profileImageUrl || user.profile_image_url, user.id)
        .run();
        
      user = {
        ...user,
        nickname: nickname,
        profileImageUrl: profileImageUrl || user.profile_image_url
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profileImageUrl: user.profile_image_url,
        trustScore: user.trust_score || 50,
        isOfficial: user.is_official === 1
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
