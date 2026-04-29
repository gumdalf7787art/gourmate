import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Star } from 'lucide-react';

interface PlaceMarker {
  id: string;
  postId?: string; // 상세 페이지 이동을 위한 ID
  lat: number;
  lng: number;
  name: string;
  category?: string;
  rating?: number;
}

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  places: PlaceMarker[];
  level?: number;
  onSelect?: (postId: string) => void;
}

export function KakaoMap({ center, places, level = 3, onSelect }: KakaoMapProps) {
  const mapCenter = center || (places.length > 0 
    ? { lat: places[0].lat, lng: places[0].lng } 
    : { lat: 37.5665, lng: 126.9780 });

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <Map
        center={mapCenter}
        style={{ width: '100%', height: '100%' }}
        level={level}
      >
        {places.map((place) => (
          <MapMarker 
            key={place.id} 
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => place.postId && onSelect?.(place.postId)}
          >
            <div 
              className="p-3 bg-black/90 backdrop-blur-md rounded-xl border border-primary-500/30 text-white min-w-[120px] shadow-2xl cursor-pointer active:scale-95 transition-all"
              onClick={(e) => {
                // Ensure the event triggers properly on the card
                if (place.postId) onSelect?.(place.postId);
              }}
            >
              <div className="flex flex-col gap-1 pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-primary-500 text-[12px] truncate">{place.name}</span>
                  {place.rating && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-black">{place.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{place.category}</span>
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <span className="text-[9px] text-primary-500 font-black">자세히 보기</span>
                </div>
              </div>
            </div>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
