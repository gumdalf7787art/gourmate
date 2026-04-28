import { Map, MapMarker } from 'react-kakao-maps-sdk';

interface KakaoMapProps {
  lat: number;
  lng: number;
  name: string;
}

export function KakaoMap({ lat, lng, name }: KakaoMapProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <Map
        center={{ lat, lng }}
        style={{ width: '100%', height: '100%' }}
        level={3}
      >
        <MapMarker position={{ lat, lng }}>
          <div className="p-2 bg-black/80 backdrop-blur-md rounded-lg border border-primary-500/50 text-white text-[10px] whitespace-nowrap min-w-[60px] text-center">
            <span className="font-bold text-primary-500">{name}</span>
          </div>
        </MapMarker>
      </Map>
    </div>
  );
}
