import { Map, MapMarker } from 'react-kakao-maps-sdk';

interface PlaceMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  places: PlaceMarker[];
  level?: number;
}

export function KakaoMap({ center, places, level = 3 }: KakaoMapProps) {
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
          <MapMarker key={place.id} position={{ lat: place.lat, lng: place.lng }}>
            <div className="px-2 py-1 bg-black/80 backdrop-blur-md rounded-md border border-primary-500/50 text-white text-[10px] whitespace-nowrap text-center shadow-lg">
              <span className="font-bold text-primary-500">{place.name}</span>
            </div>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
