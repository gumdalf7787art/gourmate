import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, Star, MapPin, Map as MapIcon, X } from 'lucide-react';
import { MOCK_COLLECTIONS, MOCK_POSTS, MOCK_GUIDES } from '../data/mock';
import { KakaoMap } from '@/components/KakaoMap';

export default function ThemeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  const theme = MOCK_COLLECTIONS.find(c => c.id === id);
  const guide = MOCK_GUIDES.find(g => g.id === theme?.userId);
  
  // Find posts by this guide for the places in this theme
  const themePosts = useMemo(() => {
    if (!theme || !guide) return [];
    return theme.places.map(place => {
      return MOCK_POSTS.find(post => post.guide.id === guide.id && post.place.id === place.id);
    }).filter(Boolean);
  }, [theme, guide]);

  if (!theme || !guide) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-pretendard">
      {/* 1. Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={theme.thumbnail} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Navigation Over Image */}
        <nav className="absolute top-0 w-full px-5 py-4 flex items-center justify-between z-50">
          <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </nav>

        {/* Theme Title & Intro */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {theme.keywords?.map((keyword, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-primary-500/80 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-white">
                #{keyword}
              </span>
            ))}
            <span className="text-[10px] text-white/60 font-bold ml-auto">{theme.places.length} SPOTS</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
            {theme.title}
          </h1>
          <div className="flex items-center gap-3">
            <img src={guide.profileImageUrl} className="w-6 h-6 rounded-full border border-white/20" alt="" />
            <span className="text-xs font-bold text-gray-300">By <span className="text-white">{guide.nickname}</span></span>
          </div>
        </div>
      </div>

      <main className="px-6 py-8">
        {/* Theme Description */}
        <div className="mb-12 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-xs font-black text-primary-500 uppercase tracking-widest mb-3">Guide's Note</h3>
          <p className="text-[15px] text-gray-300 leading-relaxed font-medium italic">
            "{theme.description || '가이드가 추천하는 특별한 미식 테마입니다. 각 스팟의 진심 어린 리뷰를 확인해 보세요.'}"
          </p>
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-primary-500">
               <Heart className="w-4 h-4 fill-primary-500" />
               <span className="text-sm font-black">{theme.likes?.toLocaleString()}명이 이 테마를 좋아합니다</span>
             </div>
          </div>
        </div>

        {/* Places List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tighter">테마 리스트</h2>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">In this theme</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {themePosts.map((post: any) => (
              <Link 
                key={post.id} 
                to={`/post/${post.id}`}
                className="bg-[#111] rounded-[32px] overflow-hidden border border-white/10 group shadow-2xl flex flex-col"
              >
                {/* 4:3 Image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5 border border-white/10 shadow-xl">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-black text-white">{post.rating}</span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-black text-white mb-1 group-hover:text-primary-500 transition-colors">
                        {post.place.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[11px] font-bold">{post.place.category} · {post.place.address.split(' ')[1]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary-500">
                      <Heart className="w-3.5 h-3.5 fill-primary-500" />
                      <span className="text-sm font-black">{post.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 italic mb-4">
                    "{post.content}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-2.5 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5 font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Floating Map Button */}
          {themePosts.length > 0 && (
            <div className="mt-12">
              <button 
                onClick={() => setShowMap(true)}
                className="w-full py-5 bg-white text-black rounded-[24px] flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-all group border-b-4 border-gray-200"
              >
                <MapIcon className="w-5 h-5" />
                <span className="text-[15px] font-black">테마 맛집 지도로 보기</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Map View Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          <nav className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black">
            <div className="flex flex-col">
              <span className="text-xs font-black text-primary-500 uppercase tracking-widest">Theme Explorer</span>
              <span className="text-sm font-bold text-white truncate max-w-[200px]">{theme.title}</span>
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
              places={themePosts.map((p: any) => ({
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
