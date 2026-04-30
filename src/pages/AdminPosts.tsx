import { AdminLayout } from '@/components/AdminLayout';
import { Search, FileText, Map, Filter, MoreVertical, ExternalLink, Star } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';
import { useNavigate } from 'react-router-dom';

export function AdminPosts() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1">CONTENT MANAGEMENT</h1>
            <p className="text-gray-500 text-sm font-medium">플랫폼 내 모든 포스팅과 테마를 통합 관리합니다.</p>
          </div>
          <div className="flex bg-[#111] border border-white/5 rounded-xl p-1">
            <button className="px-6 py-2 bg-primary-500 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md">
              포스팅 (28.5K)
            </button>
            <button className="px-6 py-2 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest rounded-lg transition-colors">
              테마 (3.8K)
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="가이드명, 식당명, 태그 검색..."
                className="w-full bg-[#111] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            <button className="px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-[11px] font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5" /> 최신순
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-[#111]/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-16">포스터</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">장소 및 내용</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">작성자</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">반응</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_POSTS.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                        <img src={post.images[0]} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-[300px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white truncate">{post.place.name}</span>
                          <span className="px-1.5 py-0.5 bg-primary-500/10 text-primary-500 text-[9px] font-black rounded uppercase tracking-tighter shrink-0">{post.place.category}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1 italic">"{post.content}"</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={post.guide.profileImageUrl} className="w-6 h-6 rounded-full border border-white/10" />
                        <span className="text-xs font-bold text-gray-300">{post.guide.nickname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> {post.rating}</span>
                        <span>♥ {post.likes}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/post/${post.id}`)}
                          className="p-2 bg-[#111] border border-white/5 text-gray-400 hover:text-primary-500 rounded-lg transition-colors" title="원문 보기"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
        </div>
      </div>
    </AdminLayout>
  );
}
