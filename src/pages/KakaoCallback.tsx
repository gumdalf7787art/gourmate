import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      alert(`카카오 로그인 실패: ${error}`);
      navigate('/login');
      return;
    }

    if (code) {
      handleKakaoLogin(code);
    }
  }, [searchParams]);

  const handleKakaoLogin = async (code: string) => {
    try {
      const response = await fetch('/api/auth/kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          redirectUri: window.location.origin + window.location.pathname,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        navigate('/', { replace: true });
      } else {
        throw new Error(data.error || '로그인 처리 중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      alert(err.message);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-bold">카카오 로그인 처리 중...</p>
    </div>
  );
}
