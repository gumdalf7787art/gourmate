import { AdminLayout } from '@/components/AdminLayout';
import { Search, UserCheck, UserMinus, Shield, Filter, Calendar, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { useState } from 'react';

export function AdminUsers() {
  const [period, setPeriod] = useState('all'); // all, week, month, year

  // 가이드 데이터를 Mock Posts에서 추출 (중복 제거 및 가상 데이터 추가)
  const uniqueGuides = Array.from(new Set(MOCK_POSTS.map(p => p.guide.id)))
    .map(id => {
      const guide = MOCK_POSTS.find(p => p.guide.id === id)!.guide;
      return {
        ...guide,
        joinDate: '2026-01-15',
        postCount: MOCK_POSTS.filter(p => p.guide.id === id).length,
        themeCount: Math.floor(Math.random() * 5) + 1,
        status: 'Active'
      };
    });

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1">USER MANAGEMENT</h1>
            <p className="text-gray-500 text-sm font-medium">전체 회원 목록 조회 및 가이드 등급/권한을 관리합니다.</p>
          </div>
          <div className="flex items-center gap-2">
             <button className="px-4 py-2 bg-primary-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by nickname, email..."
                className="w-full bg-[#111] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            <button className="p-2 bg-[#111] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/30 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mr-2 whitespace-nowrap">가입 기간</span>
            {(['all', 'week', 'month', 'year']).map((p) => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  period === p ? 'bg-white text-black' : 'bg-[#111] border border-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                {p === 'all' ? '전체' : p === 'week' ? '최근 1주' : p === 'month' ? '최근 1달' : '올해'}
              </button>
            ))}
            <button className="p-1.5 bg-[#111] border border-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-[#111]/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">사용자 정보</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">가입일</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">작성 콘텐츠</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-48">신뢰 지수</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">상태</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {uniqueGuides.map((guide, idx) => (
                  <tr key={guide.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={guide.profileImageUrl} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                          {guide.trustScore >= 90 && (
                            <div className="absolute -bottom-1 -right-1 bg-[#0a0a0a] rounded-full p-0.5">
                              <Shield className="w-3.5 h-3.5 text-primary-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary-500 transition-colors">{guide.nickname}</p>
                          <p className="text-[10px] text-gray-500 font-medium">user_{guide.id.substring(0,6)}@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-400">{guide.joinDate}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-white">{guide.postCount} <span className="text-[9px] text-gray-600 font-medium ml-0.5">Posts</span></span>
                        <span className="text-xs font-black text-white">{guide.themeCount} <span className="text-[9px] text-gray-600 font-medium ml-0.5">Themes</span></span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-primary-500 w-6 text-right">{guide.trustScore}</span>
                        <div className="flex-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${guide.trustScore >= 90 ? 'bg-primary-500' : guide.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${guide.trustScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-500 text-[9px] font-black rounded-md border border-green-500/20 uppercase tracking-widest">
                        {guide.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-[#111] border border-white/5 text-gray-400 hover:text-primary-500 rounded-lg transition-colors" title="공식 가이드 권한 부여">
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2 bg-[#111] border border-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="활동 정지">
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
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
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#111]/30">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Showing {uniqueGuides.length} of 12,482 Users</span>
            <div className="flex gap-1.5">
              <button className="p-2 bg-[#111] border border-white/5 rounded-lg text-gray-600 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
