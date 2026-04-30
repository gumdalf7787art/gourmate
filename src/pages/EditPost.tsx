import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

export function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [content, setContent] = useState('');
  const [postTitle, setPostTitle] = useState('');

  useEffect(() => {
    // 실제로는 API에서 ID로 포스트를 불러와야 함
    const post = MOCK_POSTS.find(p => p.id === id);
    if (post) {
      setContent(post.content);
      setPostTitle(post.place.name);
    } else {
      alert('포스트를 찾을 수 없습니다.');
      navigate(-1);
    }
  }, [id, navigate]);

  const handleSave = () => {
    // 실제로는 API 호출로 내용 업데이트
    alert('수정이 완료되었습니다.');
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">포스팅 수정</h1>
        <div className="w-10"></div> {/* 여백 보정용 */}
      </header>

      <div className="px-5 py-6 flex flex-col gap-6 flex-1">
        
        {/* 장소명 (읽기 전용) */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white">장소</label>
          <div className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-gray-400">
            {postTitle}
          </div>
        </section>

        {/* 내용 수정 */}
        <section className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-bold text-white">내용</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-48 px-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors resize-none leading-relaxed"
            placeholder="포스팅 내용을 수정해주세요"
          />
        </section>

      </div>

      {/* Action Buttons (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto p-5 bg-black/90 backdrop-blur border-t border-white/10 flex gap-3 z-50 pb-safe">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 py-4 bg-[#111] text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
        >
          취소
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 py-4 bg-primary-500 text-white font-black rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
        >
          수정 완료
        </button>
      </div>
    </div>
  );
}
