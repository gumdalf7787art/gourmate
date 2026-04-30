import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Trash2, Edit2, LayoutGrid } from 'lucide-react';
import { MOCK_COLLECTIONS } from '@/data/mock';

export function MyThemes() {
  const navigate = useNavigate();
  // 사용자의 테마라고 가정하고 전체 또는 일부를 가져옴
  // 여기서는 userId가 'g1'인 것들을 내 테마로 가정하거나 전체를 사용 (Mock)
  const [themes, setThemes] = useState(MOCK_COLLECTIONS.filter(c => c.userId === 'g1'));
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('정말 이 테마를 삭제하시겠습니까?')) {
      setThemes(themes.filter(t => t.id !== id));
      setOpenMenuId(null);
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/my/themes/edit/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/my')} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">나의 테마 관리</h1>
        </div>
        <button 
          onClick={() => navigate('/my/themes/create')}
          className="p-2 -mr-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-black text-white leading-tight">
            나만의 맛집 지도를<br />
            만들어보세요
          </h2>
          <p className="text-sm text-gray-500">내가 기록한 맛집들을 테마별로 묶어 관리할 수 있습니다.</p>
        </div>

        {/* Create Button (Large) */}
        <button
          onClick={() => navigate('/my/themes/create')}
          className="w-full flex flex-col items-center justify-center gap-3 py-10 mb-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-primary-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-primary-500" />
          </div>
          <span className="text-sm font-bold text-gray-400 group-hover:text-primary-500 transition-colors">새로운 테마 생성하기</span>
        </button>

        {/* Theme List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <LayoutGrid className="w-4 h-4 text-primary-500" />
            내 테마 목록 ({themes.length})
          </h3>

          {themes.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              생성된 테마가 없습니다.
            </div>
          ) : (
            themes.map((theme) => (
              <div 
                key={theme.id}
                onClick={() => navigate(`/my/themes/edit/${theme.id}`)}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer relative"
              >
                <div className="relative h-32 w-full">
                  <img src={theme.thumbnail} alt={theme.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Menu Button */}
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === theme.id ? null : theme.id);
                      }}
                      className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === theme.id && (
                      <div className="absolute right-0 top-10 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
                        <button 
                          onClick={(e) => handleEdit(theme.id, e)}
                          className="w-full px-4 py-3 flex items-center gap-2 text-sm text-gray-300 hover:bg-white/5 transition-colors text-left"
                        >
                          <Edit2 className="w-4 h-4" />
                          수정하기
                        </button>
                        <button 
                          onClick={(e) => handleDelete(theme.id, e)}
                          className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left border-t border-white/5"
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h4 className="text-white font-bold text-lg leading-tight truncate">{theme.title}</h4>
                    <p className="text-xs text-gray-300 mt-1 truncate">{theme.description}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-[#0a0a0a] flex items-center justify-between">
                  <div className="flex gap-2">
                    {theme.keywords?.slice(0, 2).map((keyword, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-bold rounded-lg border border-primary-500/20">
                        #{keyword}
                      </span>
                    ))}
                    {theme.keywords && theme.keywords.length > 2 && (
                      <span className="px-2 py-1 bg-white/5 text-gray-400 text-[10px] font-bold rounded-lg border border-white/10">
                        +{theme.keywords.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-gray-500">
                    포함된 식당 <span className="text-white">{theme.places.length}</span>곳
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Overlay to close menu */}
      {openMenuId && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setOpenMenuId(null)} 
        />
      )}
    </div>
  );
}
