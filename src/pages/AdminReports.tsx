import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: number;
  reporter: string;
  targetPost: string;
  targetPostId: string;
  reason: string;
  time: string;
  status: 'pending' | 'resolved' | 'rejected';
}

export function AdminReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([
    { id: 1, reporter: '신고왕', targetPost: '몽탄 웨이팅 꿀팁', targetPostId: 'p1', reason: '부적절한 내용', time: '2026.04.30 14:20', status: 'pending' },
    { id: 2, reporter: '맛미새', targetPost: '오레노라멘 리뷰', targetPostId: 'p2', reason: '스팸/홍보', time: '2026.04.30 13:15', status: 'pending' },
    { id: 3, reporter: '클린유저', targetPost: '다운타우너 잠실점', targetPostId: 'p4', reason: '허위 사실', time: '2026.04.30 11:00', status: 'resolved' },
    { id: 4, reporter: '익명A', targetPost: '새들러하우스 성수', targetPostId: 'p5', reason: '부적절한 이미지', time: '2026.04.29 22:30', status: 'pending' },
    { id: 5, reporter: '관리인', targetPost: '누데이크 피크케이크', targetPostId: 'p3', reason: '도배', time: '2026.04.29 18:00', status: 'rejected' },
  ]);

  const handleResolve = (id: number) => {
    if (window.confirm('해당 포스팅을 삭제 처리하고 신고를 종결하시겠습니까?')) {
      setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
      alert('삭제 처리가 완료되었습니다.');
    }
  };

  const handleReject = (id: number) => {
    if (window.confirm('신고를 반려하시겠습니까?')) {
      setReports(reports.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      alert('신고가 반려되었습니다.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">신고 내역 관리</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Report Management</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="신고자, 대상 검색..."
                className="w-full bg-[#111] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            <button className="p-2.5 bg-[#111] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '전체 신고', value: reports.length, color: 'text-white' },
            { label: '미처리', value: reports.filter(r => r.status === 'pending').length, color: 'text-yellow-500' },
            { label: '처리완료', value: reports.filter(r => r.status === 'resolved').length, color: 'text-green-500' },
            { label: '반려', value: reports.filter(r => r.status === 'rejected').length, color: 'text-red-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Reports Table */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[24px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">번호</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">신고자</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">사유</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">대상 포스팅</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">신고 일시</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">상태</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-xs text-gray-600 font-black">#{report.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-300">{report.reporter}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-lg border border-red-500/20">
                        {report.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => navigate(`/post/${report.targetPostId}`)}
                        className="flex items-center gap-2 text-sm font-bold text-white cursor-pointer hover:text-primary-500 transition-colors"
                      >
                        <span className="truncate max-w-[120px]">{report.targetPost}</span>
                        <ExternalLink className="w-3 h-3 text-gray-600" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-gray-600 font-bold">{report.time}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                        report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        report.status === 'resolved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                      }`}>
                        {report.status === 'pending' ? '대기 중' : report.status === 'resolved' ? '처리 완료' : '반려됨'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {report.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleResolve(report.id)}
                              className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                              title="삭제 처리"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(report.id)}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                              title="신고 반려"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-600 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">Showing 5 of {reports.length} reports</span>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 rounded-lg text-gray-600 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
