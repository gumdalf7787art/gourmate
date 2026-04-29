import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import { MOCK_GUIDES, MOCK_COLLECTIONS } from '../data/mock';

export default function GuideCollectionList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const guide = MOCK_GUIDES.find(g => g.id === id);
  const guideCollections = useMemo(() => MOCK_COLLECTIONS.filter(c => c.userId === id), [id]);

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-pretendard">
      {/* Top Navigation */}
      <nav className="sticky top-0 w-full px-5 py-4 flex items-center justify-between z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black text-sm tracking-widest">{guide.nickname}</span>
          <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">추천 테마</span>
        </div>
        <div className="w-10" />
      </nav>

      <main className="pt-6 px-6">
        <div className="mb-6">
          <h2 className="text-xl font-black text-white tracking-tighter">추천 테마 리스트</h2>
          <p className="text-[12px] text-gray-500 mt-1">가이드가 직접 엄선한 특별한 미식 큐레이션</p>
        </div>

        <div className="flex flex-col gap-4">
          {guideCollections.length > 0 ? (
            guideCollections.map(c => (
              <Link 
                key={c.id} 
                to={`/theme/${c.id}`}
                className="bg-[#111] border border-white/30 rounded-xl relative overflow-hidden group hover:border-primary-500/30 transition-all shadow-lg flex h-24 cursor-pointer"
              >
                {/* Left Image */}
                <div className="w-24 h-full relative overflow-hidden flex-shrink-0">
                  <img src={c.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
                
                {/* Right Content */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[13px] font-bold text-white group-hover:text-primary-400 transition-colors pr-6 leading-tight line-clamp-2">
                      {c.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-gray-500 font-medium">{guide.nickname}</span>
                      <span className="text-[8px] text-primary-500 font-black px-1 py-0.5 bg-primary-500/10 rounded uppercase">
                        {c.places.length} 스팟
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-primary-500">
                    <Heart className="w-2.5 h-2.5 fill-primary-500" />
                    <span className="text-[10px] font-black">{c.likes?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/5">
              <span className="text-4xl mb-4 opacity-50">📂</span>
              <p className="text-gray-400 font-bold">아직 생성된 테마가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
