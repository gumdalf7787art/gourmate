export const onRequestPost: PagesFunction<{ DB: D1Database; NAVER_CLIENT_ID: string; NAVER_CLIENT_SECRET: string }> = async (context) => {
  try {
    const { DB, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } = context.env;
    const { code, state } = await context.request.json() as { code: string; state: string };

    if (!code || !state) {
      return new Response(JSON.stringify({ error: '인증 코드 또는 상태 값이 없습니다.' }), { status: 400 });
    }

    // 1. 네이버 토큰 요청
    const tokenResponse = await fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`);

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error_description || '토큰 요청 실패' }), { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // 2. 네이버 사용자 정보 요청
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userResponse.json() as any;
    if (userData.resultcode !== '00') {
      return new Response(JSON.stringify({ error: userData.message || '사용자 정보 요청 실패' }), { status: 400 });
    }

    const naverUser = userData.response;
    const naverId = naverUser.id;
    const nickname = naverUser.nickname || '네이버 사용자';
    const profileImageUrl = naverUser.profile_image || '';
    const email = naverUser.email || `${naverId}@naver.user`;

    // 3. 기존 회원 확인
    let user = await DB.prepare('SELECT * FROM users WHERE id = ? OR email = ?')
      .bind(`naver_${naverId}`, email)
      .first() as any;

    if (!user) {
      // 4. 신규 회원이면 자동 가입
      const id = `naver_${naverId}`;
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
