import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Heart, Bookmark, MessageCircle, BarChart3, Star, Crown, ChevronRight } from 'lucide-react';
import { postService } from '@/services/postService';

export function Analytics() {
  const navigate = useNavigate();
  const [trendPeriod, setTrendPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [rankingPeriod, setRankingPeriod] = useState<'daily' | 'monthly' | 'total'>('total');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 실제 통계 데이터 상태
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      try {
        setIsLoading(true);
        const res = await postService.getAnalytics(user.id);
        if (res.success) {
          setAnalyticsData(res.data);
        } else {
          setError(res.error || '통계 데이터를 불러오지 못했습니다.');
        }
      } catch (err: any) {
        setError(err.message || '네트워크 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-5 text-center">
        <p className="text-red-500 mb-4">{error || '데이터를 찾을 수 없습니다.'}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white text-black rounded-lg font-bold">다시 시도</button>
      </div>
    );
  }

  const { stats, topPosts, recentComments, trendData } = analyticsData;

  const currentTrendData = trendData[trendPeriod] || [0,0,0,0,0,0,0];
  const maxTrendValue = Math.max(...currentTrendData, 1);

  // 인기 포스팅 정렬 (API에서 순위가 이미 오긴 하지만 클라이언트에서 정렬 기준 변경 가능)
  const sortedPosts = [...topPosts].sort((a, b) => b.views[rankingPeriod] - a.views[rankingPeriod]);

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
              {currentTrendData.map((val: number, idx: number) => {
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
            {sortedPosts.map((post: any, idx: number) => (
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
            {recentComments.map((comment: any) => (
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
