import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Medal, 
  Trash2, Plus, Star, 
  ChevronUp, ChevronDown, Save
} from 'lucide-react';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/store/useAuthStore';

export function ManageTop20() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [top20, setTop20] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await postService.getGuideProfile(user.id);
      if (res.success) {
        const posts = res.data.posts || [];
        // 이미 순위가 매겨진 것들 (topRank 1~20)
        const selected = posts
          .filter((p: any) => p.topRank !== null)
          .sort((a: any, b: any) => a.topRank - b.topRank);
        
        // 나머지 포스트들
        const others = posts
          .filter((p: any) => p.topRank === null);

        setTop20(selected);
        setAllPosts(others);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (post: any) => {
    if (top20.length >= 20) {
      alert('최대 20개까지만 선택할 수 있습니다.');
      return;
    }
    setTop20([...top20, post]);
    setAllPosts(allPosts.filter(p => p.id !== post.id));
  };

  const handleRemove = (post: any) => {
    setTop20(top20.filter(p => p.id !== post.id));
    setAllPosts([post, ...allPosts]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newTop20 = [...top20];
    [newTop20[index - 1], newTop20[index]] = [newTop20[index], newTop20[index - 1]];
    setTop20(newTop20);
  };

  const moveDown = (index: number) => {
    if (index === top20.length - 1) return;
    const newTop20 = [...top20];
    [newTop20[index + 1], newTop20[index]] = [newTop20[index], newTop20[index + 1]];
    setTop20(newTop20);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const top20Ids = top20.map(p => p.id);
      const res = await postService.updateTop20(user.id, top20Ids);
      if (res.success) {
        alert('성공적으로 저장되었습니다.');
        navigate(-1);
      } else {
        alert(res.error || '저장 중 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">가이드 추천 Top 20 설정</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-primary-500 text-white text-sm font-black rounded-xl active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : <><Save className="w-4 h-4" /> 저장</>}
        </button>
      </header>

      <main className="px-5 py-8 space-y-12">
        {/* Top 20 List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-black">나의 Top 20 리스트</h2>
              <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-lg text-[10px] font-bold text-gray-400">
                {top20.length} / 20
              </span>
            </div>
          </div>

          {top20.length === 0 ? (
            <div className="bg-[#111] border border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 text-sm mb-4">선택된 포스트가 없습니다.<br/>아래 목록에서 추가해 주세요.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {top20.map((post, idx) => (
                <div key={post.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-xs shrink-0">
                    {idx + 1}
                  </div>
                  
                  <img src={post.images[0]} className="w-16 h-16 rounded-xl object-cover shrink-0" alt="" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate mb-1">{post.place.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{post.rating}</span>
                      <span className="opacity-30">|</span>
                      <span className="truncate">{post.place.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 disabled:opacity-20"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveDown(idx)}
                      disabled={idx === top20.length - 1}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 disabled:opacity-20"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemove(post)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Posts List */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-black">나의 전체 포스팅</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {allPosts.map((post) => (
              <div key={post.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                <img src={post.images[0]} className="w-16 h-16 rounded-xl object-cover shrink-0" alt="" />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate mb-1">{post.place.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{post.rating}</span>
                    <span className="opacity-30">|</span>
                    <span className="truncate">{post.place.address}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleAdd(post)}
                  className="px-4 py-2 bg-white/5 hover:bg-primary-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> 추가
                </button>
              </div>
            ))}
            {allPosts.length === 0 && !isLoading && (
              <p className="text-center text-gray-600 text-sm py-10">추가할 수 있는 포스팅이 없습니다.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
