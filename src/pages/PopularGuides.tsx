import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, UserPlus, Heart, Users, Star, Info, Map as MapIcon, X } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS } from '@/data/mock';
import type { Guide } from '@/data/mock';
import { TrustScoreModal } from '@/components/TrustScoreModal';
import { KakaoMap } from '@/components/KakaoMap';

export function PopularGuides() {
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showMap, setShowMap] = useState(false);

  // 인기 가이드들의 맛집 포스트들 (Top 20 기준)
  const popularPlaces = MOCK_POSTS.filter(post => post.isTop20);

  // 신뢰지수 높은 순으로 정렬
  const sortedGuides = [...MOCK_GUIDES].sort((a, b) => b.trustScore - a.trustScore);

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-black text-white tracking-tight">인기 가이드 추천</h1>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white leading-tight mb-2">
            검증된 미식가들과<br />
            <span className="text-primary-500">함께하세요.</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">실제 방문 경험과 신뢰도 높은 리뷰를 제공하는 가이드들입니다.</p>
        </div>

        <div className="grid gap-4">
          {sortedGuides.map((guide) => (
            <div 
              key={guide.id}
              onClick={() => navigate(`/guide/${guide.id}`)}
              className="bg-[#111] border border-white/10 rounded-3xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group hover:border-primary-500/30"
            >
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <img 
                  src={guide.profileImageUrl} 
                  alt={guide.nickname}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/10 group-hover:border-primary-500/50 transition-all"
                />
                {guide.trustScore > 90 && (
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10 shadow-lg">
                    <BadgeCheck className="w-4 h-4 text-primary-500" />
                  </div>
                )}
              </div>

              {/* Guide Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[15px] font-black text-white truncate">{guide.nickname}</span>
                  <div className="px-1.5 py-0.5 bg-primary-500/10 rounded text-[9px] font-black text-primary-500 uppercase tracking-tighter">
                    TOP GUIDE
                  </div>
                </div>
                
                {guide.bio && (
                  <p className="text-[12px] text-gray-500 font-medium mb-2.5 line-clamp-1 leading-tight italic">
                    "{guide.bio}"
                  </p>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="flex items-center gap-1 cursor-pointer hover:text-primary-500 transition-colors group/info"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGuide(guide);
                    }}
                  >
                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-[11px] text-gray-300 font-bold group-hover/info:text-primary-500">신뢰지수 {guide.trustScore}</span>
                    <Info className="w-2.5 h-2.5 text-gray-600 group-hover/info:text-primary-500" />
                  </div>
                  <div className="w-[1px] h-2.5 bg-white/10"></div>
                  <span className="text-[11px] text-gray-500 font-medium">게시물 {Math.floor(Math.random() * 50) + 10}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">팔로워 {guide.followers?.toLocaleString() || '1.2K'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-gray-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">좋아요 {guide.likes?.toLocaleString() || '3.4K'}</span>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`${guide.nickname}님을 팔로우했습니다.`);
                }}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-primary-500 hover:border-primary-500 transition-all active:scale-90"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* View All Places on Map Button */}
        {popularPlaces.length > 0 && (
          <div className="mt-12 mb-10">
            <button 
              onClick={() => setShowMap(true)}
              className="w-full py-4 bg-primary-500 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,107,0,0.3)] active:scale-[0.98] transition-all group"
            >
              <MapIcon className="w-5 h-5 text-white" />
              <span className="text-[15px] font-black text-white">
                인기 가이드 추천맛집 지도로 보기
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
              <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Global Curation</span>
              <span className="text-sm font-bold text-white">인기 가이드 연합 지도</span>
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
              places={popularPlaces.map(p => ({
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

      {/* Trust Score Detail Modal */}
      {selectedGuide && (
        <TrustScoreModal 
          guide={selectedGuide} 
          onClose={() => setSelectedGuide(null)} 
        />
      )}
    </div>
  );
}
