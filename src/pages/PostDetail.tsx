import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Share2, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  Bookmark, 
  MessageCircle,
  BadgeCheck,
  Navigation,
  ExternalLink,
  Info
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
          <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-white transition-opacity">
            {post.place.name}
          </h2>
        )}

        <button 
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            scrolled ? 'bg-transparent border-transparent text-white' : 'bg-black/40 backdrop-blur-md border-white/10 text-white'
          } active:scale-95`}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Image Gallery */}
      <section className="relative w-full aspect-[4/3] bg-[#111]">
        <div className="w-full h-full overflow-x-auto snap-x flex no-scrollbar">
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
        
        {/* Verification Badge Overlay */}
        {post.isPaidByMe && (
          <div className="absolute bottom-10 left-6 z-20">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
              <BadgeCheck className="w-3.5 h-3.5" />
              내돈내산 인증 가이드
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none z-10" />
        
        {/* Pagination Dots */}
        {post.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {post.images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        )}
      </section>

      {/* Content Area */}
      <main className="px-6 -mt-6 relative z-30 rounded-t-[32px] bg-black border-t border-white/5">
        
        {/* Place Basic Info */}
        <div className="pt-8 pb-6 border-b border-white/5">
          <div className="flex justify-between items-start mb-2 text-primary-500 text-[10px] font-black uppercase tracking-widest">
            <span>{post.place.category}</span>
            <span className="text-gray-500">{post.createdAt}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-4 leading-tight">
            {post.place.name}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {post.place.tags?.map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-[#141414] border border-white/10 rounded-lg text-gray-400 text-[11px] font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Guide Review */}
        <div className="py-8 border-b border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={post.guide.profileImageUrl} 
                  alt={post.guide.nickname} 
                  className="w-12 h-12 rounded-full object-cover border border-white/10" 
                />
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/10">
                  <BadgeCheck className="w-4 h-4 text-primary-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white leading-none mb-1.5">{post.guide.nickname}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 font-medium">신뢰지수 {post.guide.trustScore}</span>
                  <div className="w-[1px] h-2.5 bg-white/10"></div>
                  <span className="text-[11px] text-primary-500 font-bold">TOP GUIDE</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-white text-black text-[12px] font-bold rounded-full active:scale-95 transition-transform">
              팔로우
            </button>
          </div>

          <div className="bg-[#0c0c0c] rounded-2xl p-5 border border-white/5 relative">
            <div className="absolute -top-3 left-6 bg-black px-2">
              <span className="text-primary-500 font-serif text-3xl">“</span>
            </div>
            <p className="text-[15px] text-gray-300 leading-relaxed font-light whitespace-pre-wrap pt-2">
              {post.content}
            </p>
          </div>
        </div>

        {/* Detailed Place Info */}
        <section className="py-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-500" />
            상세 정보
          </h2>

          <div className="w-full aspect-video bg-[#141414] rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl">
            <KakaoMap 
              lat={post.place.latitude} 
              lng={post.place.longitude} 
              name={post.place.name} 
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center shrink-0 border border-white/5">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-0.5 font-medium">주소</span>
                <span className="text-sm text-gray-200">{post.place.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center shrink-0 border border-white/5">
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-0.5 font-medium">영업시간</span>
                <span className="text-sm text-gray-200">{post.place.openingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center shrink-0 border border-white/5">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-0.5 font-medium">전화번호</span>
                <span className="text-sm text-gray-200 underline decoration-white/20 underline-offset-4">{post.place.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="flex items-center justify-center gap-2 h-14 bg-[#141414] border border-white/10 rounded-2xl text-white font-bold active:bg-[#1a1a1a] transition-colors">
              <Navigation className="w-4 h-4 text-primary-500" />
              길찾기
            </button>
            <button className="flex items-center justify-center gap-2 h-14 bg-[#141414] border border-white/10 rounded-2xl text-white font-bold active:bg-[#1a1a1a] transition-colors">
              <ExternalLink className="w-4 h-4 text-primary-500" />
              웹사이트
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 z-50 w-full max-w-[640px] bg-black/80 backdrop-blur-3xl border-t border-white/5 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-6 pr-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500 shadow-lg' : 'text-gray-400'}`} />
            <span className="text-[10px] font-bold text-gray-500">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-primary-500 text-primary-500' : 'text-gray-400'}`} />
            <span className="text-[10px] font-bold text-gray-500">저장</span>
          </button>
          <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-500">댓글</span>
          </button>
        </div>
        <button className="flex-1 h-14 bg-primary-500 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(249,115,22,0.3)] active:scale-[0.98] transition-transform">
          예약하기
        </button>
      </footer>
    </div>
  );
}
