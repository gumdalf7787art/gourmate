import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Medal, Star, MapPin, Flame } from 'lucide-react';
import { postService } from '@/services/postService';

export function GuideTop20() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<any>(null);
  const [top20Posts, setTop20Posts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await postService.getGuideProfile(id);
        if (res.success) {
          setGuide(res.data);
          setTop20Posts(res.data.top20Posts || []);
        }
      } catch (err) {
        console.error('Failed to fetch guide top 20:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* Top Navigation */}
      <nav className="fixed top-0 max-w-[640px] w-full px-5 py-4 flex items-center justify-between z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-white border border-white/10 active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-0.5">Guide's Choice</span>
          <span className="font-bold text-sm tracking-tight">{guide?.nickname}의 Top 20</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </nav>

      <main className="max-w-[640px] mx-auto pt-24 px-5">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <Medal className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">가이드 추천 Top 20</h1>
          <p className="text-gray-500 text-sm font-medium">가이드가 직접 선정한 최고의 맛집 리스트</p>
        </header>

        <div className="space-y-6">
          {top20Posts.map((post: any, idx: number) => (
            <Link 
              key={post.id} 
              to={`/post/${post.id}`}
              className="flex gap-4 bg-[#111] border border-white/10 rounded-[28px] overflow-hidden group hover:border-primary-500/30 transition-all shadow-xl"
            >
              {/* Rank & Image Area */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-2 left-2 w-7 h-7 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center border border-yellow-500/30 text-yellow-500 font-black text-xs">
                  {idx + 1}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 py-4 pr-5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black text-primary-500 uppercase tracking-tighter bg-primary-500/10 px-1.5 py-0.5 rounded">
                      {post.place.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-[11px] font-black text-white">{post.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-[16px] font-black text-white truncate mb-2 group-hover:text-primary-500 transition-colors">
                    {post.place.name}
                  </h3>
                  <p className="text-[12px] text-gray-400 font-medium leading-relaxed line-clamp-2 italic opacity-80">
                    "{post.review || post.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="text-[10px] truncate max-w-[120px]">
                      {post.place.address.split(' ')[1]} {post.place.address.split(' ')[2]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-500">
                    <Flame className="w-2.5 h-2.5 fill-primary-500" />
                    <span className="text-[10px] font-black">{(post.likes || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
