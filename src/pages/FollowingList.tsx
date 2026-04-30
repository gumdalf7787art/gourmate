import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BadgeCheck } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

export function FollowingList() {
  const navigate = useNavigate();
  
  // 임의로 몇 명의 가이드를 팔로우 중이라고 가정 (중복 제거)
  const uniqueGuides = Array.from(new Map(MOCK_POSTS.map(post => [post.guide.id, post.guide])).values());
  const [following, setFollowing] = useState(uniqueGuides.slice(0, 3));

  const handleUnfollow = (id: string) => {
    if(window.confirm('팔로우를 취소하시겠습니까?')) {
      setFollowing(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">나의 팔로우</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-5 py-6">
        <p className="text-xs font-medium text-gray-500 mb-4">
          현재 <span className="text-primary-500 font-bold">{following.length}</span>명의 가이드를 팔로우 중입니다.
        </p>

        <div className="flex flex-col gap-4">
          {following.length > 0 ? (
            following.map(guide => (
              <div key={guide.id} className="flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-2xl">
                <Link to={`/guide/${guide.id}`} className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <img src={guide.profileImageUrl} alt={guide.nickname} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                    {guide.trustScore > 90 && (
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                        <BadgeCheck className="w-4 h-4 text-primary-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">{guide.nickname}</span>
                    <span className="text-[10px] text-gray-500 line-clamp-1">{guide.bio || '신뢰지수 ' + guide.trustScore}</span>
                  </div>
                </Link>
                <button 
                  onClick={() => handleUnfollow(guide.id)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold rounded-xl transition-colors ml-2"
                >
                  언팔로우
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-500 text-sm">
              팔로우 중인 가이드가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
