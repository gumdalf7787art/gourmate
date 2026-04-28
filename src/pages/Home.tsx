import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, BadgeCheck, Flame, UtensilsCrossed } from 'lucide-react';
import { MOCK_POSTS, MOCK_COLLECTIONS } from '@/data/mock';

export function Home() {
  const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝'];
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 필터링된 포스트 데이터
  const filteredPosts = selectedCategory === '전체' 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(post => post.place.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-black selection:bg-primary-500/30">
      {/* 1. Header & Search Bar */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 pt-12 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="text-white">GOUR</span>
            <span className="text-primary-500">MATE.</span>
          </h1>
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/10">
            <Flame className="w-4 h-4 text-primary-500" />
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 bg-[#141414] border border-white/5 rounded-2xl leading-5 text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-[#1a1a1a] focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 sm:text-sm transition-all duration-300 shadow-inner"
            placeholder="어떤 맛집을 찾으시나요?"
          />
        </div>
      </header>

      {/* 2. Categories & Filtered Results */}
      <section className="py-6">
        <div className="px-5 mb-4">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                    : 'bg-[#141414] text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Category Result Content (Horizontal Scroll) */}
        <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar pb-4 snap-x">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link to={`/post/${post.id}`} key={post.id} className="snap-start flex-none w-[160px] group cursor-pointer">
                <div className="aspect-square w-full rounded-2xl overflow-hidden mb-2 border border-white/5 relative bg-[#111]">
                  <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2">
                    {post.isPaidByMe && (
                      <div className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-primary-500 border border-primary-500/30">
                        내돈내산
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="text-white text-[13px] font-bold truncate mb-0.5">{post.place.name}</h4>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-3 h-3 text-primary-500/70" />
                  <span className="text-[10px] truncate">{post.place.address.split(' ')[1]}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/10 rounded-3xl mx-5">
              <UtensilsCrossed className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">해당 카테고리의 맛집이 아직 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 mx-5"></div>

      {/* 3. Popular User Lists (Themed Collections) */}
      <section className="py-8">
        <div className="px-5 mb-5 flex justify-between items-end">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">가이드 큐레이션</h2>
            <p className="text-sm text-gray-500 mt-1">믿고 보는 미식가들의 테마 리스트</p>
          </div>
          <span className="text-xs font-semibold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">See all</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar pb-4 snap-x">
          {MOCK_COLLECTIONS.map((c) => (
            <div key={c.id} className="snap-start flex-none w-[280px] bg-[#0c0c0c] border border-white/10 rounded-[20px] p-5 shadow-2xl relative overflow-hidden group hover:border-primary-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="font-bold text-white text-[17px] leading-snug mb-3 pr-4">
                {c.title}
              </h3>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] p-0.5 border border-white/10">
                    <img src={`https://i.pravatar.cc/150?u=${c.userId}`} alt="" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">ID: {c.userId}</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white/5 backdrop-blur-sm border border-white/5">
                  <span className="text-[10px] text-gray-300 font-semibold">{c.places.length} SPOTS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 mx-5"></div>

      {/* 4. Popular Posts (Recommended Restaurants) */}
      <section className="py-8 flex-1">
        <div className="px-5 mb-6 space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">실시간 트렌딩</h2>
          <p className="text-sm text-gray-500">지금 가이드들이 가장 많이 추천하는 곳</p>
        </div>
        
        <div className="flex flex-col gap-10 px-5">
          {MOCK_POSTS.map((post) => (
            <article key={post.id} className="flex flex-col relative group">
              {/* Guide Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={post.guide.profileImageUrl} alt={post.guide.nickname} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    {post.guide.trustScore > 90 && (
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                        <BadgeCheck className="w-4 h-4 text-primary-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-white leading-none mb-1.5">{post.guide.nickname}</span>
                    <span className="text-[11px] text-gray-500 leading-none font-medium">Top Guide • 신뢰지수 {post.guide.trustScore}</span>
                  </div>
                </div>
                {post.isPaidByMe && (
                  <span className="px-3 py-1 bg-white/5 border border-white/10 text-primary-500 text-[10px] font-black rounded-full tracking-wider uppercase">
                    Verified
                  </span>
                )}
              </div>
              
              {/* Image Card */}
              <Link to={`/post/${post.id}`} className="aspect-[4/5] w-full rounded-[32px] overflow-hidden relative bg-[#111] mb-5 
                            ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:ring-white/25 transition-all duration-700 ease-in-out">
                <img src={post.images[0]} alt={post.place.name} className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                
                {/* Image Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-primary-500 text-white text-[10px] font-black rounded-lg uppercase tracking-tight">
                        {post.place.category}
                      </span>
                      {post.isPaidByMe && (
                        <span className="px-2.5 py-1 bg-white text-black text-[10px] font-black rounded-lg uppercase tracking-tight">
                          내돈내산
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                      {post.place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 font-medium">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span className="text-[13px]">{post.place.address}</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Content Description */}
              <div className="px-2">
                <p className="text-[15px] text-gray-300 line-clamp-3 leading-relaxed font-light">
                  <span className="text-white font-bold mr-3 text-lg">“</span>
                  {post.content}
                  <span className="text-white font-bold ml-1 text-lg">”</span>
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Link to={`/post/${post.id}`} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[12px] text-primary-500 font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                    상세보기
                  </Link>
                  <div className="flex -space-x-2 ml-auto">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-[#111]">
                        <img src={`https://i.pravatar.cc/100?u=a${i}`} className="w-full h-full rounded-full" />
                      </div>
                    ))}
                    <span className="pl-3 text-[11px] text-gray-500 font-medium self-center">외 24명이 찜했습니다</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* Footer with Business Info */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#050505] mt-8">
        <div className="max-w-md mx-auto space-y-4">
          <h3 className="text-sm font-bold text-gray-400">GOURMATE</h3>
          <div className="space-y-1 text-[11px] text-gray-500 font-medium leading-relaxed">
            <p>상호명: 블루프라임</p>
            <p>대표자: 김덕규</p>
            <p>사업자등록번호: 153-87-03544</p>
            <p className="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-600">
              © 2026 GOURMATE. All rights reserved. 본 웹사이트는 맛집 정보 공유를 위한 플랫폼입니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
