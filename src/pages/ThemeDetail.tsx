import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, MapPin, Heart, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { postService } from '@/services/postService';

export default function ThemeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemeDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching theme:', id);
        const res = await postService.getTheme(id);
        if (res.success) {
          setTheme(res.data);
        } else {
          setError(res.error || '테마를 불러오지 못했습니다.');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || '네트워크 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemeDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold animate-pulse">테마 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-10 text-center bg-black">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">테마를 찾을 수 없습니다</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          {error || '해당 테마의 정보를 불러오는 중 문제가 발생했습니다.'}
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-8 py-3 bg-white text-black font-black rounded-2xl active:scale-95 transition-all shadow-xl"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  const formattedDate = theme.created_at ? new Date(theme.created_at).toLocaleDateString() : '';

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        {theme.image_url && (
          <img 
            src={theme.image_url} 
            alt={theme.title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-20">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Theme Info Section */}
      <div className="px-6 py-8">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {theme.keywords?.map((tag: string, idx: number) => (
            <span key={idx} className="shrink-0 px-3 py-1 bg-primary-500/10 text-primary-500 text-[11px] font-black rounded-full border border-primary-500/20">
              #{tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-black tracking-tighter leading-tight mb-4">
          {theme.title}
        </h1>
        
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {theme.description}
          </p>
        </div>
        
        <div className="flex items-center gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-gray-800 shadow-lg">
              {theme.guide_image ? (
                <img src={theme.guide_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-500/10">
                  <span className="text-[10px] font-black text-primary-500 uppercase">GM</span>
                </div>
              )}
            </div>
            <span className="text-sm font-black text-white">{theme.guide_nickname || '익명 가이드'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Spots List */}
      <main className="px-6 relative z-20 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]"></div>
            <h2 className="text-xl font-black text-white tracking-tighter italic uppercase">테마 속 맛집 <span className="text-primary-500 ml-1">{theme.posts?.length || 0}</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {theme.posts?.map((post: any, idx: number) => (
            <div 
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="bg-[#111] border border-white/10 rounded-[24px] overflow-hidden group active:scale-[0.98] transition-all cursor-pointer shadow-2xl flex flex-col hover:border-primary-500/30"
            >
              <div className="relative aspect-square">
                <img 
                  src={post.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'} 
                  alt={post.restaurant_name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10">
                  <span className="text-[9px] font-black text-primary-500 uppercase"># {idx + 1}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-primary-500/90 backdrop-blur-sm rounded-lg shadow-lg">
                  <Heart className="w-2.5 h-2.5 fill-white" />
                  <span className="text-[10px] font-black text-white">{(post.likes || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="shrink-0 px-1.5 py-0.5 bg-white/5 text-gray-500 text-[9px] font-black rounded border border-white/10 uppercase tracking-tighter">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-black text-white group-hover:text-primary-500 transition-colors mb-1 truncate leading-tight">
                    {post.restaurant_name}
                  </h3>
                  <p className="text-gray-500 text-[12px] font-medium leading-relaxed line-clamp-2 mb-2 italic opacity-80">
                    "{post.review || post.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="text-[10px] font-bold truncate max-w-[80px]">{post.address?.split(' ')[1] || '서울'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-500 text-[10px] font-black uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                    자세히 보기
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
