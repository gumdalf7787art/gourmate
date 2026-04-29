import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Filter, Search, GpsFixed } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS } from '@/data/mock';
import { KakaoMap } from '@/components/KakaoMap';

export default function GlobalMap() {
  const navigate = useNavigate();
  const [selectedGuideId, setSelectedGuideId] = useState<string | 'all'>('all');

  // Filter posts based on selected guide
  const filteredPlaces = useMemo(() => {
    let posts = MOCK_POSTS.filter(p => p.isTop20);
    
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
  }, [selectedGuideId]);

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

        {/* Guide Quick Filters */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pointer-events-auto -mx-5 px-5">
          <button
            onClick={() => setSelectedGuideId('all')}
            className={`flex-none flex flex-col items-center gap-1.5 transition-all ${selectedGuideId === 'all' ? 'opacity-100 scale-105' : 'opacity-50'}`}
          >
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center bg-[#111] ${selectedGuideId === 'all' ? 'border-primary-500' : 'border-white/10'}`}>
              <Filter className={`w-5 h-5 ${selectedGuideId === 'all' ? 'text-primary-500' : 'text-white'}`} />
            </div>
            <span className="text-[10px] font-black text-white">전체</span>
          </button>

          {MOCK_GUIDES.map((guide) => (
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
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <KakaoMap 
          places={filteredPlaces}
          level={8}
          onSelect={(postId) => navigate(`/post/${postId}`)}
        />

        {/* Floating Controls */}
        <div className="absolute bottom-28 right-5 z-20 flex flex-col gap-3">
          <button className="w-12 h-12 bg-white text-black rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all">
            <GpsFixed className="w-6 h-6" />
          </button>
        </div>

        {/* Selection Info Overlay */}
        <div className="absolute bottom-28 left-5 z-20 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-left-4 duration-500">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Current Filter</p>
            <p className="text-sm font-bold text-white">
              {selectedGuideId === 'all' ? '전체 인기 가이드' : MOCK_GUIDES.find(g => g.id === selectedGuideId)?.nickname}의 <span className="text-primary-500 font-black">{filteredPlaces.length}</span>개 맛집 핀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
