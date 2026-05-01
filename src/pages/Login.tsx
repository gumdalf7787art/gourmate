import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">로그인</h1>
        <div className="w-10"></div> {/* 여백 보정용 */}
      </header>

      <div className="px-5 py-8 flex flex-col gap-8">
        
        {/* SNS Login */}
        <section>
          <h2 className="text-[11px] font-black text-gray-500 mb-5 uppercase tracking-widest text-center">SNS 계정으로 간편 로그인</h2>
          <div className="flex justify-center gap-6">
            {/* Kakao */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-yellow-500/10">
                <span className="text-[#191919] font-black text-[11px]">카카오</span>
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-gray-400 font-bold">카카오톡</span>
                <span className="text-[10px] text-gray-500">로그인</span>
              </div>
            </div>
            {/* Naver */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 bg-[#03C75A] rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-green-500/10">
                <span className="text-white font-black text-[11px]">네이버</span>
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-gray-400 font-bold">네이버</span>
                <span className="text-[10px] text-gray-500">로그인</span>
              </div>
            </div>
            {/* Google */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/5">
                <span className="text-black font-black text-[11px]">구글</span>
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-gray-400 font-bold">구글</span>
                <span className="text-[10px] text-gray-500">로그인</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 py-4">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-xs text-gray-500 font-medium">또는 이메일로 로그인</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        {/* Email Login */}
        <section className="flex flex-col gap-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요" 
                className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요" 
                className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 mt-2 ${loading ? 'bg-gray-600' : 'bg-primary-500 hover:bg-primary-600'} text-white font-black rounded-xl transition-colors shadow-lg shadow-primary-500/20`}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-400 mt-2">
            <Link to="/signup" className="hover:text-white transition-colors">
              회원이 아니면 <span className="font-bold text-white ml-1">회원가입</span>
            </Link>
            <div className="w-[1px] h-3 bg-white/20"></div>
            <Link to="/find-password" className="hover:text-white transition-colors">
              비밀번호 찾기
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
