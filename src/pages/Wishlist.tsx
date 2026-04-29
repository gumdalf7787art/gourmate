import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Map as MapIcon, X, Search, Users, BadgeCheck, UserPlus } from 'lucide-react';
import { MOCK_POSTS, MOCK_GUIDES } from '@/data/mock';
import { KakaoMap } from '@/components/KakaoMap';
import clsx from 'clsx';

export default function Wishlist() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'places' | 'guides'>('places');
  const [showMap, setShowMap] = useState(false);

  // Simulated Data
  const wishlistedPosts = MOCK_POSTS.slice(0, 5);
  const followedGuides = MOCK_GUIDES.slice(0, 3); // Simulating 3 followed guides

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-tighter">관심</h1>
          <div className="w-10"></div>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-5 pb-px">
          <button 
            onClick={() => setActiveTab('places')}
            className={clsx(
              "flex-1 py-4 text-sm font-black transition-all border-b-2",
              activeTab === 'places' ? "text-white border-primary-500" : "text-gray-600 border-transparent"
            )}
          >
            식당 {wishlistedPosts.length}
          </button>
          <button 
            onClick={() => setActiveTab('guides')}
            className={clsx(
              "flex-1 py-4 text-sm font-black transition-all border-b-2",
              activeTab === 'guides' ? "text-white border-primary-500" : "text-gray-600 border-transparent"
            )}
          >
            가이드 {followedGuides.length}
          </button>
        </div>
      </header>

      <main className="px-5 py-8">
        {activeTab === 'places' ? (
          <>
            {/* Places View */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white leading-tight mb-2">
                가고 싶은<br />
                <span className="text-primary-500">관심 맛집</span>입니다.
              </h2>
            </div>

            <div className="grid gap-6">
              {wishlistedPosts.length > 0 ? (
                wishlistedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="bg-[#111] border border-white/10 rounded-[32px] overflow-hidden flex gap-4 p-4 active:scale-[0.98] transition-all group"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                      <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
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
                <EmptyState message="찜한 맛집이 없습니다." subMessage="마음에 드는 가이드의 포스팅을 담아보세요!" />
              )}
            </div>

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
          </>
        ) : (
          <>
            {/* Guides View */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white leading-tight mb-2">
                신뢰하는<br />
                <span className="text-primary-500">관심 가이드</span>입니다.
              </h2>
            </div>

            <div className="grid gap-4">
              {followedGuides.length > 0 ? (
                followedGuides.map((guide) => (
                  <div 
                    key={guide.id}
                    onClick={() => navigate(`/guide/${guide.id}`)}
                    className="bg-[#111] border border-white/10 rounded-[32px] p-5 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group hover:border-primary-500/30"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={guide.profileImageUrl} 
                        alt={guide.nickname}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-primary-500/50 transition-all"
                      />
                      {guide.trustScore > 90 && (
                        <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10 shadow-lg">
                          <BadgeCheck className="w-3 h-3 text-primary-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[15px] font-black text-white block truncate mb-1">{guide.nickname}</span>
                      <p className="text-[11px] text-gray-500 font-medium mb-3 line-clamp-1 italic">"{guide.bio}"</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-600" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">팔로워 {guide.followers?.toLocaleString()}</span>
                        </div>
                        <div className="w-[1px] h-2 bg-white/5"></div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-gray-600" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">좋아요 {guide.likes?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                      <Heart className="w-5 h-5 fill-white" />
                    </button>
                  </div>
                ))
              ) : (
                <EmptyState message="팔로우 중인 가이드가 없습니다." subMessage="신뢰할 수 있는 미식가들을 찾아보세요!" />
              )}
            </div>
            
            <Link to="/popular-guides" className="mt-12 w-full py-5 bg-white/5 border border-white/10 rounded-[24px] text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <UserPlus className="w-4 h-4 text-primary-500" />
              인기 가이드 탐색하기
            </Link>
          </>
        )}
      </main>

      {/* Map View Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          <nav className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black">
            <div className="flex flex-col">
              <span className="text-xs font-black text-primary-500 uppercase tracking-widest">My Selection</span>
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

function EmptyState({ message, subMessage }: { message: string, subMessage: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-dashed border-white/10">
        <Search className="w-8 h-8 text-gray-700" />
      </div>
      <p className="text-gray-400 font-bold mb-2">{message}</p>
      <p className="text-xs text-gray-600 leading-relaxed">{subMessage}</p>
    </div>
  );
}
