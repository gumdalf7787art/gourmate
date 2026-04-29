import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Share2, MapPin, Star, BadgeCheck, Utensils, Medal, Grid, Layers, Plus } from 'lucide-react';
import { MOCK_GUIDES, MOCK_POSTS, MOCK_COLLECTIONS } from '../data/mock';

const CATEGORIES = ['전체', 'Top 20', '한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비'];

export default function GuideProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'collections'>('posts');
  const [activeCategory, setActiveCategory] = useState('전체');

  // Find guide data
  const guide = MOCK_GUIDES.find(g => g.id === id);
  
  // Find guide's posts
  const guidePosts = useMemo(() => {
    return MOCK_POSTS.filter(p => p.guide.id === id);
  }, [id]);

  // Find guide's collections
  const guideCollections = useMemo(() => {
    return MOCK_COLLECTIONS.filter(c => c.userId === id);
  }, [id]);

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === '전체') return guidePosts;
    
    return guidePosts.filter(post => {
      if (activeCategory === 'Top 20') return post.isTop20;
      if (activeCategory === '가성비') return post.tags?.includes('가성비');
      if (activeCategory === '파인다이닝') return post.tags?.includes('파인다이닝') || post.place.category === '파인다이닝';
      return post.place.category === activeCategory;
    });
  }, [guidePosts, activeCategory]);

  if (!guide) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black mb-2">가이드를 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-6">존재하지 않거나 삭제된 가이드입니다.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary-500 rounded-full font-bold">돌아가기</button>
      </div>
    );
  }

  // Calculate total likes from all posts
  const totalLikes = guidePosts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-pretendard">
      {/* Dynamic Header Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-black/80 to-black z-10" />
        <img 
          src={guide.profileImageUrl} 
          alt="cover" 
          className="w-full h-full object-cover blur-2xl transform scale-110"
        />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full px-5 py-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </nav>

      <main className="relative z-20 pt-24 px-6">
        {/* Profile Info */}
        <section className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-yellow-500">
              <img 
                src={guide.profileImageUrl} 
                className="w-full h-full rounded-full object-cover border-2 border-black"
                alt={guide.nickname}
              />
            </div>
            {guide.trustScore >= 90 && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black rounded-full p-1">
                <BadgeCheck className="w-6 h-6 text-primary-500" />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-black tracking-tight mb-1">{guide.nickname}</h1>
          <p className="text-primary-500 text-sm font-bold mb-3">신뢰지수 {guide.trustScore}</p>
          
          <p className="text-gray-300 text-sm leading-relaxed max-w-[280px] mb-6">
            {guide.bio || '맛있는 음식과 멋진 공간을 기록합니다.'}
          </p>

          <div className="flex gap-3 w-full max-w-[300px]">
            <button className="flex-1 bg-primary-500 text-white font-bold py-3 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.3)]">
              <Plus className="w-5 h-5" /> 팔로우
            </button>
          </div>
        </section>

        {/* Stats Card */}
        <section className="bg-[#111] rounded-3xl p-5 mb-8 border border-white/10 shadow-2xl flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-white">{guide.totalPosts || guidePosts.length}</span>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">포스트</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-white">{(guide.followers || 0).toLocaleString()}</span>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">팔로워</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-black text-white">{totalLikes > 0 ? `${(totalLikes / 1000).toFixed(1)}k` : '0'}</span>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">받은 좋아요</span>
          </div>
        </section>

        {/* Content Tabs */}
        <section>
          <div className="flex gap-6 border-b border-white/10 mb-6">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
                activeTab === 'posts' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
              마이 스팟 ({guidePosts.length})
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full shadow-[0_-2px_10px_rgba(255,107,0,0.5)]" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('collections')}
              className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
                activeTab === 'collections' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              테마 큐레이션 ({guideCollections.length})
              {activeTab === 'collections' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full shadow-[0_-2px_10px_rgba(255,107,0,0.5)]" />
              )}
            </button>
          </div>

          {activeTab === 'posts' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-none px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${
                      activeCategory === category 
                        ? category === 'Top 20'
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white border-transparent shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                          : 'bg-primary-500 text-white border-primary-500' 
                        : category === 'Top 20'
                          ? 'bg-black text-yellow-500 border-yellow-500/30'
                          : 'bg-[#111] text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {category === 'Top 20' && <Medal className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />}
                    {category}
                  </button>
                ))}
              </div>

              {/* Filtered Posts Grid */}
              <div className="grid grid-cols-2 gap-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <Link 
                      key={post.id} 
                      to={`/post/${post.id}`}
                      className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 group flex flex-col"
                    >
                      <div className="relative aspect-square">
                        <img 
                          src={post.images[0]} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={post.place.name}
                        />
                        {post.isTop20 && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-lg">
                            <Medal className="w-2.5 h-2.5" /> TOP 20
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                          <p className="text-[12px] font-black text-white truncate mb-0.5">{post.place.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-300 bg-white/20 px-1.5 py-0.5 rounded-sm backdrop-blur-md">{post.place.category}</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                              <span className="text-[10px] font-black text-white">{post.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center border border-dashed border-white/10 rounded-2xl">
                    <Utensils className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">해당 카테고리의 포스트가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-4">
              {guideCollections.length > 0 ? (
                guideCollections.map(collection => (
                  <div key={collection.id} className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                    <img 
                      src={collection.thumbnail} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={collection.title}
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <h3 className="text-xl font-black text-white mb-2">{collection.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white/80 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
                          <MapPin className="w-3.5 h-3.5 text-primary-500" /> 스팟 {collection.places.length}곳
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#111]">
                  <Layers className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">아직 생성한 컬렉션이 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
