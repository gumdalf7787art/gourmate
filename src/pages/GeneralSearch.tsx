import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, Utensils, User, MapPin, Hash, Heart, Star, BadgeCheck } from 'lucide-react';
import { MOCK_POSTS, MOCK_COLLECTIONS } from '@/data/mock';


export function GeneralSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  // 지능형 검색 로직
  const getFilteredPosts = () => {
    if (!keyword) return [];
    const lowKeyword = keyword.toLowerCase().trim();
    
    // 의미론적 연관 키워드 확장 (예: 데이트 -> 분위기, 기념일 등)
    const semanticMap: Record<string, string[]> = {
      '데이트': ['분위기', '커플', '야경', '파인다이닝', '기념일'],
      '한식': ['국밥', '찌개', '고기', '백반', '반상'],
      '일식': ['스시', '텐동', '오마카세', '라멘', '이자카야'],
      '중식': ['짜장', '짬뽕', '딤섬', '마라'],
      '카페': ['디저트', '베이커리', '커피', '카공', '감성'],
      '술집': ['와인', '맥주', '소주', '칵테일', '바'],
      '혼밥': ['1인분', '바테이블', '가성비', '빠른'],
    };

    const relatedKeywords = semanticMap[lowKeyword] || [];

    return MOCK_POSTS.filter(post => {
      const targetString = `
        ${post.place.name} 
        ${post.place.category} 
        ${post.place.address} 
        ${post.content} 
        ${post.tags?.join(' ')}
      `.toLowerCase();

      // 1. 직접 포함 여부
      if (targetString.includes(lowKeyword)) return true;
      
      // 2. 의미론적 연관 검색어 포함 여부
      return relatedKeywords.some(rk => targetString.includes(rk));
    });
  };

  const filteredPosts = getFilteredPosts();
  const filteredCollections = MOCK_COLLECTIONS.filter(c => 
    c.title.toLowerCase().includes(keyword.toLowerCase()) ||
    c.keywords?.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 pt-12 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
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
          <div className="space-y-10 pt-4">
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
              <div className="space-y-3">
                {MOCK_POSTS.slice(0, 3).map((post) => (
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
                        {post.guide.bio && (
                          <p className="text-[10px] text-gray-500 font-medium line-clamp-1 italic mb-0.5 opacity-70">
                            "{post.guide.bio}"
                          </p>
                        )}
                        <p className="text-[10px] text-gray-500 font-medium">신뢰지수 {post.guide.trustScore} • 포스트 24개</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${post.guide.nickname}님을 팔로우했습니다.`);
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 text-white text-[11px] font-black rounded-xl hover:bg-primary-500 hover:border-primary-500 transition-all uppercase tracking-tighter"
                    >
                      팔로우
                    </button>
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
              <div className="grid grid-cols-1 gap-2.5">
                {MOCK_COLLECTIONS.slice(0, 3).map((collection) => (
                  <div key={collection.id} className="bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-lg flex h-24">
                    <div className="w-24 h-full relative overflow-hidden flex-shrink-0">
                      <img src={collection.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold text-white group-hover:text-primary-400 transition-colors pr-6 leading-tight line-clamp-2">
                          {collection.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-gray-500 font-medium">{collection.userId}</span>
                          <span className="text-[8px] text-primary-500 font-black px-1 py-0.5 bg-primary-500/10 rounded uppercase">
                            {collection.places.length} SPOTS
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary-500">
                        <Heart className="w-2.5 h-2.5 fill-primary-500" />
                        <span className="text-[10px] font-black">{collection.likes?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 pt-4">
            {/* Section: Restaurants */}
            <section>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  식당 리스트
                </h3>
                <span className="text-[10px] font-bold text-primary-500">전체 {Array.from(new Set(filteredPosts.map(p => p.place.id))).length}</span>
              </div>
              <div className="space-y-4">
                {Array.from(new Set(filteredPosts.map(p => p.place.id))).map(placeId => {
                  const placePosts = filteredPosts.filter(p => p.place.id === placeId);
                  const place = placePosts[0].place;
                  
                  return (
                    <div key={placeId} className="bg-[#111] border border-white/20 rounded-[24px] overflow-hidden shadow-2xl">
                      {/* Restaurant Header */}
                      <div 
                        onClick={() => navigate(`/post/${placePosts[0].id}`)}
                        className="p-5 flex items-center gap-4 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg">
                          <img src={placePosts[0].images[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-black text-primary-500 uppercase tracking-tighter px-1.5 py-0.5 bg-primary-500/10 rounded">
                              {place.category}
                            </span>
                          </div>
                          <h4 className="text-lg font-black text-white truncate leading-tight">{place.name}</h4>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">{place.address}</p>
                        </div>
                      </div>

                      {/* Guides Recommended Section */}
                      <div className="bg-[#0c0c0c] p-4">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 px-1">Recommended By</p>
                        <div className="space-y-3">
                          {placePosts.map(post => (
                            <div 
                              key={post.id} 
                              onClick={() => navigate(`/post/${post.id}`)}
                              className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-black/40 hover:border-primary-500/30 transition-all cursor-pointer group"
                            >
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <img src={post.guide.profileImageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[11px] font-bold text-white group-hover:text-primary-400 transition-colors">{post.guide.nickname}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[10px] font-black text-white">{post.rating}</span>
                                  </div>
                                </div>
                                <p className="text-[11px] text-gray-400 line-clamp-1 italic font-light">
                                  "{post.content.split('.')[0]}..."
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {MOCK_POSTS.filter(p => p.place.name.includes(keyword)).length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center opacity-30">
                    <MapPin className="w-12 h-12 mb-3" />
                    <p className="text-sm font-medium">'{keyword}' 검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Section: Menus */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-primary-500" />
                  메뉴 / 후기
                </h3>
                <button className="text-[10px] font-bold text-gray-500 hover:text-primary-500 transition-colors">더보기</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {MOCK_POSTS.filter(p => p.content.includes(keyword) || p.place.category.includes(keyword)).slice(0, 4).map(post => (
                  <div key={post.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5">
                    <img src={post.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-[11px] font-bold text-white truncate">{post.place.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Themes (Collections) */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary-500" />
                  테마 큐레이션
                </h3>
                <Link to="/popular-guides" className="text-[10px] font-bold text-gray-500 hover:text-primary-500 transition-colors">더보기</Link>
              </div>
              <div className="space-y-2.5">
                {filteredCollections.slice(0, 3).map(collection => (
                  <div key={collection.id} className="bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-lg flex h-24">
                    <div className="w-24 h-full relative overflow-hidden flex-shrink-0">
                      <img src={collection.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <p className="text-[13px] font-bold text-white truncate group-hover:text-primary-400 transition-colors mb-1">{collection.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500">{collection.userId}</span>
                          <div className="flex items-center gap-1 text-primary-500">
                            <Heart className="w-2 h-2 fill-primary-500" />
                            <span className="text-[9px] font-black">{collection.likes?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[8px] text-primary-500 font-black px-1 py-0.5 bg-primary-500/10 rounded uppercase w-fit">
                        {collection.places.length} SPOTS
                      </span>
                    </div>
                  </div>
                ))}
                {MOCK_COLLECTIONS.filter(c => c.title.includes(keyword)).length === 0 && (
                  <p className="text-xs text-gray-600 px-1 italic">'{keyword}' 키워드를 포함한 테마가 없습니다.</p>
                )}
              </div>
            </section>

            {/* Section: Guides */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-500" />
                  가이드
                </h3>
                <Link to="/popular-guides" className="text-[10px] font-bold text-primary-500 hover:text-primary-400 transition-colors">더보기</Link>
              </div>
              <div className="space-y-3">
                {MOCK_POSTS.filter(p => p.guide.nickname.includes(keyword)).slice(0, 2).map(post => (
                  <div 
                    key={post.guide.id} 
                    onClick={() => navigate(`/guide/${post.guide.id}`)}
                    className="flex items-center justify-between p-4 bg-[#0c0c0c] border border-white/5 rounded-2xl group cursor-pointer hover:border-primary-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img src={post.guide.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        {post.guide.trustScore > 90 && (
                          <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                            <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors truncate mb-0.5">{post.guide.nickname}</p>
                        {post.guide.bio && (
                          <p className="text-[10px] text-gray-500 font-medium line-clamp-1 italic mb-0.5 opacity-70">
                            "{post.guide.bio}"
                          </p>
                        )}
                        <p className="text-[10px] text-gray-500 font-medium">신뢰지수 {post.guide.trustScore} • 포스트 24개</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${post.guide.nickname}님을 팔로우했습니다.`);
                      }}
                      className="px-4 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-primary-500 hover:border-primary-500 transition-all"
                    >
                      팔로우
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
