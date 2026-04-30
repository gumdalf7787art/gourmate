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
    daily: [1250, 1420, 980, 2100, 2850, 4200, 3800], // 월~일
    weekly: [18500, 21000, 19500, 24000, 28500], // 1주~5주
    monthly: [45000, 52000, 61000, 58000, 72000, 85000, 92000, 105000, 98000, 112000, 125000, 142000], // 1월~12월
    yearly: [850000, 1240000, 1580000] // 2024~2026
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

  // 숫자를 K 단위로 포맷팅
  const formatValue = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  const handleDownloadData = () => {
    // CSV Header (Excel compatibility with BOM)
    const BOM = '\uFEFF';
    let csvContent = BOM + "카테고리,기간(레이블),접속자 수\n";

    // Add all chart data
    Object.entries(chartData).forEach(([period, values]) => {
      const periodName = period === 'daily' ? '일별' : period === 'weekly' ? '주별' : period === 'monthly' ? '월별' : '연별';
      values.forEach((val, idx) => {
        const label = labels[period as keyof typeof labels][idx];
        csvContent += `접속자현황,${periodName}(${label}),${val}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `gourmate_traffic_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

        {/* KPI Cards (Fixed 2x2 Grid) */}
        <div className="grid grid-cols-2 gap-6 max-w-4xl">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 sm:p-6 relative overflow-hidden group hover:border-primary-500/30 transition-all duration-500 aspect-square flex flex-col justify-center items-center text-center">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary-500/10 transition-colors"></div>
              
              <div className="relative z-10 flex flex-col h-full w-full justify-between items-center">
                <div className="flex items-start justify-between w-full mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary-500 group-hover:border-primary-500/30 transition-all">
                    {kpi.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] sm:text-[11px] font-black px-1.5 sm:py-1 rounded-md ${kpi.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 h-3" /> : <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</h3>
                  <div className="text-xl sm:text-3xl font-black text-white tracking-tighter">
                    {kpi.value}
                  </div>
                </div>
                <div className="w-full h-1"></div> {/* Spacer to balance items-center */}
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">접속자 현황</h3>
                  <p className="text-[11px] text-gray-500 font-medium">기간별 접속자 트렌드 (순 방문자 수)</p>
                </div>
                {/* Download Button Mobile Only inside this div for better layout */}
                <button 
                  onClick={handleDownloadData}
                  className="sm:hidden p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                  title="데이터 다운받기"
                >
                  <TrendingUp className="w-4 h-4 rotate-180" />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Chart Period Selector */}
                <div className="flex bg-[#111] border border-white/5 rounded-lg p-1">
                  {(['일별', '주별', '월별', '연별'] as const).map((period, idx) => {
                    const periodKeys: ('daily' | 'weekly' | 'monthly' | 'yearly')[] = ['daily', 'weekly', 'monthly', 'yearly'];
                    const key = periodKeys[idx];
                    return (
                      <button
                        key={key}
                        onClick={() => setChartPeriod(key)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all ${
                          chartPeriod === key ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>

                {/* Download Button Desktop */}
                <button 
                  onClick={handleDownloadData}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest"
                >
                  데이터 다운받기
                </button>
              </div>
            </div>

            {/* Chart Container (Fixed height guaranteed) */}
            <div className="bg-[#111]/30 border border-white/5 rounded-2xl p-6 relative mt-4 min-h-[320px] w-full overflow-hidden">
              {/* Y-axis labels */}
              <div className="absolute left-6 top-8 bottom-12 w-12 flex flex-col justify-between text-[10px] text-gray-600 font-bold text-right pr-3 border-r border-white/5 z-0">
                <span>{formatValue(maxVal)}</span>
                <span>{formatValue(maxVal / 2)}</span>
                <span>0</span>
              </div>

              {/* Bars Area Area */}
              <div className="absolute left-20 right-6 top-8 bottom-12 flex items-end justify-between gap-2 sm:gap-4 z-10">
                {currentData.map((val, idx) => {
                  const heightPercentage = (val / maxVal) * 100;
                  const labels_ko = {
                    daily: ['월', '화', '수', '목', '금', '토', '일'],
                    weekly: ['1주', '2주', '3주', '4주', '5주'],
                    monthly: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    yearly: ['24년', '25년', '26년']
                  };
                  const currentLabels_ko = labels_ko[chartPeriod];

                  return (
                    <div key={idx} className="relative flex flex-col items-center flex-1 h-full justify-end group">
                      {/* Top Value Label */}
                      <div 
                        className="absolute w-full text-center transition-all duration-300 group-hover:scale-110 z-20" 
                        style={{ bottom: `calc(${heightPercentage}% + 4px)` }}
                      >
                        <span className="text-[9px] font-black text-gray-400 group-hover:text-primary-500 whitespace-nowrap">
                          {formatValue(val)}
                        </span>
                      </div>
                      
                      {/* The Bar with Gradient */}
                      <div 
                        className="w-full max-w-[32px] bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all duration-500 ease-out group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] relative"
                        style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                      >
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-white/20 rounded-t-full"></div>
                        
                        {/* Tooltip on Hover */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none shadow-2xl whitespace-nowrap">
                          {val.toLocaleString()} 명
                        </div>
                      </div>

                      {/* X-Axis Label */}
                      <div className="absolute -bottom-7 left-0 right-0 text-center">
                        <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">{currentLabels_ko[idx]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity Feed / Top Performers */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">현재 인기 급상승</h3>
              <button className="text-[10px] font-bold text-primary-500 hover:text-primary-400">전체보기</button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block border-b border-white/5 pb-2">인기 가이드</span>
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
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 block border-b border-white/5 pb-2">인기 테마</span>
                <div className="space-y-3 mt-3">
                  {['2026 서울 미슐랭 투어', '비오는 날 생각나는 전집', '연남동 데이트 코스'].map((theme, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-gray-300 group-hover:text-white transition-colors truncate max-w-[150px]">{theme}</span>
                        <span className="text-[9px] text-gray-600 font-bold">12만 조회수</span>
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
