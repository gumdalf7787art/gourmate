import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, Utensils, User, MapPin, Hash, Heart, Star, BadgeCheck } from 'lucide-react';
import { postService } from '@/services/postService';
import { MOCK_POSTS, MOCK_COLLECTIONS } from '@/data/mock';

export function GeneralSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<{ posts: any[], guides: any[], themes: any[] }>({ posts: [], guides: [], themes: [] });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!keyword.trim()) {
        setResults({ posts: [], guides: [], themes: [] });
        return;
      }

      try {
        const res = await postService.search(keyword);
        if (res.success) {
          setResults({
            posts: res.data.posts || [],
            guides: res.data.guides || [],
            themes: res.data.themes || []
          });
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const filteredPosts = results.posts;
  const filteredGuides = results.guides;
  const filteredCollections = results.themes;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 pt-12 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-[1400px] mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              autoFocus
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-[#111] border border-white/30 rounded-xl leading-5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium shadow-2xl"
              placeholder="식당, 메뉴, 가이드, 테마를 검색해보세요"
            />
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 p-5 pb-24 overflow-y-auto">
        {!keyword ? (
          <div className="space-y-10 pt-4 max-w-[1200px] mx-auto">
            {/* Popular Tags */}
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-5 px-1">실시간 인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {['텐동', '오마카세', '신당동 맛집', '데이트 코스', '평양냉면', '혼밥하기 좋은'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setKeyword(tag)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#161616] border border-white/20 rounded-2xl text-sm text-gray-300 hover:border-primary-500/50 hover:bg-primary-500/5 hover:text-white transition-all shadow-lg"
                  >
                    <Hash className="w-3.5 h-3.5 text-primary-500" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Guides */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">추천 가이드</h3>
                <Link to="/popular-guides" className="text-[10px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">더보기</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOCK_POSTS.slice(0, 3).map((post: any) => (
                  <div 
                    key={post.guide.id} 
                    onClick={() => navigate(`/guide/${post.guide.id}`)}
                    className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-white/15 rounded-2xl group hover:border-white/30 transition-all shadow-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-primary-500 to-orange-300 shadow-lg group-hover:scale-105 transition-transform">
                          <img src={post.guide.profileImageUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
                        </div>
                        {post.guide.trustScore > 90 && (
                          <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/30">
                            <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors truncate mb-0.5">{post.guide.nickname}</p>
                        <p className="text-[10px] text-gray-500 font-medium">신뢰지수 {post.guide.trustScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Themes */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">추천 테마</h3>
                <span className="text-[10px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">더보기</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOCK_COLLECTIONS.slice(0, 3).map((collection: any) => (
                  <div key={collection.id} onClick={() => navigate(`/theme/${collection.id}`)} className="bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-lg flex h-24 cursor-pointer">
                    <div className="w-24 h-full relative overflow-hidden flex-shrink-0">
                      <img src={collection.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold text-white group-hover:text-primary-400 transition-colors pr-6 leading-tight line-clamp-2">
                          {collection.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-primary-500 font-black px-1 py-0.5 bg-primary-500/10 rounded uppercase">
                          {collection.places.length} SPOTS
                        </span>
                        <div className="flex items-center gap-1 text-primary-500">
                          <Heart className="w-2.5 h-2.5 fill-primary-500" />
                          <span className="text-[10px] font-black">{collection.likes?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 pt-4 max-w-[1400px] mx-auto">
            {/* Section: Restaurants */}
            <section>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  식당 리스트
                </h3>
                <span className="text-[10px] font-bold text-primary-500">전체 {Array.from(new Set(filteredPosts.map(p => p.place.id))).length}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from(new Set(filteredPosts.map(p => p.place.id))).map(placeId => {
                  const placePosts = filteredPosts.filter(p => p.place.id === placeId);
                  const place = placePosts[0].place;
                  const firstPost = placePosts[0];
                  
                  return (
                    <div 
                      key={placeId} 
                      onClick={() => navigate(`/post/${firstPost.id}`)}
                      className="bg-[#111] border border-white/20 rounded-[24px] overflow-hidden shadow-2xl flex flex-col cursor-pointer group hover:border-primary-500/30 transition-all"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src={firstPost.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] font-black text-white uppercase tracking-tighter px-1.5 py-0.5 bg-primary-500 rounded-md shadow-lg">
                            {place.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[15px] font-black text-white truncate leading-tight mb-1 group-hover:text-primary-500 transition-colors">{place.name}</h4>
                          <p className="text-[11px] text-gray-500 truncate font-medium mb-1">{place.address.split(' ').slice(0, 2).join(' ')}</p>
                          <p className="text-[11px] text-gray-300 line-clamp-1 italic font-medium opacity-90">
                            "{firstPost.review || firstPost.content.split('.')[0] || '추천 후기가 없습니다.'}"
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="flex -space-x-2 shrink-0">
                              <img src={firstPost.guide.profileImageUrl} className="w-5 h-5 rounded-full border border-black object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 truncate">{firstPost.guide.nickname}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-black text-white">{firstPost.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredPosts.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center opacity-30">
                  <MapPin className="w-12 h-12 mb-3" />
                  <p className="text-sm font-medium">'{keyword}' 검색 결과가 없습니다.</p>
                </div>
              )}
            </section>

            {/* Section: Menus */}
            <section>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-primary-500" />
                  메뉴 / 후기
                </h3>
                <button className="text-[10px] font-bold text-gray-500 hover:text-primary-500 transition-colors">더보기</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPosts.slice(0, 8).map((post: any) => (
                  <div 
                    key={post.id} 
                    onClick={() => navigate(`/post/${post.id}`)} 
                    className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:border-primary-500/30 transition-all flex flex-col"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-[10px] font-black text-white truncate opacity-80">{post.place.name}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-[13px] font-bold text-white truncate mb-1 group-hover:text-primary-500 transition-colors">
                        {post.menu_items?.[0]?.name || post.place.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 font-medium italic opacity-80">
                        "{post.review || post.content.split('.')[0]}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Themes & Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 px-1">
                  <Hash className="w-4 h-4 text-primary-500" />
                  테마 큐레이션
                </h3>
                <div className="space-y-3">
                  {filteredCollections.slice(0, 4).map(collection => (
                    <div key={collection.id} onClick={() => navigate(`/theme/${collection.id}`)} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden group hover:border-primary-500/30 transition-all flex h-20 cursor-pointer">
                      <img src={collection.imageUrl} className="w-20 h-full object-cover flex-shrink-0" />
                      <div className="flex-1 p-3 flex flex-col justify-center">
                        <p className="text-[12px] font-bold text-white truncate group-hover:text-primary-400 transition-colors">{collection.title}</p>
                        <p className="text-[9px] text-gray-500 mt-1">{collection.guide.nickname}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 px-1">
                  <User className="w-4 h-4 text-primary-500" />
                  가이드
                </h3>
                <div className="space-y-3">
                  {filteredGuides.slice(0, 4).map((guide: any) => (
                    <div key={guide.id} onClick={() => navigate(`/guide/${guide.id}`)} className="flex items-center gap-3 p-3 bg-[#111] border border-white/5 rounded-2xl group cursor-pointer hover:border-primary-500/20 transition-all">
                      <img src={guide.profileImageUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors truncate">{guide.nickname}</p>
                        <p className="text-[10px] text-gray-500">신뢰지수 {guide.trustScore}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
