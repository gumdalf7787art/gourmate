import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter, Search, LocateFixed, X, Star, ShieldCheck } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS } from '@/data/mock';
import { KakaoMap } from '@/components/KakaoMap';

export default function GlobalMap() {
  const navigate = useNavigate();
  const [selectedGuideId, setSelectedGuideId] = useState<string | 'all'>('all');
  const [minRating, setMinRating] = useState(0);
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [currentBounds, setCurrentBounds] = useState<kakao.maps.LatLngBounds | null>(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // 1. Handle map bounds change
  const handleBoundsChange = useCallback((map: kakao.maps.Map) => {
    setCurrentBounds(map.getBounds());
  }, []);

  // 2. Filter posts by spatial bounds AND quality filters
  const visiblePosts = useMemo(() => {
    let posts = MOCK_POSTS;

    // Filter by Bounds
    if (currentBounds) {
      posts = posts.filter(post => {
        const position = new kakao.maps.LatLng(post.place.latitude, post.place.longitude);
        return currentBounds.contains(position);
      });
    }

    // Filter by Rating
    if (minRating > 0) {
      posts = posts.filter(p => p.rating >= minRating);
    }

    // Filter by Guide Trust Score
    if (minTrustScore > 0) {
      posts = posts.filter(p => p.guide.trustScore >= minTrustScore);
    }

    return posts;
  }, [currentBounds, minRating, minTrustScore]);

  // 3. Filter available guides based on visible posts in the current area
  const visibleGuides = useMemo(() => {
    const guideIdsInArea = new Set(visiblePosts.map(p => p.guide.id));
    return MOCK_GUIDES.filter(g => guideIdsInArea.has(g.id));
  }, [visiblePosts]);

  // 4. Final places to display on map (further filtered by selected guide)
  const displayPlaces = useMemo(() => {
    let posts = visiblePosts;
    
    if (selectedGuideId !== 'all') {
      posts = posts.filter(p => p.guide.id === selectedGuideId);
    }

    return posts.map(p => ({
      id: p.place.id,
      postId: p.id,
      lat: p.place.latitude,
      lng: p.place.longitude,
      name: p.place.name,
      category: p.place.category,
      rating: p.rating
    }));
  }, [visiblePosts, selectedGuideId]);

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header Over Map */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 pt-6 pb-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center justify-between mb-6 pointer-events-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-white tracking-tighter leading-tight">미식 탐험 지도</h1>
              <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">Global Explorer</p>
            </div>
          </div>
          
          <button className="w-10 h-10 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Quick Filters (Now dynamic based on area) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pointer-events-auto -mx-5 px-5">
          <button
            onClick={() => setSelectedGuideId('all')}
            className={`flex-none flex flex-col items-center gap-1.5 transition-all ${selectedGuideId === 'all' ? 'opacity-100 scale-105' : 'opacity-50'}`}
          >
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#111] ${selectedGuideId === 'all' ? 'border-primary-500' : 'border-white/10'}`}>
              <Filter className={`w-5 h-5 ${selectedGuideId === 'all' ? 'text-primary-500' : 'text-white'}`} />
            </div>
            <span className="text-[10px] font-black text-white">이 지역 전체</span>
          </button>

          {visibleGuides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`flex-none flex flex-col items-center gap-1.5 transition-all ${selectedGuideId === guide.id ? 'opacity-100 scale-105' : 'opacity-40'}`}
            >
              <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${selectedGuideId === guide.id ? 'border-primary-500' : 'border-white/10'}`}>
                <img src={guide.profileImageUrl} alt={guide.nickname} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-black text-white truncate w-14 text-center">{guide.nickname}</span>
            </button>
          ))}
          
          {visibleGuides.length === 0 && (
            <div className="flex items-center px-4 py-2 bg-white/5 rounded-full border border-white/5 whitespace-nowrap">
               <span className="text-[11px] text-gray-500 font-bold italic">이 지역에 활동하는 가이드가 없습니다.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <KakaoMap 
          places={displayPlaces}
          level={8}
          onSelect={(postId) => navigate(`/post/${postId}`)}
          onBoundsChange={handleBoundsChange}
        />

        {/* Floating Controls */}
        <div className="absolute bottom-28 right-5 z-20 flex flex-col gap-3">
          <button 
            onClick={() => setShowFilterOptions(true)}
            className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all ${minRating > 0 || minTrustScore > 0 ? 'bg-primary-500 text-white' : 'bg-white text-black'}`}
          >
            <Filter className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-white text-black rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all">
            <LocateFixed className="w-6 h-6" />
          </button>
        </div>

        {/* Selection Info Overlay */}
        <div className="absolute bottom-28 left-5 z-20 pointer-events-none max-w-[240px]">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-left-4 duration-500">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Current Filter</p>
            <p className="text-sm font-bold text-white leading-snug">
              {selectedGuideId === 'all' ? '이 지역 가이드 연합' : MOCK_GUIDES.find(g => g.id === selectedGuideId)?.nickname}의 <span className="text-primary-500 font-black">{displayPlaces.length}</span>개 맛집
              {(minRating > 0 || minTrustScore > 0) && <span className="text-[10px] text-primary-400 block mt-1">필터: {minRating > 0 && `평점 ${minRating}+`} {minTrustScore > 0 && `신뢰 ${minTrustScore}+`}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filter Modal (BottomSheet style) */}
      {showFilterOptions && (
        <div className="fixed inset-0 z-[110] flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilterOptions(false)}></div>
          <div className="relative w-full bg-[#111] rounded-t-[40px] border-t border-white/10 p-8 pt-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
            
            <h3 className="text-xl font-black text-white mb-8">정밀 필터 설정</h3>
            
            {/* Rating Filter */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-400 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  최소 평점
                </span>
                <span className="text-lg font-black text-primary-500">{minRating === 0 ? '전체' : `${minRating.toFixed(1)}점 이상`}</span>
              </div>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all border ${minRating === r ? 'bg-primary-500 text-white border-primary-500' : 'bg-black text-gray-500 border-white/5'}`}
                  >
                    {r === 0 ? 'OFF' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Guide Trust Score Filter */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  가이드 신뢰등급
                </span>
                <span className="text-lg font-black text-primary-500">{minTrustScore === 0 ? '전체' : `신뢰도 ${minTrustScore}+`}</span>
              </div>
              <div className="flex gap-2">
                {[0, 80, 90, 95].map(s => (
                  <button
                    key={s}
                    onClick={() => setMinTrustScore(s)}
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all border ${minTrustScore === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-black text-gray-500 border-white/5'}`}
                  >
                    {s === 0 ? 'OFF' : `${s}+`}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setShowFilterOptions(false)}
              className="w-full py-5 bg-white text-black rounded-3xl font-black active:scale-[0.98] transition-all"
            >
              필터 적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
