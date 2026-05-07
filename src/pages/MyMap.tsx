import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Map as MapIcon, 
  Plus, 
  MoreVertical, 
  Trash2, 
  ChevronRight,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { postService } from '@/services/postService';
import { KakaoMap } from '@/components/KakaoMap';

export function MyMap() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [maps, setMaps] = useState<any[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [mapItems, setMapItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMaps();
  }, [user]);

  const fetchMaps = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await postService.getUserMaps(user.id);
      if (res.success) {
        setMaps(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch maps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMapItems = async (mapId: string) => {
    if (!user) return;
    try {
      const res = await postService.getMapItems(user.id, mapId);
      if (res.success) {
        setMapItems(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch map items:', err);
    }
  };

  const handleSelectMap = (mapId: string) => {
    setSelectedMapId(mapId);
    fetchMapItems(mapId);
    setShowMap(true);
  };

  const handleCreateMap = async () => {
    if (!newMapName.trim() || !user) return;
    try {
      const res = await postService.createUserMap(user.id, newMapName.trim());
      if (res.success) {
        setNewMapName('');
        setShowCreateModal(false);
        fetchMaps();
      }
    } catch (err) {
      console.error('Failed to create map:', err);
    }
  };

  const handleDeleteMap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('이 지도 폴더를 삭제하시겠습니까? 내부의 맛집 목록도 함께 삭제됩니다.')) {
      try {
        const res = await postService.deleteUserMap(id);
        if (res.success) {
          setMaps(maps.filter(m => m.id !== id));
          setOpenMenuId(null);
        }
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/my')} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">나의 맛집 지도</h1>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="p-2 -mr-2 text-primary-500 hover:bg-primary-500/10 rounded-full transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white leading-tight mb-2">
            나만의 맛집<br />
            분류하여 관리하기
          </h2>
          <p className="text-sm text-gray-500">맛집을 폴더별로 나누고 지도에서 확인해보세요.</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-bold">지도를 불러오는 중...</p>
          </div>
        ) : maps.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <MapIcon className="w-8 h-8 text-gray-700" />
            </div>
            <p className="text-gray-500 font-medium mb-8">아직 생성된 지도 폴더가 없습니다.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-primary-500 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              첫 번째 지도 폴더 만들기
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {maps.map((map) => (
              <div 
                key={map.id}
                onClick={() => handleSelectMap(map.id)}
                className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group hover:border-primary-500/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapIcon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold group-hover:text-primary-500 transition-colors">{map.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">{map.post_count}개의 장소 저장됨</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === map.id ? null : map.id);
                    }}
                    className="p-2 text-gray-600 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenuId === map.id && (
                    <div className="absolute right-12 mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
                      <button 
                        onClick={(e) => handleDeleteMap(map.id, e)}
                        className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제하기
                      </button>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">새 지도 폴더 만들기</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <input 
                type="text" 
                autoFocus
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                placeholder="예: 일식 맛집 투어, 분위기 좋은 곳"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary-500 transition-all mb-4"
              />
              <button 
                onClick={handleCreateMap}
                disabled={!newMapName.trim()}
                className="w-full py-4 bg-primary-500 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 active:scale-95 transition-all"
              >
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[300] bg-black">
          <header className="absolute top-0 left-0 right-0 z-10 p-5 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <button 
              onClick={() => setShowMap(false)}
              className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white shadow-lg border border-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-sm font-bold text-white">
                {maps.find(m => m.id === selectedMapId)?.name} ({mapItems.length})
              </span>
            </div>
            <div className="w-12" />
          </header>

          <div className="w-full h-full">
            <KakaoMap 
              places={mapItems.map(item => ({
                id: item.id,
                postId: item.id,
                name: item.place.name,
                category: item.place.category,
                lat: Number(item.place.latitude),
                lng: Number(item.place.longitude)
              }))}
              onSelect={(postId) => navigate(`/post/${postId}`)}
            />
          </div>

          {/* Place Cards Slider at Bottom */}
          <div className="absolute bottom-8 left-0 right-0 px-5 flex gap-3 overflow-x-auto no-scrollbar pb-4">
            {mapItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/post/${item.id}`)}
                className="min-w-[280px] bg-[#111] border border-white/20 rounded-2xl overflow-hidden flex gap-3 p-3 shadow-2xl active:scale-[0.98] transition-transform"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-0.5">{item.place.category}</span>
                  <h4 className="text-sm font-bold text-white truncate">{item.place.name}</h4>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.place.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
