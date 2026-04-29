import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Star, Heart, Map as MapIcon, X, SlidersHorizontal } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { KakaoMap } from '@/components/KakaoMap';

const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비'];

export default function PopularRestaurants() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('전체');
  const [showMap, setShowMap] = useState(false);
  const [sortOrder, setSortOrder] = useState<'likes' | 'rating' | 'latest'>('likes');

  // Filter and Sort Logic
  const filteredPosts = useMemo(() => {
    let result = MOCK_POSTS.filter(post => post.isTop20); // Only Top 20 / Popular posts

    if (activeCategory !== '전체') {
      result = result.filter(post => post.place.category === activeCategory);
    }

    return [...result].sort((a, b) => {
      if (sortOrder === 'likes') return b.likes - a.likes;
      if (sortOrder === 'rating') return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [activeCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-tighter">인기 추천맛집</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 px-5 border-t border-white/5">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === category 
                  ? 'bg-white text-black border-white shadow-lg' 
                  : 'bg-[#111] text-gray-500 border-white/10 hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <main className="pt-6">
        {/* List Info & Sort */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary-500 font-black text-sm">Top {filteredPosts.length}</span>
            <span className="text-gray-500 text-xs font-bold">검증된 맛집 리스트</span>
          </div>
          
          <div className="relative">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none bg-[#111] text-gray-400 text-[11px] font-bold py-1.5 pl-3 pr-8 rounded-lg border border-white/10 outline-none focus:border-primary-500/50 cursor-pointer"
            >
              <option value="likes">인기순</option>
              <option value="rating">평점순</option>
              <option value="latest">최신순</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
              <SlidersHorizontal className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="px-6 grid grid-cols-2 gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <Link 
                key={post.id} 
                to={`/post/${post.id}`}
                className="bg-[#111] rounded-[24px] overflow-hidden border border-white/10 group flex flex-col shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  <div className="absolute top-2 left-2 w-6 h-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-[10px] font-black text-primary-500 border border-primary-500/30">
                    {idx + 1}
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-md flex items-center gap-1">
                    <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                    <span className="text-[9px] font-black text-white">{post.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                  <div>
                    <h3 className="text-[13px] font-black text-white truncate mb-1 group-hover:text-primary-500 transition-colors">
                      {post.place.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-2">
                      {post.place.category} · {post.guide.nickname}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2 italic">
                      "{post.content}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[9px] text-gray-600 font-bold">
                      {post.bookmarks.toLocaleString()} 저장
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
              <p className="text-gray-400 font-bold mb-1">해당 카테고리의 맛집이 아직 없습니다.</p>
              <p className="text-xs text-gray-600">다른 카테고리를 탐색해 보세요.</p>
            </div>
          )}
        </div>

        {/* Bottom Map Button */}
        {filteredPosts.length > 0 && (
          <div className="px-6 mt-12 mb-12">
            <button 
              onClick={() => setShowMap(true)}
              className="w-full py-4 bg-primary-500 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,107,0,0.3)] active:scale-[0.98] transition-all group"
            >
              <MapIcon className="w-5 h-5 text-white" />
              <span className="text-[15px] font-black text-white">
                전체 맛집 위치 지도로 보기
              </span>
            </button>
          </div>
        )}
      </main>

      {/* Map View Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          <nav className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black">
            <div className="flex flex-col">
              <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Global Top</span>
              <span className="text-sm font-bold text-white">인기 추천맛집 지도</span>
            </div>
            <button 
              onClick={() => setShowMap(false)}
              className="p-2 bg-white/5 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </nav>
          
          <div className="flex-1 relative">
            <KakaoMap 
              places={filteredPosts.map(p => ({
                id: p.place.id,
                postId: p.id,
                lat: p.place.latitude,
                lng: p.place.longitude,
                name: p.place.name,
                category: p.place.category,
                rating: p.rating
              }))}
              level={8}
              onSelect={(postId) => navigate(`/post/${postId}`)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
