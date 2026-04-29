import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Share2, Star, BadgeCheck, Utensils, Medal, Plus, Heart, Info } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS, MOCK_COLLECTIONS } from '../data/mock';
import type { Guide } from '../data/mock';
import { TrustScoreModal } from '../components/TrustScoreModal';

const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비'];

export default function GuideProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('전체');
  const [showTrustModal, setShowTrustModal] = useState(false);

  const guide = MOCK_GUIDES.find(g => g.id === id);
  
  const guidePosts = useMemo(() => MOCK_POSTS.filter(p => p.guide.id === id), [id]);
  const top20Posts = useMemo(() => guidePosts.filter(p => p.isTop20), [guidePosts]);
  const guideCollections = useMemo(() => MOCK_COLLECTIONS.filter(c => c.userId === id), [id]);

  // Calculate total likes from all posts
  const totalLikes = useMemo(() => {
    return guidePosts.reduce((sum, post) => sum + post.likes, 0);
  }, [guidePosts]);

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
        <span className="font-black text-sm tracking-widest uppercase opacity-80">{guide.nickname} 가이드</span>
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
                <div 
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setShowTrustModal(true)}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[17px] font-black text-primary-500">{guide.trustScore}</span>
                    <Info className="w-3 h-3 text-gray-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">신뢰지수</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">팔로워</span>
                  <span className="text-lg font-black leading-none mt-1">{(guide.followers || 0).toLocaleString()}</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest opacity-80">좋아요</span>
                  <span className="text-lg font-black leading-none mt-1">{totalLikes > 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes}</span>
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
              <button className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">전체보기</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 snap-x pb-4">
              {top20Posts.map((post, idx) => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`}
                  className="flex-none w-[200px] bg-[#111] rounded-[24px] overflow-hidden border border-white/10 snap-start group shadow-2xl flex flex-col"
                >
                  {/* Top Image (4:3) */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-yellow-500/30 text-yellow-500 font-black text-xs shadow-xl">
                      {idx + 1}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-primary-500 rounded-md flex items-center gap-1 shadow-lg">
                      <Star className="w-2 h-2 text-white fill-white" />
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
              ))}
            </div>
          </section>
        )}

        {/* 3. Recommended Themes (Redesigned as per screenshot) */}
        {guideCollections.length > 0 && (
          <section className="mb-12 px-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-black text-white tracking-tight">추천 테마</h2>
              <Link 
                to={`/guide/${id}/themes`}
                className="text-[11px] font-bold text-primary-500 uppercase tracking-widest cursor-pointer hover:text-primary-400 transition-colors"
              >
                전체보기
              </Link>
            </div>
            <p className="text-[13px] text-gray-500 font-medium mb-6">믿고 보는 미식가들의 큐레이션</p>
            
            <div className="flex flex-col gap-3">
              {guideCollections.map(c => (
                <Link 
                  key={c.id} 
                  to={`/theme/${c.id}`}
                  className="bg-[#111] border border-white/30 rounded-xl relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-lg flex h-24 cursor-pointer"
                >
                  {/* Left Image */}
                  <div className="w-24 h-full relative overflow-hidden flex-shrink-0">
                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  
                  {/* Right Content */}
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[13px] font-bold text-white group-hover:text-primary-400 transition-colors pr-6 leading-tight line-clamp-2">
                        {c.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-gray-500 font-medium">{guide.nickname}</span>
                        <span className="text-[8px] text-primary-500 font-black px-1 py-0.5 bg-primary-500/10 rounded uppercase">
                          {c.places.length} 스팟
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-primary-500">
                      <Heart className="w-2.5 h-2.5 fill-primary-500" />
                      <span className="text-[10px] font-black">{c.likes?.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
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

            {/* View List Button (CTA) */}
            <div className="mb-6">
              <Link 
                to={`/guide/${id}/posts?category=${activeCategory}`}
                className="w-full py-4 bg-primary-500 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,107,0,0.3)] active:scale-[0.98] transition-all group"
              >
                <Utensils className="w-5 h-5 text-white" />
                <span className="text-[15px] font-black text-white">
                  {activeCategory === '전체' ? '전체' : activeCategory} 맛집 {filteredPosts.length}개 리스트 보기
                </span>
              </Link>
            </div>

            {/* Preview Grid (Show 2 items) */}
            <div className="grid grid-cols-2 gap-4">
              {filteredPosts.slice(0, 2).map(post => (
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
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Trust Score Detail Modal */}
      {showTrustModal && (
        <TrustScoreModal 
          guide={guide} 
          onClose={() => setShowTrustModal(false)} 
        />
      )}
    </div>
  );
}
