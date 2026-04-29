import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, Heart } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS } from '../data/mock';

const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비'];

export default function GuidePostList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get category from URL or default to '전체'
  const initialCategory = searchParams.get('category') || '전체';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const guide = MOCK_GUIDES.find(g => g.id === id);
  const guidePosts = useMemo(() => MOCK_POSTS.filter(p => p.guide.id === id), [id]);

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  const filteredPosts = useMemo(() => {
    if (activeCategory === '전체') return guidePosts;
    return guidePosts.filter(post => {
      if (activeCategory === '가성비') return post.tags?.includes('가성비');
      if (activeCategory === '파인다이닝') return post.tags?.includes('파인다이닝') || post.place.category === '파인다이닝';
      return post.place.category === activeCategory;
    });
  }, [guidePosts, activeCategory]);

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-pretendard">
      {/* Top Navigation */}
      <nav className="sticky top-0 w-full px-5 py-4 flex items-center justify-between z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black text-sm tracking-widest">{guide.nickname}</span>
          <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">미식 카탈로그</span>
        </div>
        <div className="w-10" /> {/* Placeholder for balance */}
      </nav>

      <main className="pt-6">
        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 px-6 border-b border-white/5 mb-6 sticky top-[60px] bg-black/90 backdrop-blur-md z-40">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`flex-none px-5 py-2.5 rounded-full text-[13px] font-bold transition-all border ${
                activeCategory === category 
                  ? 'bg-white text-black border-white shadow-[0_5px_15px_rgba(255,255,255,0.15)]' 
                  : 'bg-[#111] text-gray-500 border-white/10 hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tighter">
            {activeCategory} 맛집
          </h2>
          <span className="text-[12px] font-bold text-gray-500">
            총 <span className="text-primary-500 font-black">{filteredPosts.length}</span>곳
          </span>
        </div>

        {/* Grid Posts */}
        <div className="px-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`}
                  className="bg-[#111] rounded-[24px] overflow-hidden border border-white/10 group flex flex-col shadow-xl"
                >
                  {/* Top Image (4:3) */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-md flex items-center gap-1">
                      <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                      <span className="text-[9px] font-black text-white">{post.rating}</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                    <div>
                      <h3 className="text-[14px] font-black text-white truncate mb-1 group-hover:text-primary-500 transition-colors">
                        {post.place.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2 italic">
                        "{post.content}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                        {post.place.category}
                      </span>
                      <div className="flex items-center gap-1 text-primary-500">
                        <Heart className="w-2.5 h-2.5 fill-primary-500" />
                        <span className="text-[10px] font-black">{post.likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/5">
                <span className="text-4xl mb-4 opacity-50">🍽️</span>
                <p className="text-gray-400 font-bold mb-1">아직 등록된 포스트가 없습니다.</p>
                <p className="text-xs text-gray-600">다른 카테고리를 선택해 보세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
