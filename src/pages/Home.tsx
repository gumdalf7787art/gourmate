import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, BadgeCheck, Flame, UtensilsCrossed, Heart } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { postService } from '@/services/postService';

export function Home() {
  const navigate = useNavigate();
  const CATEGORIES = ['전체', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비', '배달맛집', '기타'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
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

  // 필터링된 포스트 데이터
  const filteredPosts = selectedCategory === '전체' 
    ? allPosts
    : allPosts.filter(post => {
        if (selectedCategory === '파인다이닝') return post.tags?.includes('파인다이닝') || post.place.category === '파인다이닝';
        if (selectedCategory === '가성비') return post.tags?.includes('가성비');
        return post.place.category === selectedCategory;
      });

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
        <div className="flex items-center mb-4">
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
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">인기 추천맛집</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">오늘 가장 많은 좋아요를 받은 가이드의 선택</p>
          </div>
          <Link to="/popular-restaurants" className="text-[10px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">전체보기</Link>
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
      <section className="py-8">
        <div className="px-5 mb-5 flex justify-between items-end">
          <div>
          <h2 className="text-lg font-bold text-white tracking-tight">추천 테마</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">믿고 보는 미식가들의 큐레이션</p>
          </div>
          <Link to="/guide/themes" className="text-[10px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">전체보기</Link>
        </div>
        
        <div className="flex flex-col gap-3 px-5">
          {filteredCollections.length > 0 ? (
            filteredCollections.map((c) => (
              <Link 
                key={c.id} 
                to={`/theme/${c.id}`}
                className="bg-[#111] border border-white/30 rounded-xl relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-lg flex h-24"
              >
                <div className="w-24 h-full relative overflow-hidden flex-shrink-0">
                  <img src={c.image_url || c.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold text-white group-hover:text-primary-400 transition-colors pr-6 leading-tight line-clamp-2">
                      {c.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-gray-500 font-medium">{c.guide_nickname || c.userId}</span>
                      <span className="text-[8px] text-primary-500 font-black px-1 py-0.5 bg-primary-500/10 rounded uppercase">
                        {c.post_count || c.places?.length || 0} SPOTS
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-primary-500">
                    <Heart className="w-2.5 h-2.5 fill-primary-500" />
                    <span className="text-[10px] font-black">{(c.likes || 0).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-10 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
              <p className="text-gray-500 text-xs font-bold">해당 카테고리의 추천 테마가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 px-5 mx-auto max-w-[calc(100%-40px)]"></div>

      {/* 4. Popular Guides */}
      <section className="py-8">
        <div className="px-5 mb-5 flex justify-between items-end">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">오늘의 인기 가이드 추천</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">가장 신뢰받는 미식가들의 지도를 구독해보세요</p>
          </div>
          <Link to="/popular-guides" className="text-[10px] font-bold text-primary-500 cursor-pointer hover:text-primary-400 transition-colors">더보기</Link>
        </div>

        <div className="flex flex-col gap-3 px-5">
          {popularGuides.map((guide) => (
            <div key={guide.id} className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-white/30 rounded-2xl group hover:border-white/40 transition-all shadow-xl">
              <Link to={`/guide/${guide.id}`} className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-primary-500 to-orange-300 shadow-lg group-hover:scale-105 transition-transform">
                    <img src={guide.profileImageUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
                  </div>
                  {guide.trustScore > 90 && (
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/30">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors truncate mb-0.5">{guide.nickname}</p>
                  {guide.bio && (
                    <p className="text-[10px] text-gray-500 font-medium line-clamp-1 italic mb-0.5 opacity-70">
                      "{guide.bio}"
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 font-medium">신뢰지수 {guide.trustScore} • 포스트 {guide.postCount || 0}개</p>
                </div>
              </Link>
              <button className="px-4 py-2 bg-white/5 border border-white/30 text-white text-[11px] font-black rounded-xl hover:bg-primary-500 hover:border-primary-500 transition-all uppercase tracking-tighter shadow-inner">
                팔로우
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-[1px] bg-white/5 px-5 mx-auto max-w-[calc(100%-40px)]"></div>

      {/* 5. 실시간 트렌딩 */}
      <section className="py-8 flex-1">
        <div className="px-5 mb-6 space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">실시간 트렌딩</h2>
          <p className="text-sm text-gray-500">지금 가이드들이 가장 많이 추천하는 곳</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-12 px-5">
          {allPosts.map((post) => (
            <article key={post.id} className="flex flex-col relative group">
              {/* Guide Info */}
              <div className="flex items-center justify-between mb-4">
                <Link to={`/guide/${post.guide.id}`} className="flex items-center gap-3">
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
                </Link>
              </div>
              
              {/* Image Card (4:3 Aspect Ratio with Horizontal Slider) */}
              <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-[#111] mb-4 
                            ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:ring-white/25 transition-all duration-700 ease-in-out">
                
                {/* Horizontal Image Slider */}
                <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
                  {post.images.map((img: string, idx: number) => (
                    <div key={idx} className="flex-none w-full h-full snap-start">
                      <img 
                        src={img} 
                        alt={`${post.place.name} ${idx + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                
                {/* Image Overlay Info (Fixed on top of slider) */}
                <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-primary-500 text-white text-[9px] font-black rounded-md uppercase tracking-tight">
                          {post.place.category}
                        </span>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-md border border-white/10">
                          <Heart className="w-2.5 h-2.5 text-primary-500 fill-primary-500" />
                          <span className="text-[10px] font-black text-white">{(post.likes || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                      {post.place.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary-500/70" />
                      <span className="text-[12px]">{post.place.address}</span>
                    </div>
                  </div>
                </div>

                {/* Detail Link (Absolute Overlay) */}
                <Link to={`/post/${post.id}`} className="absolute inset-0 z-10 opacity-0">상세보기</Link>
              </div>
              
              {/* Content Description & Keywords */}
              <div className="px-1">
                {/* Keywords/Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="text-[11px] text-primary-500 font-bold px-2 py-1 bg-primary-500/5 rounded-lg border border-primary-500/10">
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-[14px] text-gray-300 line-clamp-3 leading-relaxed font-light mb-4">
                  <span className="text-white font-bold mr-2 text-lg">“</span>
                  {post.review || post.content}
                  <span className="text-white font-bold ml-0.5 text-lg">”</span>
                </p>
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
