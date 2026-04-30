import { AdminLayout } from '@/components/AdminLayout';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle,
  Eye,
  ArrowUpRight,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  // 가상 데이터
  const stats = [
    { label: '전체 사용자', value: '1,284', change: '+12%', icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: '전체 포스팅', value: '3,542', change: '+8%', icon: <FileText />, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: '누적 신고 건수', value: '12', change: '-4%', icon: <AlertTriangle />, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: '오늘 신규 가입', value: '28', change: '+15%', icon: <UserPlus />, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const recentReports = [
    { id: 1, type: '부적절한 내용', post: '몽탄 웨이팅 꿀팁', user: '신고왕', time: '10분 전', status: '대기중' },
    { id: 2, type: '스팸/홍보', post: '오레노라멘 리뷰', user: '맛미새', time: '1시간 전', status: '대기중' },
    { id: 3, type: '허위 사실', post: '다운타우너 잠실점', user: '클린유저', time: '3시간 전', status: '처리완료' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-black text-white mb-2">Welcome Back, Admin</h1>
          <p className="text-gray-500 text-sm font-medium">오늘의 GOURMATE 운영 현황을 확인하세요.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports Table */}
          <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/5 rounded-[24px] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                최근 신고 내역
              </h3>
              <Link to="/admin/reports" className="text-[11px] font-bold text-primary-500 hover:underline flex items-center gap-1">
                전체보기 <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">유형</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">대상 포스팅</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">신고자</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">시간</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-bold text-gray-300">{report.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white truncate max-w-[150px] block">{report.post}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">{report.user}</td>
                      <td className="px-6 py-4 text-[11px] text-gray-600 font-bold">{report.time}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          report.status === '대기중' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Summary */}
          <div className="space-y-4">
            <div className="bg-primary-500 rounded-[24px] p-6 shadow-xl shadow-primary-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-black text-lg mb-2">프리미엄 지표</h3>
                <p className="text-white/80 text-xs font-medium mb-4 leading-relaxed">
                  이번 달 가이드 활동량이 지난달 대비 15% 상승했습니다.
                </p>
                <button className="bg-white text-primary-500 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest">
                  리포트 다운로드
                </button>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-[24px] p-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">서비스 알림</h3>
              <div className="space-y-4">
                {[
                  { icon: <MessageCircle className="w-4 h-4" />, text: '새로운 1:1 문의가 5건 접수되었습니다.', time: '30분 전' },
                  { icon: <Eye className="w-4 h-4" />, text: '실시간 접속자 수가 100명을 돌파했습니다.', time: '1시간 전' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="text-primary-500 shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-[12px] text-gray-300 leading-snug">{item.text}</p>
                      <span className="text-[10px] text-gray-600 font-bold">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
