import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';

export function ProfileSettings() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [profileImage, setProfileImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nickname, setNickname] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [isOldPasswordValid, setIsOldPasswordValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // 기존 비밀번호 실시간 검증 (Debounce)
  useEffect(() => {
    if (!oldPassword) {
      setIsOldPasswordValid(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await authService.verifyPassword({
          userId: user?.id,
          password: oldPassword
        });
        setIsOldPasswordValid(res.isValid);
      } catch (err) {
        setIsOldPasswordValid(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [oldPassword, user?.id]);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setProfileImage(user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nickname)}&background=333&color=fff`);
    }
  }, [user]);

  const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(newPassword);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (newPassword && newPassword !== newPasswordConfirm) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword && !isPasswordValid) {
      alert('새 비밀번호 형식이 올바르지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      let finalProfileImageUrl = profileImage;

      // 이미지가 새로 선택되었다면 업로드 진행
      if (selectedFile) {
        const { uploadService } = await import('@/services/uploadService');
        const uploadRes = await uploadService.uploadImage(selectedFile);
        if (uploadRes.success) {
          finalProfileImageUrl = uploadRes.url;
        } else {
          throw new Error(uploadRes.error || '이미지 업로드에 실패했습니다.');
        }
      }

      const response = await authService.updateSettings({
        userId: user?.id,
        nickname,
        profileImageUrl: finalProfileImageUrl,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined
      });

      if (response.success) {
        setUser({
          ...user!,
          nickname: response.user.nickname,
          profileImageUrl: response.user.profileImageUrl
        });
        alert('정보가 성공적으로 저장되었습니다.');
        navigate(-1);
      }
    } catch (err: any) {
      alert(err.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">정보 설정</h1>
        <div className="w-10"></div> {/* 여백 보정용 */}
      </header>

      <form onSubmit={handleSave} className="px-5 py-8 flex flex-col gap-10">
        
        {/* 1. 프로필 사진 설정 */}
        <section className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500 bg-[#111]">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname)}&background=333&color=fff`;
                }}
              />
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black cursor-pointer shadow-lg active:scale-95 transition-transform">
              <Camera className="w-4 h-4 text-black" />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  setProfileImage(URL.createObjectURL(file));
                }
              }} />
            </label>
          </div>
          <p className="text-xs text-gray-500 font-medium">프로필 사진을 변경하려면 카메라 아이콘을 누르세요.</p>
        </section>

        {/* 2. 닉네임 설정 */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white">닉네임</label>
          <input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="사용하실 닉네임을 입력해주세요" 
            className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </section>

        {/* 3. 비밀번호 변경 */}
        <section className="flex flex-col gap-2 pt-6 border-t border-white/10">
          <h2 className="text-sm font-bold text-white mb-2">비밀번호 변경</h2>
          
          <input 
            type="password" 
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="기존 비밀번호 입력" 
            className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
          {oldPassword && isOldPasswordValid !== null && (
            <p className={`text-[10px] mt-1 ${isOldPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
              {isOldPasswordValid ? '기존 비밀번호가 일치합니다.' : '기존 비밀번호가 일치하지 않습니다.'}
            </p>
          )}
          
          <div className="mt-4">
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            <p className={`text-xs mt-1 ${isPasswordValid ? 'text-green-500' : 'text-gray-500'}`}>
              영문, 숫자, 8자
            </p>
          </div>

          <div className="mt-2">
            <input 
              type="password" 
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호 다시 입력" 
              className="w-full px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
            {newPasswordConfirm && (
              <p className={`text-[10px] mt-1 ${newPassword === newPasswordConfirm ? 'text-green-500 text-xs' : 'text-red-500'}`}>
                {newPassword === newPasswordConfirm ? '비밀번호 일치.' : '비밀번호 불일치.'}
              </p>
            )}
          </div>
        </section>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-4 mt-6 ${isLoading ? 'bg-gray-600' : 'bg-primary-500 hover:bg-primary-600'} text-white font-black rounded-xl transition-colors shadow-lg shadow-primary-500/20`}
        >
          {isLoading ? '저장 중...' : '저장하기'}
        </button>
      </form>
    </div>
  );
}
