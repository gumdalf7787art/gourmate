import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share2, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  MessageCircle,
  BadgeCheck,
  Navigation,
  ExternalLink,
  Info,
  Star,
  Flame,
  User,
  Utensils,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { useState, useEffect } from 'react';
import { KakaoMap } from '@/components/KakaoMap';

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const post = MOCK_POSTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>포스트를 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-500 font-bold"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 z-50 w-full max-w-[640px] px-5 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent'
      }`}>
        <button 
          onClick={() => navigate(-1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            scrolled ? 'bg-transparent border-transparent text-white' : 'bg-black/40 backdrop-blur-md border-white/10 text-white'
          } active:scale-95`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        {scrolled && (
          <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-white transition-opacity truncate max-w-[200px]">
            {post.place.name}
          </h2>
        )}

        <div className="flex items-center gap-2">
          <button 
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
              scrolled ? 'bg-transparent border-transparent text-white' : 'bg-black/40 backdrop-blur-md border-white/10 text-white'
            } active:scale-95`}
          >
            <Share2 className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                scrolled ? 'bg-transparent border-transparent text-white' : 'bg-black/40 backdrop-blur-md border-white/10 text-white'
              } active:scale-95`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute right-0 mt-2 w-36 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <button 
                    onClick={() => {
                      setShowMoreMenu(false);
                      if (window.confirm('이 포스팅을 신고하시겠습니까?')) {
                        alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
                      }
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-bold"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    신고하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Image Gallery */}
      <section className="relative w-full aspect-[4/3] bg-[#111]">
        <div className="w-full h-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar">
          {post.images.map((img, idx) => (
            <div key={idx} className="flex-none w-full h-full snap-start">
              <img 
                src={img} 
                alt={`${post.place.name} - ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none z-10" />
        
        {/* Pagination Dots */}
        {post.images.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {post.images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary-500 w-4' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </section>

      {/* Content Area */}
      <main className="px-6 -mt-8 relative z-30 rounded-t-[32px] bg-black border-t border-white/10">
        
        {/* Place Basic Info */}
        <div className="pt-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-primary-500 text-white text-[9px] font-black rounded-md uppercase tracking-tight">
              {post.place.category}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-white">{post.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-tighter mb-4 leading-tight">
            {post.place.name}
          </h1>

          {/* Keywords/Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag, idx) => (
              <span key={idx} className="text-[11px] text-primary-500 font-bold px-2.5 py-1.5 bg-primary-500/5 rounded-xl border border-primary-500/20">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-primary-500/70" />
            <span className="text-[13px] font-medium">{post.place.address}</span>
          </div>
        </div>

        {/* Guide Review */}
        <div className="py-8 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <Link to={`/guide/${post.guide.id}`} className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={post.guide.profileImageUrl} 
                  alt={post.guide.nickname} 
                  className="w-12 h-12 rounded-full object-cover border border-white/10" 
                />
                {post.guide.trustScore > 90 && (
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/10">
                    <BadgeCheck className="w-4 h-4 text-primary-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white leading-none mb-1.5 group-hover:text-primary-500 transition-colors">{post.guide.nickname}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 font-medium">신뢰지수 {post.guide.trustScore}</span>
                  <div className="w-[1px] h-2.5 bg-white/10"></div>
                  <span className="text-[11px] text-primary-500 font-bold uppercase tracking-tighter">Verified Guide</span>
                </div>
              </div>
            </Link>
            <button className="px-5 py-2 bg-white/5 border border-white/30 text-white text-[12px] font-bold rounded-xl active:scale-95 transition-transform">
              팔로우
            </button>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 border border-white/30 relative shadow-2xl">
            <div className="absolute -top-3 left-6 bg-black px-2 flex items-center gap-1">
              <Flame className="w-4 h-4 text-primary-500" />
              <span className="text-primary-500 font-black text-xs uppercase tracking-widest">Guide's Choice</span>
            </div>
            <p className="text-[15px] text-gray-200 leading-relaxed font-light whitespace-pre-wrap pt-2 italic">
              "{post.content}"
            </p>
          </div>
        </div>

        {/* Detailed Place Info */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-primary-500" />
              상세 정보
            </h2>
            <button className="text-[10px] font-black text-primary-500 uppercase tracking-widest border border-primary-500/30 px-2 py-1 rounded-md">
              정보수정 제안
            </button>
          </div>

          <div className="w-full aspect-video bg-[#141414] rounded-2xl overflow-hidden relative border border-white/30 shadow-2xl">
            <KakaoMap 
              places={[{
                id: post.place.id,
                lat: post.place.latitude,
                lng: post.place.longitude,
                name: post.place.name
              }]}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: MapPin, label: '주소', value: post.place.address, copy: true },
              { icon: Phone, label: '전화번호', value: post.place.phone || '등록된 번호가 없습니다.', copy: !!post.place.phone },
              { icon: Clock, label: '영업시간', value: post.place.openingHours || '11:00 AM - 10:00 PM (확인 필요)' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 px-4 bg-[#111] border border-white/10 rounded-2xl group transition-all hover:border-primary-500/30">
                <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/5">
                  <item.icon className="w-4 h-4 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-500 mb-0.5 font-black uppercase tracking-widest block opacity-70">{item.label}</span>
                  <span className="text-[14px] text-gray-200 leading-tight font-bold truncate block">
                    {item.value}
                  </span>
                </div>
                {item.copy && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(item.value);
                      alert(`${item.label}가 복사되었습니다.`);
                    }}
                    className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase">복사</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
              onClick={() => setShowMapModal(true)}
              className="flex items-center justify-center gap-2 h-14 bg-primary-500 text-white font-black text-sm uppercase tracking-widest rounded-[20px] shadow-[0_10px_20px_rgba(255,107,0,0.2)] active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              길찾기
            </button>
            <a 
              href={`https://map.kakao.com/link/search/${encodeURIComponent(post.place.name)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 h-14 bg-white/5 border border-white/30 text-white font-black text-sm uppercase tracking-widest rounded-[20px] active:bg-white/10 transition-all"
            >
              <ExternalLink className="w-4 h-4 text-primary-500" />
              카카오맵 정보
            </a>
          </div>

          {/* Map Selection Modal */}
          {showMapModal && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:pb-20">
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setShowMapModal(false)}
              />
              <div className="relative w-full max-w-[400px] bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-black text-white text-center">길찾기 앱 선택</h3>
                  <p className="text-[11px] text-gray-500 text-center mt-1 font-bold uppercase tracking-widest">어떤 지도로 안내해 드릴까요?</p>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { 
                      name: '네이버 지도', 
                      icon: '/naver-map.png', 
                      color: 'bg-[#2DB400]',
                      url: `https://map.naver.com/v5/search/${encodeURIComponent(post.place.name)}`
                    },
                    { 
                      name: '카카오맵', 
                      icon: '/kakao-map.png', 
                      color: 'bg-[#FFCD00]',
                      url: `https://map.kakao.com/link/to/${post.place.name},${post.place.latitude},${post.place.longitude}`
                    },
                    { 
                      name: '구글 지도', 
                      icon: '/google-map.png', 
                      color: 'bg-white',
                      url: `https://www.google.com/maps/dir/?api=1&destination=${post.place.latitude},${post.place.longitude}`
                    }
                  ].map((map, i) => (
                    <a
                      key={i}
                      href={map.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowMapModal(false)}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors group"
                    >
                      <div className={`w-12 h-12 ${map.color} rounded-xl flex items-center justify-center overflow-hidden border border-white/5 shadow-lg group-active:scale-90 transition-transform`}>
                        <img src={map.icon} alt={map.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-black text-[15px]">{map.name}</span>
                        <p className="text-[11px] text-gray-500 font-medium">앱으로 연결하여 길찾기 시작</p>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-gray-700 rotate-180" />
                    </a>
                  ))}
                </div>
                <button 
                  onClick={() => setShowMapModal(false)}
                  className="w-full py-5 text-gray-500 font-bold text-sm hover:text-white transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {/* Menu Items Section */}
          {post.menuItems && post.menuItems.length > 0 && (
            <div className="pt-10 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80">
                <Utensils className="w-3.5 h-3.5 text-primary-500" />
                가이드 추천 메뉴
              </h3>
              <div className="bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                {post.menuItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-5 ${
                      idx !== post.menuItems!.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-black text-white">{item.name}</span>
                        {item.isSignature && (
                          <span className="px-1.5 py-0.5 bg-primary-500/10 text-primary-500 text-[9px] font-black rounded uppercase tracking-tighter">
                            Signature
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 font-bold italic">가이드의 진심 어린 선택</span>
                    </div>
                    <span className="text-[14px] font-black text-primary-500">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Content Section */}
          <div className="pt-10 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80">
              <Info className="w-3.5 h-3.5 text-primary-500" />
              상세 내용
            </h3>
            <div className="p-6 bg-[#080808] border border-white/10 rounded-[24px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Info className="w-12 h-12" />
              </div>
              <p className="text-[14px] text-gray-400 leading-relaxed font-light">
                {post.place.name}은(는) {post.place.category} 전문점으로, 엄선된 식재료와 {post.guide.nickname} 가이드가 보증하는 특별한 레시피로 많은 사랑을 받고 있는 곳입니다. 
                <br /><br />
                주요 특징으로는 정갈한 분위기 속에서 즐기는 {post.place.category}의 정수를 맛보실 수 있으며, 방문객들에게 잊지 못할 미식 경험을 선사합니다. 상세한 메뉴 구성과 일자별 특선 요리는 매장 상황에 따라 변동될 수 있으니 방문 전 확인을 권장드립니다.
              </p>
            </div>
          </div>

          {/* New Visitor Reviews Section */}
          <div className="pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80">
                <MessageCircle className="w-3.5 h-3.5 text-primary-500" />
                방문후기
              </h3>
              <button className="text-[11px] font-bold text-gray-500 hover:text-white transition-colors">전체보기</button>
            </div>

            <div className="space-y-3">
              {[
                { name: '미식가S', date: '2026.04.25', rating: 5, content: '진짜 여기는 인생 맛집이에요! 분위기도 너무 좋고 음식 하나하나 정성이 느껴집니다.' },
                { name: '초코바닐라', date: '2026.04.22', rating: 4, content: '웨이팅이 조금 있었지만 기다린 보람이 있네요. 깔끔하고 맛있습니다.' },
                { name: '맛따라멋따라', date: '2026.04.18', rating: 5, content: '가족들과 함께 방문했는데 모두 만족해하셨어요. 재방문 의사 200%입니다!' }
              ].map((review, idx) => (
                <div key={idx} className="p-5 bg-[#111] border border-white/10 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-[10px] text-primary-500 font-black">
                        {review.name[0]}
                      </div>
                      <span className="text-[12px] font-bold text-gray-200">{review.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                    ))}
                  </div>
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[13px] text-gray-300 font-bold hover:bg-white/10 transition-colors">
              후기 작성하기
            </button>
          </div>

          {/* New: Same Place, Other Guides Slider */}
          {MOCK_POSTS.filter(p => p.place.id === post.place.id && p.id !== post.id).length > 0 && (
            <div className="pt-12 space-y-5">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80 px-1">
                <User className="w-3.5 h-3.5 text-primary-500" />
                다른 가이드의 시선
              </h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
                {MOCK_POSTS.filter(p => p.place.id === post.place.id && p.id !== post.id).map(otherPost => (
                  <Link 
                    key={otherPost.id} 
                    to={`/post/${otherPost.id}`}
                    className="flex-none w-[130px] bg-[#111] border border-white/10 rounded-[20px] overflow-hidden snap-start group"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img src={otherPost.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-2 left-2 px-1 py-0.5 bg-black/60 backdrop-blur-md rounded-md flex items-center gap-1 border border-white/10">
                        <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                        <span className="text-[8px] font-black text-white">{otherPost.rating}</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <img src={otherPost.guide.profileImageUrl} className="w-3.5 h-3.5 rounded-full border border-white/10" />
                        <span className="text-[9px] font-bold text-gray-300 truncate">{otherPost.guide.nickname}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 line-clamp-2 italic leading-tight">
                        "{otherPost.content.split('.')[0]}..."
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* New: Other Restaurants by the Same Guide Slider */}
          {MOCK_POSTS.filter(p => p.guide.id === post.guide.id && p.place.category === post.place.category && p.id !== post.id).length > 0 && (
            <div className="pt-12 space-y-5">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80 px-1">
                <BadgeCheck className="w-4 h-4 text-primary-500" />
                {post.guide.nickname}의 또 다른 {post.place.category} 맛집
              </h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
                {MOCK_POSTS.filter(p => p.guide.id === post.guide.id && p.place.category === post.place.category && p.id !== post.id).map(guideOtherPost => (
                  <Link 
                    key={guideOtherPost.id} 
                    to={`/post/${guideOtherPost.id}`}
                    className="flex-none w-[140px] bg-[#111] border border-white/10 rounded-[24px] overflow-hidden snap-start group shadow-2xl"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img src={guideOtherPost.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-black text-white truncate leading-tight mb-1">{guideOtherPost.place.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-black text-gray-400">{guideOtherPost.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* New: Similar Restaurants Slider */}
          <div className="pt-10 space-y-5">
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80 px-1">
              <Utensils className="w-3.5 h-3.5 text-primary-500" />
              비슷한 느낌의 {post.place.category} 맛집
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
              {MOCK_POSTS.filter(p => p.place.category === post.place.category && p.place.id !== post.place.id).map(similarPost => (
                <Link 
                  key={similarPost.id} 
                  to={`/post/${similarPost.id}`}
                  className="flex-none w-[130px] bg-[#111] border border-white/10 rounded-[20px] overflow-hidden snap-start group"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img src={similarPost.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <p className="text-[10px] font-black text-white truncate leading-tight">{similarPost.place.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                        <span className="text-[8px] font-black text-white">{similarPost.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 z-50 w-full max-w-[640px] bg-black/80 backdrop-blur-3xl border-t border-white/10 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-6 pr-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <Flame className={`w-6 h-6 transition-all ${isLiked ? 'text-primary-500 scale-110' : 'text-gray-400'}`} />
            <span className="text-[10px] font-bold text-gray-500">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <Heart className={`w-6 h-6 transition-all ${isBookmarked ? 'fill-primary-500 text-primary-500 scale-110' : 'text-gray-400'}`} />
            <span className="text-[10px] font-bold text-gray-500">관심</span>
          </button>
          <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500">댓글</span>
          </button>
        </div>
        <button className="flex-1 h-14 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl active:scale-[0.98] transition-transform">
          예약하기
        </button>
      </footer>
    </div>
  );
}
