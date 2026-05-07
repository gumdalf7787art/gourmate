import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, BadgeCheck, Flame, UtensilsCrossed, Heart, Layers, ChevronDown, X, Check } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { postService } from '@/services/postService';

const REGIONS = [
  '전국', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', 
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

export function Home() {
  const navigate = useNavigate();
  const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비', '배달맛집', '기타'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedLocation, setSelectedLocation] = useState('전국');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [realPosts, setRealPosts] = useState<any[]>([]);
  const [realThemes, setRealThemes] = useState<any[]>([]);
  const [randomThemes, setRandomThemes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, themesRes] = await Promise.all([
          postService.getPosts(),
          postService.getThemes()
        ]);
        
        setRealPosts(postsRes || []);
        
        if (themesRes.success) {
          const themes = themesRes.data || [];
          setRealThemes(themes);
          // Pick 4 random themes
          const shuffled = [...themes].sort(() => 0.5 - Math.random());
          setRandomThemes(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const allPosts = [...realPosts, ...MOCK_POSTS];

  const CATEGORY_ICONS: { [key: string]: string } = {
    '전체': '🍽️', '한식': '🍚', '일식': '🍣', '중식': '🥡', 
    '양식': '🍝', '카페': '☕', '파인다이닝': '🥂', '가성비': '💰',
    '배달맛집': '🛵', '기타': '🍴'
  };

  // 필터링된 포스트 데이터 (지역 + 카테고리)
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      // 1. 지역 필터링
      const address = post.place?.address || '';
      const matchesLocation = selectedLocation === '전국' || 
        address.includes(selectedLocation === '서울' ? '서울특별시' : 
                        selectedLocation === '경기' ? '경기도' : 
                        selectedLocation === '부산' ? '부산광역시' :
                        selectedLocation === '인천' ? '인천광역시' :
                        selectedLocation === '대구' ? '대구광역시' :
                        selectedLocation === '광주' ? '광주광역시' :
                        selectedLocation === '대전' ? '대전광역시' :
                        selectedLocation === '울산' ? '울산광역시' :
                        selectedLocation === '제주' ? '제주특별자치도' :
                        selectedLocation === '세종' ? '세종특별자치시' :
                        selectedLocation);
      
      if (!matchesLocation) return false;

      // 2. 카테고리 필터링
      if (selectedCategory === '전체') return true;
      if (selectedCategory === '파인다이닝') return post.tags?.includes('파인다이닝') || post.place.category === '파인다이닝';
      if (selectedCategory === '가성비') return post.tags?.includes('가성비');
      return post.place.category === selectedCategory;
    });
  }, [allPosts, selectedLocation, selectedCategory]);

  // 필터링된 테마 데이터
  const filteredCollections = useMemo(() => {
    const baseThemes = selectedCategory === '전체' ? randomThemes : realThemes;
    if (selectedCategory === '전체') return baseThemes;

    return baseThemes.filter(c => {
      const keywords = c.keywords || [];
      if (selectedCategory === '파인다이닝') return keywords.includes('파인다이닝') || keywords.includes('양식');
      if (selectedCategory === '가성비') return keywords.includes('가성비');
      return keywords.includes(selectedCategory);
    });
  }, [selectedCategory, realThemes, randomThemes]);

  // 인기 가이드 중복 제거 및 실시간 포스트 수 포함 추출
  const popularGuides = useMemo(() => {
    const guideMap = new Map();
    allPosts.forEach(post => {
      if (post.guide && !guideMap.has(post.guide.id)) {
        guideMap.set(post.guide.id, post.guide);
      }
    });
    return Array.from(guideMap.values()).slice(0, 3);
  }, [allPosts]);

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-black selection:bg-primary-500/30">
      {/* 1. Header & Search Bar */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <img src="/logo.png" alt="Gourmate Logo" className="w-8 h-8 object-contain" />
              <h1 className="text-2xl font-black tracking-tighter">
                <span className="text-white">GOUR</span>
                <span className="text-primary-500">MATE</span>
              </h1>
            </div>

            {/* Location Selector */}
            <button 
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
            >
              <MapPin className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-[13px] font-bold text-white/90">{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
        
        <div 
          onClick={() => navigate('/search')}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <div
            className="block w-full pl-11 pr-4 py-3.5 bg-[#111] border border-white/30 rounded-2xl leading-5 text-gray-500 sm:text-sm shadow-inner select-none cursor-pointer hover:bg-[#1a1a1a] transition-all"
          >
            맛집 찾기
          </div>
        </div>
      </header>

      {/* 2. Compact 2-Row Category Grid */}
      <section className="px-5 py-4">
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl border transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary-500 border-primary-500 shadow-lg shadow-primary-500/20 scale-[0.96]'
                  : 'bg-[#161616] border-white/20 hover:border-white/40'
              }`}
            >
              <span className="text-base mb-0.5">{CATEGORY_ICONS[cat]}</span>
              <span className={`text-[10px] font-bold tracking-tighter ${
                selectedCategory === cat ? 'text-white' : 'text-gray-400'
              }`}>
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* 2. 인기 추천맛집 (2x2 Grid) */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">인기 추천맛집</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-1">오늘 가장 많은 좋아요를 받은 가이드의 선택</p>
          </div>
          <Link to="/popular-restaurants" className="text-[12px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">전체보기</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.sort((a, b) => b.likes - a.likes).slice(0, 4).map((post) => (
              <Link to={`/post/${post.id}`} key={post.id} className="group cursor-pointer">
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-2.5 border border-white/5 relative bg-[#111] shadow-2xl">
                  <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white">
                      <Flame className="w-2.5 h-2.5 text-primary-500" />
                      <span className="text-[10px] font-bold">{post.likes}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium">{post.place.category}</span>
                  </div>
                </div>
                <h4 className="text-white text-[13px] font-bold truncate mb-1 group-hover:text-primary-400 transition-colors">{post.place.name}</h4>
                
                {/* Keywords/Tags */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {post.tags?.slice(0, 3).map((tag: string, idx: number) => (
                    <span key={idx} className="text-[9px] text-primary-500/80 font-medium">#{tag}</span>
                  ))}
                </div>

                {/* 한줄평 */}
                {post.review && (
                  <p className="text-[10px] text-gray-300 font-medium line-clamp-1 mb-2 italic opacity-80">
                    "{post.review}"
                  </p>
                )}

                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-2.5 h-2.5 text-primary-500/50" />
                  <span className="text-[10px] truncate leading-none">
                    {post.place.address.split(' ')[0].replace('서울특별시', '서울').replace('부산광역시', '부산').replace('대구광역시', '대구').replace('인천광역시', '인천').replace('광주광역시', '광주').replace('대전광역시', '대전').replace('울산광역시', '울산').replace('세종특별자치시', '세종')} {post.place.address.split(' ')[1]}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 py-10 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/10 rounded-3xl">
              <UtensilsCrossed className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">해당 카테고리의 맛집이 아직 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 px-5 mx-auto max-w-[calc(100%-40px)]"></div>

      {/* 3. Recommended Themes */}
      <section className="py-12 bg-white/2">
        <div className="px-5 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">추천 테마</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-1">믿고 보는 미식가들의 큐레이션</p>
          </div>
          <Link to="/popular-themes" className="text-[12px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">전체보기</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-5">
          {filteredCollections.length > 0 ? (
            filteredCollections.map((c, idx) => (
              <Link 
                key={c.id} 
                to={`/theme/${c.id}`}
                className="group flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-4 border border-white/10 shadow-2xl shadow-black/50">
                  <img 
                    src={c.image_url || c.thumbnail} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-primary-500" />
                    <span className="text-[10px] font-black text-white">{c.post_count || c.places?.length || 0}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-primary-500/90 rounded-lg shadow-lg">
                    <Heart className="w-2.5 h-2.5 fill-white" />
                    <span className="text-[10px] font-black text-white">{(c.likes || 0).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="px-1">
                  <h4 className="text-[15px] font-black text-white group-hover:text-primary-500 transition-colors leading-tight line-clamp-1 mb-1">
                    {c.title}
                  </h4>
                  {c.description && (
                    <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mb-2 opacity-80">
                      {c.description.split('\n')[0]}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-bold">{c.guide_nickname || '익명 가이드'}</span>
                    <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                    <span className="text-[10px] text-gray-700 font-black uppercase tracking-tighter italic">Theme</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/2">
              <span className="text-4xl mb-4 block opacity-30">🍽️</span>
              <p className="text-gray-500 text-sm font-bold">해당 카테고리의 추천 테마가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 px-5 mx-auto max-w-[calc(100%-40px)]"></div>

      {/* 4. Popular Guides */}
      <section className="py-10">
        <div className="px-5 mb-7 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">인기 가이드 추천</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-1">가장 신뢰받는 미식가들의 지도를 구독해보세요</p>
          </div>
          <Link to="/popular-guides" className="text-[12px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">전체보기</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5">
          {popularGuides.slice(0, 4).map((guide) => (
            <div key={guide.id} className="p-5 bg-[#111] border border-white/10 rounded-[28px] group hover:border-primary-500/30 transition-all shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-4">
                <Link to={`/guide/${guide.id}`} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-primary-500 to-orange-400 shadow-xl group-hover:scale-105 transition-transform duration-500">
                      <img src={guide.profileImageUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
                    </div>
                    {guide.trustScore > 90 && (
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/20 shadow-lg">
                        <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[15px] font-black text-white group-hover:text-primary-400 transition-colors tracking-tight">{guide.nickname}</p>
                      <span className="px-1.5 py-0.5 bg-primary-500/10 text-primary-500 text-[9px] font-black rounded uppercase">Lv.{Math.floor(guide.trustScore / 10)}</span>
                    </div>
                    {guide.bio && (
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5 opacity-80">
                        {guide.bio.split('\n')[0]}
                      </p>
                    )}
                  </div>
                </Link>
                <button className="px-4 py-1.5 bg-white text-black text-[11px] font-black rounded-xl hover:bg-primary-500 hover:text-white transition-all uppercase tracking-tighter shadow-xl active:scale-90">
                  팔로우
                </button>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">신뢰지수</span>
                  <span className="text-[12px] text-white font-black">{guide.trustScore}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">포스트</span>
                  <span className="text-[12px] text-white font-black">{guide.postCount || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">팔로워</span>
                  <span className="text-[12px] text-white font-black">{(guide.followers || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 px-5 mx-auto max-w-[calc(100%-40px)]"></div>

      {/* 5. 실시간 트렌딩 */}
      <section className="py-8 flex-1">
        <div className="px-5 mb-6">
          <h2 className="text-xl font-black text-white tracking-tighter">실시간 트렌딩</h2>
          <p className="text-[13px] text-gray-500 font-medium mt-1">지금 가이드들이 가장 많이 추천하는 곳</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 px-5">
          {filteredPosts.length > 0 ? (
            filteredPosts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 12)
              .map((post) => (
              <Link to={`/post/${post.id}`} key={post.id} className="group cursor-pointer">
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-2.5 border border-white/5 relative bg-[#111] shadow-2xl">
                  <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white">
                      <Flame className="w-2.5 h-2.5 text-primary-500" />
                      <span className="text-[10px] font-bold">{post.likes}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium">{post.place.category}</span>
                  </div>
                </div>
                <h4 className="text-white text-[13px] font-bold truncate mb-1 group-hover:text-primary-400 transition-colors">{post.place.name}</h4>
                
                {/* Keywords/Tags */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {post.tags?.slice(0, 3).map((tag: string, idx: number) => (
                    <span key={idx} className="text-[9px] text-primary-500/80 font-medium">#{tag}</span>
                  ))}
                </div>

                {/* 한줄평 */}
                {post.review && (
                  <p className="text-[10px] text-gray-300 font-medium line-clamp-1 mb-2 italic opacity-80">
                    "{post.review}"
                  </p>
                )}

                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-2.5 h-2.5 text-primary-500/50" />
                  <span className="text-[10px] truncate leading-none">
                    {post.place.address.split(' ')[0].replace('서울특별시', '서울').replace('부산광역시', '부산').replace('대구광역시', '대구').replace('인천광역시', '인천').replace('광주광역시', '광주').replace('대전광역시', '대전').replace('울산광역시', '울산').replace('세종특별자치시', '세종')} {post.place.address.split(' ')[1]}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/5 rounded-[40px] bg-white/2">
              <UtensilsCrossed className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm font-bold">해당 지역 및 카테고리에 등록된 포스트가 없습니다.</p>
              <p className="text-xs mt-1 opacity-60">전국으로 설정하거나 다른 카테고리를 선택해보세요.</p>
            </div>
          )}
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

      {/* 6. Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-0 sm:pb-10">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLocationModal(false)}
          />
          <div className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-t-[32px] sm:rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
            <div className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">지역 선택</h3>
                <p className="text-[12px] text-gray-500 font-medium mt-1">탐색하고 싶은 지역을 선택해주세요.</p>
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] no-scrollbar">
              <div className="grid grid-cols-3 gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedLocation(region);
                      setShowLocationModal(false);
                    }}
                    className={`py-3.5 rounded-2xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 border ${
                      selectedLocation === region
                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {selectedLocation === region && <Check className="w-3.5 h-3.5" />}
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-black/40 border-t border-white/5">
              <button 
                onClick={() => setShowLocationModal(false)}
                className="w-full py-4 bg-white text-black font-black rounded-2xl active:scale-95 transition-all shadow-xl"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
