import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Utensils, User, MapPin, Hash } from 'lucide-react';
import { MOCK_POSTS, MOCK_COLLECTIONS } from '@/data/mock';


export function GeneralSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-black">
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
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0c0c0c] border border-white/5 rounded-2xl text-sm text-gray-300 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all"
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
                <span className="text-[10px] font-bold text-primary-500 cursor-pointer">더보기</span>
              </div>
              <div className="space-y-3">
                {MOCK_POSTS.slice(0, 3).map((post) => (
                  <div key={post.guide.id} className="flex items-center justify-between p-4 bg-[#0c0c0c] border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-primary-500 to-orange-300">
                        <img src={post.guide.profileImageUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{post.guide.nickname}</p>
                        <p className="text-[11px] text-gray-500">신뢰지수 {post.guide.trustScore} • 포스트 24개</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-primary-500 hover:border-primary-500 transition-all">팔로우</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 pt-4">
            {/* Section: Restaurants */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  식당
                </h3>
                <button className="text-[10px] font-bold text-gray-500 hover:text-primary-500 transition-colors">더보기</button>
              </div>
              <div className="space-y-2">
                {MOCK_POSTS.filter(p => p.place.name.includes(keyword)).slice(0, 2).map(post => (
                  <div key={post.id} className="p-4 bg-[#0c0c0c] border border-white/5 rounded-2xl flex items-center gap-4">
                    <img src={post.images[0]} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{post.place.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{post.place.address}</p>
                    </div>
                  </div>
                ))}
                {MOCK_POSTS.filter(p => p.place.name.includes(keyword)).length === 0 && (
                  <p className="text-xs text-gray-600 px-1 italic">'{keyword}' 이름의 식당 검색 결과가 없습니다.</p>
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
                <button className="text-[10px] font-bold text-gray-500 hover:text-primary-500 transition-colors">더보기</button>
              </div>
              <div className="space-y-3">
                {MOCK_COLLECTIONS.filter(c => c.title.includes(keyword)).slice(0, 2).map(collection => (
                  <div key={collection.id} className="p-5 bg-[#0c0c0c] border border-white/5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-50"></div>
                    <h4 className="text-sm font-bold text-white mb-2 pr-4">{collection.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-medium">가이드 ID: {collection.userId}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-primary-500 font-bold border border-white/5">{collection.places.length} SPOTS</span>
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
                <button className="text-[10px] font-bold text-gray-500 hover:text-primary-500 transition-colors">더보기</button>
              </div>
              <div className="space-y-3">
                {MOCK_POSTS.filter(p => p.guide.nickname.includes(keyword)).slice(0, 2).map(post => (
                  <div key={post.guide.id} className="flex items-center justify-between p-4 bg-[#0c0c0c] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img src={post.guide.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-white">{post.guide.nickname}</p>
                        <p className="text-[11px] text-gray-500">신뢰지수 {post.guide.trustScore}</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg">프로필</button>
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
