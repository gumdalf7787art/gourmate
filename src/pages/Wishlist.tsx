import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Map as MapIcon, X, Search, Utensils } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { KakaoMap } from '@/components/KakaoMap';

export default function Wishlist() {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  // Simulated Wishlist (Posts with high bookmark counts or just a few specific ones)
  const wishlistedPosts = MOCK_POSTS.slice(0, 5); // Just taking first 5 for now

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-tighter">관심 맛집</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="px-5 py-8">
        {/* Summary Info */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              가이드님의<br />
              <span className="text-primary-500">관심 목록</span>입니다.
            </h2>
            <p className="text-gray-500 text-sm font-medium">총 {wishlistedPosts.length}곳의 맛집을 찜하셨네요!</p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-500 border border-white/10">
            <Heart className="w-6 h-6 fill-primary-500" />
          </div>
        </div>

        {/* List */}
        <div className="grid gap-6">
          {wishlistedPosts.length > 0 ? (
            wishlistedPosts.map((post) => (
              <Link 
                key={post.id}
                to={`/post/${post.id}`}
                className="bg-[#111] border border-white/10 rounded-[32px] overflow-hidden flex gap-4 p-4 active:scale-[0.98] transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                  <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black text-primary-500 uppercase tracking-widest">{post.place.category}</span>
                      <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />
                    </div>
                    <h3 className="text-sm font-bold text-white truncate mb-1 group-hover:text-primary-400 transition-colors">{post.place.name}</h3>
                    <p className="text-[12px] text-gray-500 truncate">{post.place.address.split(' ').slice(0, 3).join(' ')}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                      <img src={post.guide.profileImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-gray-400 font-bold">{post.guide.nickname} 가이드</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-dashed border-white/10">
                <Search className="w-8 h-8 text-gray-700" />
              </div>
              <p className="text-gray-400 font-bold mb-2">찜한 맛집이 아직 없습니다.</p>
              <p className="text-xs text-gray-600 leading-relaxed">마음에 드는 가이드의 포스팅을<br />관심 목록에 담아보세요!</p>
              <Link to="/" className="mt-8 px-8 py-3 bg-white text-black rounded-full font-black text-sm">추천 맛집 보러가기</Link>
            </div>
          )}
        </div>

        {/* Floating Map Button */}
        {wishlistedPosts.length > 0 && (
          <div className="mt-16">
            <button 
              onClick={() => setShowMap(true)}
              className="w-full py-5 bg-white text-black rounded-[24px] flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-all group border-b-4 border-gray-200"
            >
              <MapIcon className="w-5 h-5" />
              <span className="text-[15px] font-black">관심 맛집 위치 지도로 보기</span>
            </button>
          </div>
        )}
      </main>

      {/* Map View Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          <nav className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black">
            <div className="flex flex-col">
              <span className="text-xs font-black text-primary-500 uppercase tracking-widest">My Wishlist</span>
              <span className="text-sm font-bold text-white">관심 맛집 지도</span>
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
              places={wishlistedPosts.map(p => ({
                id: p.place.id,
                postId: p.id,
                lat: p.place.latitude,
                lng: p.place.longitude,
                name: p.place.name,
                category: p.place.category,
                rating: p.rating
              }))}
              level={7}
              onSelect={(postId) => navigate(`/post/${postId}`)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
