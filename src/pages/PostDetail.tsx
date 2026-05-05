import { useState, useEffect } from 'react';
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
  Info,
  Star,
  Flame,
  Utensils
} from 'lucide-react';
import { postService } from '@/services/postService';
import { KakaoMap } from '@/components/KakaoMap';

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchPost = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await postService.getPost(id);
        const data = response.data || response;
        if (data && data.id) {
          setPost(data);
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 bg-black">
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-black pb-24 lg:pb-0 lg:pt-10">
      {/* Top Navigation Bar (Mobile Only) */}
      <header className={`fixed top-0 z-50 w-full max-w-[640px] lg:hidden px-5 py-4 flex items-center justify-between transition-all duration-300 ${
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
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white active:scale-95">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Image Gallery (Left Column on PC) */}
      <section className="relative w-full lg:w-1/2 lg:sticky lg:top-10 lg:h-[calc(100vh-80px)] aspect-[4/3] lg:aspect-auto bg-[#111] overflow-hidden lg:rounded-3xl lg:ml-5">
        <div className="w-full h-full overflow-x-auto lg:overflow-hidden snap-x snap-mandatory flex no-scrollbar lg:flex-col">
          {post.images.map((img: string, idx: number) => (
            <div key={idx} className="flex-none w-full h-full lg:h-full snap-start">
              <img 
                src={img} 
                alt={`${post.place.name} - ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Gradient Overlay (Mobile Only) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none z-10 lg:hidden" />
        
        {/* Pagination Dots (Mobile Only) */}
        {post.images.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 lg:hidden">
            {post.images.map((_: any, i: number) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary-500 w-4' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </section>

      {/* Content Area (Right Column on PC) */}
      <main className="flex-1 px-6 lg:px-10 -mt-8 lg:mt-0 relative z-30 rounded-t-[32px] lg:rounded-none bg-black border-t lg:border-t-0 border-white/10">
        
        {/* Place Basic Info */}
        <div className="pt-10 lg:pt-0 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-primary-500 text-white text-[9px] font-black rounded-md uppercase tracking-tight">
              {post.place.category}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-white">{post.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
            {post.place.name}
          </h1>

          {/* Keywords/Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string, idx: number) => (
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

        {/* Action Buttons (PC Only) */}
        <div className="hidden lg:flex gap-4 py-8 border-b border-white/5">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border transition-all ${
              isLiked ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Flame className={`w-5 h-5 ${isLiked ? 'fill-primary-500' : ''}`} />
            <span className="font-bold">좋아요 {post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl border transition-all ${
              isBookmarked ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-primary-500' : ''}`} />
            <span className="font-bold">관심등록</span>
          </button>
          <button className="h-14 px-8 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-colors">
            예약하기
          </button>
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
                <span className="font-bold text-white leading-none mb-1.5">{post.guide.nickname}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 font-medium">신뢰지수 {post.guide.trustScore}</span>
                  <div className="w-[1px] h-2.5 bg-white/10"></div>
                  <span className="text-[11px] text-primary-500 font-bold uppercase tracking-tighter">Verified Guide</span>
                </div>
              </div>
            </Link>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            {[
              { icon: MapPin, label: '주소', value: post.place.address, copy: true },
              { icon: Phone, label: '전화번호', value: post.place.phone || '등록된 번호가 없습니다.', copy: !!post.place.phone },
              { icon: Clock, label: '영업시간', value: post.place.openingHours || '11:00 AM - 10:00 PM (확인 필요)' },
            ].map((item: any, i: number) => (
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
              </div>
            ))}
          </div>

          {/* Menu Items Section */}
          {(post.menu_items || post.menuItems) && (post.menu_items || post.menuItems).length > 0 && (
            <div className="pt-10 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80">
                <Utensils className="w-3.5 h-3.5 text-primary-500" />
                가이드 추천 메뉴
              </h3>
              <div className="bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                {(post.menu_items || post.menuItems).map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-5 ${
                      idx !== (post.menu_items || post.menuItems).length - 1 ? 'border-b border-white/5' : ''
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
                    </div>
                    <span className="text-[14px] font-black text-primary-500">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Visitor Reviews Section */}
          <div className="pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80">
                <MessageCircle className="w-3.5 h-3.5 text-primary-500" />
                방문후기
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {[
                { name: '미식가S', date: '2026.04.25', rating: 5, content: '진짜 여기는 인생 맛집이에요! 분위기도 너무 좋고 음식 하나하나 정성이 느껴집니다.' },
                { name: '초코바닐라', date: '2026.04.22', rating: 4, content: '웨이팅이 조금 있었지만 기다린 보람이 있네요. 깔끔하고 맛있습니다.' },
              ].map((review: any, idx: number) => (
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
                  <p className="text-[13px] text-gray-400 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar (Mobile Only) */}
      <footer className="fixed bottom-0 z-50 w-full max-w-[640px] lg:hidden bg-black/80 backdrop-blur-3xl border-t border-white/10 px-6 py-4 flex items-center gap-4">
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
        </div>
        <button className="flex-1 h-14 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl active:scale-[0.98] transition-transform">
          예약하기
        </button>
      </footer>
    </div>
  );
}
