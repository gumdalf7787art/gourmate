export const onRequestPost: PagesFunction<{ DB: D1Database; KAKAO_REST_API_KEY: string }> = async (context) => {
  try {
    const { DB, KAKAO_REST_API_KEY } = context.env;
    const { code, redirectUri } = await context.request.json() as { code: string; redirectUri: string };

    if (!code) {
      return new Response(JSON.stringify({ error: '인증 코드가 없습니다.' }), { status: 400 });
    }

    // 1. 카카오 토큰 요청
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      return new Response(JSON.stringify({ error: tokenData.error_description || '토큰 요청 실패' }), { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // 2. 카카오 사용자 정보 요청
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userResponse.json() as any;
    const kakaoId = userData.id.toString();
    const nickname = userData.kakao_account?.profile?.nickname || '카카오 사용자';
    const profileImageUrl = userData.kakao_account?.profile?.profile_image_url || '';
    const email = userData.kakao_account?.email || `${kakaoId}@kakao.user`;

    // 3. 기존 회원 확인 (카카오 ID 또는 이메일로 확인)
    let user = await DB.prepare('SELECT * FROM users WHERE id = ? OR email = ?')
      .bind(`kakao_${kakaoId}`, email)
      .first() as any;

    if (!user) {
      // 4. 신규 회원이면 자동 가입
      const id = `kakao_${kakaoId}`;
      const passwordHash = 'SOCIAL_LOGIN_NO_PASSWORD'; // 소셜 로그인은 비밀번호 없음
      
      await DB.prepare('INSERT INTO users (id, email, password_hash, nickname, profile_image_url) VALUES (?, ?, ?, ?, ?)')
        .bind(id, email, passwordHash, nickname, profileImageUrl)
        .run();
        
      user = { id, email, nickname, profileImageUrl, trustScore: 50, isOfficial: 0 };
    } else {
      // 기존 회원이면 정보 업데이트 (선택 사항)
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
