import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, Building2 } from 'lucide-react';

export function SearchPlace() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'IDLE' | 'OK' | 'ZERO_RESULT' | 'ERROR'>('IDLE');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 카카오 장소 검색 API 호출
  const searchPlaces = (query: string) => {
    if (!query.trim()) {
      setPlaces([]);
      setSearchStatus('IDLE');
      return;
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('Kakao map API is not loaded');
      return;
    }

    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(query, (data: any[], status: any) => {
      setIsSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        setSearchStatus('OK');
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setPlaces([]);
        setSearchStatus('ZERO_RESULT');
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        setPlaces([]);
        setSearchStatus('ERROR');
      }
    });
  };

  // 디바운스를 적용하여 검색 (사용자가 타이핑을 멈추면 0.5초 뒤 검색)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      searchPlaces(keyword);
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [keyword]);

  const handlePlaceSelect = (place: any) => {
    // 선택한 장소 데이터를 가지고 등록 폼으로 이동
    navigate('/register-place', { state: { place } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 bg-[#141414] border border-white/10 rounded-xl leading-5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium"
            placeholder="등록할 맛집(상호명)을 검색하세요"
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 py-6">
        {searchStatus === 'IDLE' && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 pt-20">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">등록을 원하는 식당 이름을 검색해보세요.</p>
          </div>
        )}

        {isSearching && searchStatus === 'OK' && (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {searchStatus === 'OK' && !isSearching && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">검색 결과</h3>
            {places.map((place) => (
              <button
                key={place.id}
                onClick={() => handlePlaceSelect(place)}
                className="w-full text-left bg-[#0c0c0c] border border-white/5 rounded-2xl p-4 hover:border-primary-500/50 hover:bg-[#111] transition-all group flex gap-4 items-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/10 transition-colors border border-white/5 group-hover:border-primary-500/30">
                  <Building2 className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-white truncate">{place.place_name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-300 whitespace-nowrap">
                      {place.category_group_name || '음식점'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{place.road_address_name || place.address_name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {searchStatus === 'ZERO_RESULT' && !isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-white font-bold mb-2">검색 결과가 없습니다</h3>
            <p className="text-sm text-gray-500 mb-6">검색어가 정확한지 다시 한번 확인해주세요.</p>
          </div>
        )}

        {searchStatus === 'ERROR' && !isSearching && (
          <div className="text-center py-10 text-red-400">
            검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </div>
        )}
      </main>
    </div>
  );
}
