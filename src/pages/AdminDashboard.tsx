import { AdminLayout } from '@/components/AdminLayout';
import { 
  Users, 
  Map, 
  Heart, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

export function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  const kpis = [
    { label: '전체 회원 수', value: '12,482', change: '+12.5%', isPositive: true, icon: <Users /> },
    { label: '누적 테마 수', value: '3,842', change: '+5.2%', isPositive: true, icon: <Map /> },
    { label: '전체 포스팅', value: '28,591', change: '+18.1%', isPositive: true, icon: <Activity /> },
    { label: '총 인터랙션 (좋아요/저장)', value: '142.5K', change: '-1.2%', isPositive: false, icon: <Heart /> },
  ];

  // 차트 모의 데이터 (기간에 따라 다른 모양을 보여주기 위함)
  const chartData = {
    daily: [30, 45, 25, 60, 75, 40, 90], // 월~일
    weekly: [40, 50, 65, 80, 95], // 1주~5주
    monthly: [30, 45, 60, 50, 80, 100, 90, 120, 110, 140, 130, 160], // 1월~12월
    yearly: [50, 80, 120] // 2024~2026
  };
  
  const labels = {
    daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekly: ['W1', 'W2', 'W3', 'W4', 'W5'],
    monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    yearly: ['2024', '2025', '2026']
  };

  const currentData = chartData[chartPeriod];
  const currentLabels = labels[chartPeriod];
  const maxVal = Math.max(...currentData);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1">DASHBOARD</h1>
            <p className="text-gray-500 text-sm font-medium">플랫폼의 핵심 지표와 실시간 트렌드를 모니터링합니다.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#111] p-1 rounded-xl border border-white/5">
            <span className="px-3 py-1.5 text-xs font-bold text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Last 30 Days
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-500">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary-500/10 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary-500 group-hover:border-primary-500/30 transition-all">
                    {kpi.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-md ${kpi.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</h3>
                  <div className="text-3xl font-black text-white tracking-tighter">
                    {kpi.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Traffic Overview</h3>
                <p className="text-[11px] text-gray-500 font-medium">기간별 접속자 트렌드 (Unique Visitors)</p>
              </div>
              
              {/* Chart Period Selector */}
              <div className="flex bg-[#111] border border-white/5 rounded-lg p-1">
                {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                      chartPeriod === period ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom CSS Chart */}
            <div className="flex-1 flex items-end justify-between gap-2 h-64 pt-6 border-b border-white/10 pb-2 relative">
              {/* Y-axis guidelines */}
              <div className="absolute inset-x-0 bottom-2 top-6 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map(pct => (
                  <div key={pct} className="w-full border-t border-white/[0.03] relative">
                    <span className="absolute -left-2 -top-2 -translate-x-full text-[9px] text-gray-600 font-bold">{pct === 0 ? '0' : ''}</span>
                  </div>
                ))}
              </div>

              {currentData.map((val, idx) => {
                const heightPct = (val / maxVal) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative z-10 h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                      {val.toLocaleString()} 명
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-white/5 group-hover:bg-primary-500/80 rounded-t-sm transition-all duration-500 relative overflow-hidden"
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/20 group-hover:bg-white/40"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Label */}
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{currentLabels[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed / Top Performers */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Trending Now</h3>
              <button className="text-[10px] font-bold text-primary-500 hover:text-primary-400">View All</button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block border-b border-white/5 pb-2">Top Guides</span>
                <div className="space-y-3 mt-3">
                  {['맛잘알가이드', '고독한미식가', '성수동주민'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">
                          {i + 1}
                        </div>
                        <span className="text-xs font-bold text-gray-300 group-hover:text-primary-500 transition-colors">{name}</span>
                      </div>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block border-b border-white/5 pb-2">Hot Themes</span>
                <div className="space-y-3 mt-3">
                  {['2026 서울 미슐랭 투어', '비오는 날 생각나는 전집', '연남동 데이트 코스'].map((theme, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-300 group-hover:text-white transition-colors truncate max-w-[150px]">{theme}</span>
                        <span className="text-[9px] text-gray-600 font-bold">120K Views</span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-gray-600 group-hover:text-primary-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 mt-4 bg-primary-500/10 text-primary-500 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-500 hover:text-white transition-all border border-primary-500/20">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
