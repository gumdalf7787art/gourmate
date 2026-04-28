import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Tag } from 'lucide-react';
import { KakaoMap } from '@/components/KakaoMap';

export function RegisterPlace() {
  const navigate = useNavigate();
  const location = useLocation();
  const place = location.state?.place;

  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState('');
  const [selectedTag, setSelectedTag] = useState(place?.category_group_name || '음식점');

  const CUSTOM_TAGS = ['한식', '일식', '중식', '양식', '카페', '파인다이닝', '기타'];

  if (!place) {
    return (
      <div className="flex flex-col min-h-screen bg-black items-center justify-center text-white p-5">
        <p className="mb-4">등록할 장소 정보가 없습니다.</p>
        <button onClick={() => navigate('/search')} className="px-6 py-3 bg-primary-500 rounded-xl font-bold">
          식당 검색하기
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    setIsLoading(true);
    // 실제로는 여기에 서버 API 호출 로직이 들어갑니다.
    setTimeout(() => {
      setIsLoading(false);
      alert('맛집 등록이 완료되었습니다!');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">맛집 등록</h1>
      </header>

      <main className="flex-1">
        {/* Map View */}
        <section className="h-[240px] w-full relative bg-[#111]">
          <KakaoMap lat={parseFloat(place.y)} lng={parseFloat(place.x)} name={place.place_name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        </section>

        {/* Place Info */}
        <section className="px-5 -mt-8 relative z-10">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-black text-white leading-tight mb-1">{place.place_name}</h2>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  <span>{place.road_address_name || place.address_name}</span>
                </div>
              </div>
            </div>
            {place.phone && (
              <div className="text-sm text-gray-500 font-medium">
                📞 {place.phone}
              </div>
            )}
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/5 my-8"></div>

        {/* Form Inputs */}
        <section className="px-5 space-y-8">
          {/* Category Tags */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-bold text-white">어떤 카테고리인가요?</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedTag === tag 
                      ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] border border-primary-500' 
                      : 'bg-[#141414] text-gray-400 border border-white/5 hover:border-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Input */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">가이드님의 한줄 평을 남겨주세요</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="예: 웨이팅이 길지만 그럴 가치가 충분합니다..."
              className="w-full h-32 bg-[#141414] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all"
            ></textarea>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-primary-500 text-white font-black text-lg py-4 rounded-2xl shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>맛집 등록하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
