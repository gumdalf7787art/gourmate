import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Layers, SlidersHorizontal } from 'lucide-react';
import { postService } from '@/services/postService';

export default function PopularThemes() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'popular' | 'latest'>('popular');

  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      try {
        const res = await postService.getThemes();
        // Backend returns { success: true, data: [...] }
        const data = res.success ? res.data : (Array.isArray(res) ? res : []);
        setThemes(data);
      } catch (err) {
        console.error('Failed to fetch themes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const sortedThemes = useMemo(() => {
    return [...themes].sort((a, b) => {
      if (sortOrder === 'popular') {
        const scoreA = (a.likes || 0) * 2 + (a.post_count || 0);
        const scoreB = (b.likes || 0) * 2 + (b.post_count || 0);
        return scoreB - scoreA;
      }
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }, [themes, sortOrder]);

  return (
    <div className="min-h-screen bg-black pb-24 font-pretendard">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:scale-90 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-white tracking-tighter">추천 테마</span>
            <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">미식 큐레이션</span>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-6">
        {/* List Info & Sort */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary-500 font-black text-sm">{sortedThemes.length}개</span>
            <span className="text-gray-500 text-xs font-bold">검증된 테마 리스트</span>
          </div>
          
          <div className="relative">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none bg-[#111] text-gray-400 text-[11px] font-bold py-1.5 pl-3 pr-8 rounded-lg border border-white/10 outline-none focus:border-primary-500/50 cursor-pointer"
            >
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Theme List */}
        <div className="px-6 space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
            ))
          ) : sortedThemes.length > 0 ? (
            sortedThemes.map((theme, idx) => (
              <Link 
                key={theme.id} 
                to={`/theme/${theme.id}`}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-primary-500/30 transition-all shadow-xl flex h-28 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image Section */}
                <div className="w-28 h-full relative overflow-hidden flex-shrink-0">
                  <img 
                    src={theme.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                    <Layers className="w-2.5 h-2.5 text-primary-500" />
                    <span className="text-[9px] font-black text-white">{theme.post_count || 0}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[14px] font-black text-white group-hover:text-primary-500 transition-colors line-clamp-2 leading-tight mb-1.5">
                      {theme.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 font-bold">{theme.guide_nickname || '익명 가이드'}</span>
                      <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                      <span className="text-[10px] text-gray-600 font-medium">
                        {theme.keywords && typeof theme.keywords === 'string' ? theme.keywords.split(',')[0] : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-primary-500">
                      <Heart className="w-3 h-3 fill-primary-500" />
                      <span className="text-[11px] font-black">{(theme.likes || 0).toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-gray-700 font-bold uppercase tracking-tight">
                      Curated Theme
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/5">
              <span className="text-4xl mb-4 opacity-50">📂</span>
              <p className="text-gray-400 font-bold">아직 등록된 테마가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
