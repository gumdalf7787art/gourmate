import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Heart, Bookmark, MessageCircle, BarChart3, Star, Crown, ChevronRight } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

export function Analytics() {
  const navigate = useNavigate();
  const [trendPeriod, setTrendPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [rankingPeriod, setRankingPeriod] = useState<'daily' | 'monthly' | 'total'>('total');

  // 가상의 통계 데이터
  const stats = {
    totalViews: 142530,
    totalLikes: 8420,
    totalBookmarks: 3150,
    totalComments: 1240,
    viewsGrowth: 12.5, // %
  };

  // 트렌드 차트용 가상 데이터
  const trendData = {
    today: [120, 250, 400, 310, 520, 480, 600], // 시간별 (단순화)
    week: [1200, 1500, 1800, 1400, 2100, 2800, 2500], // 요일별
    month: [4500, 5200, 4800, 6100], // 주차별
    year: [12000, 15000, 14500, 18000, 21000, 25000, 22000, 19000, 24000, 28000, 31000, 35000], // 월별
  };

  const currentTrendData = trendData[trendPeriod];
  const maxTrendValue = Math.max(...currentTrendData);

  // 내 포스팅 목록 (순위 매기기용)
  // Mock 데이터에 조회수가 없으므로 임의로 생성
  const myPostsWithStats = MOCK_POSTS.map(post => ({
    ...post,
    views: {
      daily: Math.floor(Math.random() * 500) + 50,
      monthly: Math.floor(Math.random() * 5000) + 500,
      total: Math.floor(Math.random() * 50000) + 5000,
    }
  }));

  // 순위 정렬
  const sortedPosts = [...myPostsWithStats].sort((a, b) => b.views[rankingPeriod] - a.views[rankingPeriod]).slice(0, 5);

  // 가상의 댓글 데이터
  const recentComments = [
    { id: 1, postName: '몽탄', author: '고기사랑', content: '진짜 인생 우대갈비입니다! 꿀팁 감사해요.', time: '2시간 전', profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
    { id: 2, postName: '오레노라멘', author: '면식수행자', content: '합정가면 무조건 들러야겠네요. 사진 너무 잘 찍으셨어요.', time: '5시간 전', profile: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
    { id: 3, postName: '누데이크', author: '디저트헌터', content: '피크 케이크 정말 궁금했는데 후기 보고 주말에 가기로 결심했습니다 ㅎㅎ', time: '1일 전', profile: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: 4, postName: '다운타우너', author: '버거맨', content: '갈릭 버터 프라이즈는 못 참죠 ㅠㅠ', time: '2일 전', profile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">접속 및 통계 관리</h1>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8">
        {/* Overview Stats */}
        <section>
          <h2 className="text-sm font-black text-primary-500 uppercase tracking-widest mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg group hover:border-primary-500/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">+{stats.viewsGrowth}%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">총 누적 조회수</p>
                <p className="text-2xl font-black text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="p-2 bg-pink-500/10 rounded-lg w-fit mb-2">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">총 좋아요 수</p>
                <p className="text-2xl font-black text-white">{stats.totalLikes.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-2">
                <Bookmark className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">총 저장 수</p>
                <p className="text-2xl font-black text-white">{stats.totalBookmarks.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div className="p-2 bg-green-500/10 rounded-lg w-fit mb-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">전체 댓글 수</p>
                <p className="text-2xl font-black text-white">{stats.totalComments.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* View Trend Chart */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-primary-500 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              조회수 트렌드
            </h2>
            <div className="flex bg-[#111] rounded-lg p-1 border border-white/10">
              {(['today', 'week', 'month', 'year'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setTrendPeriod(period)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                    trendPeriod === period ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {period === 'today' ? '오늘' : period === 'week' ? '주간' : period === 'month' ? '월간' : '연간'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 h-[220px] flex items-end gap-2 relative">
            {/* Y-axis labels (simplified) */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[9px] text-gray-600 font-bold pb-8 pt-5 text-right pr-2 border-r border-white/5">
              <span>{maxTrendValue.toLocaleString()}</span>
              <span>{(maxTrendValue / 2).toLocaleString()}</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="flex-1 h-full pl-8 flex items-end justify-between gap-1 pb-6 relative pt-5">
              {currentTrendData.map((val, idx) => {
                const heightPercentage = Math.max((val / maxTrendValue) * 100, 2);
                return (
                  <div key={idx} className="relative flex flex-col items-center flex-1 h-full justify-end group">
                    {/* 상단 숫자 표시 */}
                    <span className="text-[8px] font-black text-gray-400 mb-1 absolute" style={{ bottom: `${heightPercentage}%` }}>
                      {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-sm shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-500 ease-out group-hover:brightness-125"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {val.toLocaleString()}
                    </div>
                  </div>
                );
              })}
              
              {/* X-axis labels (dummy) */}
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[9px] text-gray-500 font-bold">
                {trendPeriod === 'week' && ['월', '화', '수', '목', '금', '토', '일'].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}
                {trendPeriod === 'month' && ['1주', '2주', '3주', '4주'].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}
                {trendPeriod === 'today' && ['06', '09', '12', '15', '18', '21', '24'].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}
                {trendPeriod === 'year' && ['1월', '3', '5', '7', '9', '11월'].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* Top Posts Ranking */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-primary-500 uppercase tracking-widest flex items-center gap-2">
              <Crown className="w-4 h-4" />
              인기 포스팅 순위
            </h2>
            <div className="flex bg-[#111] rounded-lg p-1 border border-white/10">
              {(['daily', 'monthly', 'total'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setRankingPeriod(period)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                    rankingPeriod === period ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {period === 'daily' ? '일간' : period === 'monthly' ? '월간' : '누적'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            {sortedPosts.map((post, idx) => (
              <div 
                key={post.id} 
                onClick={() => navigate(`/post/${post.id}`)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                  idx !== sortedPosts.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                  idx === 0 ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                  idx === 1 ? 'bg-gray-300 text-black shadow-[0_0_10px_rgba(209,213,219,0.5)]' :
                  idx === 2 ? 'bg-[#CD7F32] text-white shadow-[0_0_10px_rgba(205,127,50,0.5)]' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {idx + 1}
                </div>
                
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-white truncate mb-0.5">{post.place.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" /> {post.rating}</span>
                    <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" /> {post.likes}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="block text-[15px] font-black text-primary-500">{post.views[rankingPeriod].toLocaleString()}</span>
                  <span className="block text-[9px] text-gray-500 font-bold">views</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Comments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-primary-500 uppercase tracking-widest flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              최근 달린 댓글
            </h2>
            <button 
              onClick={() => navigate('/my/analytics/comments')}
              className="text-[11px] font-bold text-gray-400 hover:text-white flex items-center"
            >
              전체보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentComments.map(comment => (
              <div key={comment.id} className="bg-[#111] border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={comment.profile} alt={comment.author} className="w-6 h-6 rounded-full object-cover border border-white/10" />
                    <span className="text-xs font-bold text-gray-300">{comment.author}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{comment.time}</span>
                </div>
                <p className="text-[13px] text-white font-medium mb-3 pl-8">
                  "{comment.content}"
                </p>
                <div className="pl-8 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-bold">포스팅:</span>
                  <span className="text-[10px] font-black text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-md">{comment.postName}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
