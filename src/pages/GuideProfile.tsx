import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Share2, Star, BadgeCheck, Utensils, Medal, Layers, Plus, Heart } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS, MOCK_COLLECTIONS } from '../data/mock';

// Remove 'Top 20' from general categories as it will have its own section
const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비'];

export default function GuideProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('전체');

  const guide = MOCK_GUIDES.find(g => g.id === id);
  
  const guidePosts = useMemo(() => MOCK_POSTS.filter(p => p.guide.id === id), [id]);
  const top20Posts = useMemo(() => guidePosts.filter(p => p.isTop20), [guidePosts]);
  const guideCollections = useMemo(() => MOCK_COLLECTIONS.filter(c => c.userId === id), [id]);

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
    <div className="min-h-screen bg-black text-white pb-32 font-pretendard no-scrollbar">
      {/* Dynamic Header Background */}
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-black/80 to-black z-10" />
        <img src={guide.profileImageUrl} alt="" className="w-full h-full object-cover blur-3xl transform scale-125" />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 max-w-[640px] w-full px-5 py-4 flex items-center justify-between z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-white border border-white/10 active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-black text-sm tracking-widest uppercase opacity-80">{guide.nickname}'s Guide</span>
        <button className="p-2 bg-white/5 rounded-full text-white border border-white/10 active:scale-90 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </nav>

      <main className="relative z-20 pt-28">
        {/* 1. Profile Info Section */}
        <section className="px-6 mb-10">
          <div className="flex items-end gap-6 mb-8">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-[32px] p-1 bg-gradient-to-tr from-primary-500 to-yellow-500 shadow-[0_10px_30px_rgba(255,107,0,0.3)]">
                <img src={guide.profileImageUrl} className="w-full h-full rounded-[28px] object-cover border-4 border-black" alt={guide.nickname} />
              </div>
              {guide.trustScore >= 90 && (
                <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-white/10 shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-primary-500" />
                </div>
              )}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-3xl font-black tracking-tighter mb-2">{guide.nickname}</h1>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest opacity-80">Trust Score</span>
                  <span className="text-lg font-black leading-none mt-1">{guide.trustScore}%</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">Followers</span>
                  <span className="text-lg font-black leading-none mt-1">{(guide.followers || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-3xl p-5 border border-white/10 backdrop-blur-md">
            <p className="text-[15px] text-gray-300 leading-relaxed font-medium italic">
              "{guide.bio || '맛있는 음식과 멋진 공간을 기록합니다.'}"
            </p>
            <button className="w-full mt-5 bg-white text-black font-black py-3 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl">
              <Plus className="w-5 h-5" /> 팔로우 하기
            </button>
          </div>
        </section>

        {/* 2. Top 20 Section */}
        {top20Posts.length > 0 && (
          <section className="mb-12">
            <div className="px-6 mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter">
                <Medal className="w-5 h-5 text-yellow-500" />
                가이드 추천 Top 20
              </h2>
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest border border-yellow-500/30 px-2 py-1 rounded-md">The Best</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x pb-4">
              {top20Posts.map((post, idx) => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`}
                  className="flex-none w-[200px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 snap-start group shadow-2xl"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-yellow-500/30 text-yellow-500 font-black text-lg shadow-xl">
                      {idx + 1}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm font-black text-white truncate mb-1">{post.place.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-black text-white">{post.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. My Themes Section */}
        {guideCollections.length > 0 && (
          <section className="mb-12">
            <div className="px-6 mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter">
                <Layers className="w-5 h-5 text-primary-500" />
                가이드의 미식 테마
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x pb-4">
              {guideCollections.map(collection => (
                <div 
                  key={collection.id} 
                  className="flex-none w-[280px] aspect-[2/1.2] relative rounded-[32px] overflow-hidden border border-white/10 snap-start group cursor-pointer"
                >
                  <img src={collection.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-lg font-black text-white mb-2 leading-tight">{collection.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white/90 bg-primary-500 px-2 py-1 rounded-full uppercase tracking-tight">
                        Spot {collection.places.length}곳
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Categorized All Posts Section */}
        <section className="px-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter mb-6">
              <Utensils className="w-5 h-5 text-gray-500" />
              미식 카탈로그
            </h2>
            
            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6 border-b border-white/5 mb-8">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-none px-5 py-2.5 rounded-full text-[13px] font-bold transition-all border ${
                    activeCategory === category 
                      ? 'bg-white text-black border-white shadow-[0_10px_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-[#111] text-gray-500 border-white/10 hover:border-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Grid Posts */}
            <div className="grid grid-cols-2 gap-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <Link 
                    key={post.id} 
                    to={`/post/${post.id}`}
                    className="bg-[#111] rounded-[24px] overflow-hidden border border-white/10 group flex flex-col"
                  >
                    <div className="relative aspect-square">
                      <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[13px] font-black text-white truncate mb-1">{post.place.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold">{post.place.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-[11px] font-black text-white">{post.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/5">
                  <p className="text-gray-500 font-bold">포스트가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
