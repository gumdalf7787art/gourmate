import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { authService } from '@/services/authService';

export function Signup() {
  const navigate = useNavigate();
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  // 비밀번호 유효성 검사 (영문, 숫자 포함 8자 이상)
  const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password);

  const handleSignup = async () => {
    if (!email1 || email1 !== email2) {
      alert('이메일 주소를 확인해주세요.');
      return;
    }
    if (!isPasswordValid) {
      alert('비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await authService.signup({
        email: email1,
        password,
        nickname
      });
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/login');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  /** Kakao signup handler **/
  const handleKakaoLogin = () => {
    const KAKAO_REST_API_KEY = 'b5cf4e214dfb0563cfc62dcfbe89eae5';
    const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = 'PSvrhEu3rRnoRkbu0Swg';
    const REDIRECT_URI = `${window.location.origin}/auth/naver/callback`;
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('naver_auth_state', state);
    const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;
    window.location.href = naverURL;
  };

  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = '438715980569-qt98r95qlutqo6hc79a3n7s51i0l1ppl.apps.googleusercontent.com';
    const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;
    const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile openid&access_type=offline`;
    window.location.href = googleURL;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">회원가입</h1>
        <div className="w-10"></div> {/* 여백 보정용 */}
      </header>

      <div className="px-5 py-8 flex flex-col gap-8">
        
        {/* SNS Login */}
        <section>
          <h2 className="text-[11px] font-black text-gray-500 mb-5 uppercase tracking-widest text-center">SNS 계정으로 간편 가입</h2>
          <div className="flex justify-center gap-6">
            {/* Kakao */}
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={handleKakaoLogin}
                className="w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-yellow-500/10"
              >
                <span className="text-[#191919] font-black text-[11px]">카카오</span>
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-gray-400 font-bold">카카오톡</span>
                <span className="text-[10px] text-gray-500">가입하기</span>
              </div>
            </div>
            {/* Naver */}
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={handleNaverLogin}
                className="w-14 h-14 bg-[#03C75A] rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-green-500/10"
              >
                <span className="text-white font-black text-[11px]">네이버</span>
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-gray-400 font-bold">네이버</span>
                <span className="text-[10px] text-gray-500">가입하기</span>
              </div>
            </div>
            {/* Google */}
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={handleGoogleLogin}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/5"
              >
                <span className="text-black font-black text-[11px]">구글</span>
              </button>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-gray-400 font-bold">구글</span>
                <span className="text-[10px] text-gray-500">가입하기</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 py-4">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-xs text-gray-500 font-medium">또는 이메일로 가입</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        {/* Email Signup */}
        <section className="flex flex-col gap-6">
          
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">이메일 (아이디)</label>
            <input 
              type="email" 
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
              placeholder="이메일을 입력해주세요" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            {email1 && (
              <p className={`text-[10px] mt-1 ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email1) ? 'text-green-500' : 'text-red-500'}`}>
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email1) ? '이메일 형식이 맞습니다.' : '이메일 형식이 아닙니다.'}
              </p>
            )}
            
            <input 
              type="email" 
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              placeholder="이메일을 한번 더 입력해주세요" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors mt-2"
            />
            {email2 && (
              <p className={`text-[10px] mt-1 ${email1 === email2 ? 'text-green-500' : 'text-red-500'}`}>
                {email1 === email2 ? '아이디 동일함.' : '동일하지 않음.'}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <p className={`text-xs mt-1 ${isPasswordValid ? 'text-green-500' : 'text-gray-500'}`}>
              영문, 숫자, 8자
            </p>
            
            <input 
              type="password" 
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 한번 더 입력해주세요" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors mt-2"
            />
            {passwordConfirm && (
              <p className={`text-[10px] mt-1 ${password === passwordConfirm ? 'text-green-500 text-xs' : 'text-red-500'}`}>
                {password === passwordConfirm ? '비밀번호 일치.' : '비밀번호 불일치.'}
              </p>
            )}
          </div>

          {/* Nickname */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">닉네임</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력해주세요" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <button 
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-4 mt-6 ${loading ? 'bg-gray-600' : 'bg-primary-500 hover:bg-primary-600'} text-white font-black rounded-xl transition-colors shadow-lg shadow-primary-500/20`}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </section>
      </div>
    </div>
  );
}
