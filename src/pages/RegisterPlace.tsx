import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, MapPin, Tag, Image as ImageIcon, 
  Video, X, Plus, Type, Minus, Utensils, Lightbulb, Star 
} from 'lucide-react';
import { KakaoMap } from '@/components/KakaoMap';

export function RegisterPlace() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const place = location.state?.place;

  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState(place?.category_group_name || '음식점');
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [representativeIndex, setRepresentativeIndex] = useState<number | null>(null);

  // 텍스트 삽입 유틸리티 (커서 위치에 삽입)
  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    
    const newText = 
      currentText.substring(0, start) + 
      before + 
      currentText.substring(start, end) + 
      after + 
      currentText.substring(end);
    
    setContent(newText);
    
    // 포커스 유지 및 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 이미지 리사이징 유틸리티
  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const processedFiles = await Promise.all(
      newFiles.map(async (file) => {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        let finalFile = file;
        
        if (type === 'image') {
          finalFile = await resizeImage(file);
        }

        return {
          file: finalFile,
          preview: URL.createObjectURL(finalFile),
          type: type as 'image' | 'video'
        };
      })
    );

    setMediaFiles((prev) => [...prev, ...processedFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

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
    
    // 등록 데이터 요약 (디버깅용)
    console.log('등록 시도 데이터:', {
      place_name: place.place_name,
      tag: selectedTag,
      rating: rating,
      short_review: review,
      detailed_content: content,
      media_count: mediaFiles.length,
      representative_media: representativeIndex !== null ? mediaFiles[representativeIndex].file.name : '없음',
      media_info: mediaFiles.map((m, i) => ({ 
        name: m.file.name, 
        size: m.file.size, 
        type: m.type,
        is_representative: i === representativeIndex 
      }))
    });

    // 실제로는 여기에 서버 API 호출 로직이 들어갑니다.
    setTimeout(() => {
      setIsLoading(false);
      alert('맛집 등록이 완료되었습니다!\n상세 글과 미디어가 성공적으로 업로드되었습니다.');
      navigate('/');
    }, 1500);
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

          {/* Rating Input */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">평점을 매겨주세요</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-all active:scale-90"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      rating >= star ? 'fill-primary-500 text-primary-500' : 'text-gray-700'
                    }`} 
                    strokeWidth={1.5}
                  />
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
              className="w-full h-24 bg-[#141414] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all"
            ></textarea>
          </div>

          {/* Detailed Content Input */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">상세한 후기를 들려주세요</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => insertText('\n### ', '')}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-primary-500 hover:border-primary-500/50 transition-all"
                  title="소제목"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => insertText('\n---\n', '')}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-primary-500 hover:border-primary-500/50 transition-all"
                  title="구분선"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => insertText('\n📍 추천 메뉴: ', '')}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-primary-500 hover:border-primary-500/50 transition-all"
                  title="추천 메뉴"
                >
                  <Utensils className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => insertText('\n💡 꿀팁: ', '')}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-primary-500 hover:border-primary-500/50 transition-all"
                  title="꿀팁"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이곳의 분위기, 추천 메뉴, 꿀팁 등 자세한 이야기를 들려주세요..."
              className="w-full h-80 bg-[#141414] border border-white/10 rounded-2xl p-5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all leading-relaxed text-[16px] shadow-inner"
            ></textarea>
          </div>

          {/* Media Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">사진 및 동영상 첨부</h3>
              <span className="text-xs text-gray-500">{mediaFiles.length}개 선택됨</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-32 h-32 bg-[#141414] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all snap-start"
              >
                <div className="p-2 bg-white/5 rounded-full">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-500">추가하기</span>
              </button>

              {/* Media Previews */}
              {mediaFiles.map((media, index) => (
                <div 
                  key={index} 
                  onClick={() => setRepresentativeIndex(index)}
                  className={`flex-shrink-0 w-32 h-32 relative rounded-2xl overflow-hidden snap-start group border-2 transition-all cursor-pointer ${
                    representativeIndex === index ? 'border-primary-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'border-white/10'
                  }`}
                >
                  {media.type === 'image' ? (
                    <img src={media.preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full relative">
                      <video src={media.preview} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                  )}
                  
                  {/* Representative Badge */}
                  {representativeIndex === index && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-[8px] font-black rounded-md shadow-lg uppercase tracking-tighter z-10">
                      Representative
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMedia(index);
                      if (representativeIndex === index) setRepresentativeIndex(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg border border-white/10 z-20"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Media Type Icon */}
                  <div className="absolute bottom-1.5 right-1.5 p-1 bg-black/40 backdrop-blur-md rounded-md z-10">
                    {media.type === 'image' ? (
                      <ImageIcon className="w-3 h-3 text-white/80" />
                    ) : (
                      <Video className="w-3 h-3 text-white/80" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <p className="mt-3 text-[11px] text-gray-500 leading-relaxed px-1">
              * 사진은 자동으로 최적화되어 업로드됩니다.<br/>
              * 여러 장의 사진과 동영상을 선택하여 가로로 넘겨볼 수 있습니다.
            </p>
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
