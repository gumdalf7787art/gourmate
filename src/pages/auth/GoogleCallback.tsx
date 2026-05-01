import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (!code) {
        alert('구글 로그인에 실패했습니다. (인증 코드 없음)');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          navigate('/');
        } else {
          alert(data.error || '로그인 처리 중 오류가 발생했습니다.');
          navigate('/login');
        }
      } catch (err) {
        console.error('Google login error:', err);
        alert('서버와 통신 중 오류가 발생했습니다.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-medium">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
}
