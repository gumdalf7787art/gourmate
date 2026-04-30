import { AdminLayout } from '@/components/AdminLayout';
import { Search, UserCheck, UserMinus, Shield } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

export function AdminUsers() {
  // 가이드 데이터를 Mock Posts에서 추출 (중복 제거)
  const uniqueGuides = Array.from(new Set(MOCK_POSTS.map(p => p.guide.id)))
    .map(id => MOCK_POSTS.find(p => p.guide.id === id)!.guide);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">사용자 및 가이드 관리</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="가이드 닉네임, 이메일 검색..."
            className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">가이드</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">신뢰 지수</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">상태</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {uniqueGuides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={guide.profileImageUrl} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                        <div>
                          <p className="text-sm font-bold text-white">{guide.nickname}</p>
                          <p className="text-[10px] text-gray-500">ID: {guide.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500" style={{ width: `${guide.trustScore}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-primary-500">{guide.trustScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20 uppercase tracking-tight">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary-500 transition-colors" title="공식 가이드 부여">
                        <Shield className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-500 transition-colors" title="활동 정지">
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// AdminPosts Component in the same file or different, here same for brevity in one tool call
export function AdminPosts() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">전체 포스팅 모니터링</h1>
        </div>
        <div className="py-20 text-center bg-[#0f0f0f] border border-white/5 rounded-[32px]">
          <FileText className="w-12 h-12 text-white/5 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">전체 포스팅 관리 기능 준비 중입니다.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
