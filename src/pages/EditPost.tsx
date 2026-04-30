import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, MapPin, Tag, Image as ImageIcon, 
  Video, X, Plus, Type, Minus, Utensils, Lightbulb, Star, Hash 
} from 'lucide-react';
import { KakaoMap } from '@/components/KakaoMap';
import { MOCK_POSTS } from '@/data/mock';

export function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState('음식점');
  const [mediaFiles, setMediaFiles] = useState<{ file?: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [representativeIndex, setRepresentativeIndex] = useState<number | null>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [menuItems, setMenuItems] = useState<{ name: string; price: string; isSignature?: boolean }[]>([]);

  useEffect(() => {
    const foundPost = MOCK_POSTS.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setContent(foundPost.content);
      setRating(foundPost.rating || 0);
      setSelectedTag(foundPost.place.category || '음식점');
      setTags(foundPost.tags || []);
      setMenuItems(foundPost.menuItems || []);
      if (foundPost.images) {
        setMediaFiles(foundPost.images.map(img => ({ preview: img, type: 'image' })));
      }
    } else {
      alert('포스트를 찾을 수 없습니다.');
      navigate(-1);
    }
  }, [id, navigate]);

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
      if (newMedia[index].file) {
        URL.revokeObjectURL(newMedia[index].preview);
      }
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const CUSTOM_TAGS = ['한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비', '기타'];

  if (!post) {
    return <div className="flex flex-col min-h-screen bg-black items-center justify-center text-white p-5">로딩 중...</div>;
  }

  const place = post.place;

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('포스팅 수정이 완료되었습니다!');
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">포스팅 수정</h1>
      </header>

      <main className="flex-1">
        {/* Map View */}
        <section className="h-[240px] w-full relative bg-[#111]">
          {place && (
            <KakaoMap 
              key={place.id}
              places={[{
                id: place.id,
                lat: Number(place.latitude),
                lng: Number(place.longitude),
                name: place.name
              }]} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        </section>

        {/* Place Info */}
        <section className="px-5 -mt-8 relative z-10">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-black text-white leading-tight mb-1">{place.name}</h2>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  <span>{place.address}</span>
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

          {/* Keywords (Tags) Input */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-bold text-white">이 식당의 특이점(키워드)은 무엇인가요?</h3>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">#</span>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      if (!tags.includes(tagInput.trim())) {
                        setTags([...tags, tagInput.trim()]);
                      }
                      setTagInput('');
                    }
                  }}
                  placeholder="예: 인생라멘, 데이트성지, 웨이팅필수"
                  className="w-full pl-7 pr-4 py-3 bg-[#141414] border border-white/30 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <button
                onClick={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="px-4 py-3 bg-white/5 border border-white/30 rounded-xl text-white hover:bg-primary-500 hover:border-primary-500 transition-all"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-lg text-primary-500 text-xs font-bold">
                  <span>#{tag}</span>
                  <button onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="ml-1 hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items Input */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary-500" />
                <h3 className="text-sm font-bold text-white tracking-tight">가이드 추천 메뉴</h3>
              </div>
              <button 
                onClick={() => setMenuItems([...menuItems, { name: '', price: '', isSignature: false }])}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-gray-300 hover:text-white transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-primary-500" /> 메뉴 추가
              </button>
            </div>
            
            <div className="space-y-3">
              {menuItems.map((item, idx) => (
                <div key={idx} className="bg-[#111] border border-white/30 rounded-2xl p-4 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newMenu = [...menuItems];
                        newMenu[idx].name = e.target.value;
                        setMenuItems(newMenu);
                      }}
                      placeholder="메뉴 이름 (예: 우대갈비)"
                      className="flex-1 bg-black/40 border border-white/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                    <button 
                      onClick={() => setMenuItems(menuItems.filter((_, i) => i !== idx))}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => {
                          const newMenu = [...menuItems];
                          newMenu[idx].price = e.target.value;
                          setMenuItems(newMenu);
                        }}
                        placeholder="가격 (예: 32,000원)"
                        className="w-full bg-black/40 border border-white/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const newMenu = [...menuItems];
                        newMenu[idx].isSignature = !newMenu[idx].isSignature;
                        setMenuItems(newMenu);
                      }}
                      className={`px-4 py-3 rounded-xl text-[11px] font-black transition-all border shrink-0 ${
                        item.isSignature 
                          ? 'bg-primary-500 border-primary-500 text-white shadow-[0_5px_15px_rgba(249,115,22,0.3)]' 
                          : 'bg-white/5 border-white/10 text-gray-500'
                      }`}
                    >
                      시그니처
                    </button>
                  </div>
                </div>
              ))}
              
              {menuItems.length === 0 && (
                <div 
                  onClick={() => setMenuItems([{ name: '', price: '', isSignature: false }])}
                  className="py-12 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Utensils className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-bold">가이드님이 추천하는 메뉴를</p>
                    <p className="text-xs text-primary-500 font-black mt-0.5">이곳을 눌러 등록해 보세요!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating Input */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">평점을 매겨주세요</h3>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                <span className="text-primary-500 font-black text-2xl tracking-tighter">{rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="relative px-1 pt-2 pb-6">
              <div className="flex gap-1.5 mb-6 justify-between">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="relative w-12 h-12 flex-1 max-w-[56px]">
                    <Star className="w-full h-full text-gray-800" strokeWidth={1} />
                    <div 
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${Math.max(0, Math.min(100, (rating - (star - 1)) * 100))}%` }}
                    >
                      <Star className="w-full h-full fill-primary-500 text-primary-500" strokeWidth={1} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative h-2 group">
                <input 
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="absolute -top-14 inset-0 w-full h-20 opacity-0 cursor-pointer z-20"
                />
                
                <div className="w-full h-1.5 bg-white/5 rounded-full relative overflow-hidden border border-white/5">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-600 to-primary-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-3 px-1">
                  {[0, 1, 2, 3, 4, 5].map(v => (
                    <span key={v} className="text-[10px] font-black text-gray-700">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Review Input */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">가이드님의 한줄 평을 남겨주세요</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="예: 웨이팅이 길지만 그럴 가치가 충분합니다..."
              className="w-full h-24 bg-[#141414] border border-white/30 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all"
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
              className="w-full h-80 bg-[#141414] border border-white/30 rounded-2xl p-5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all leading-relaxed text-[16px] shadow-inner"
            ></textarea>
          </div>

          {/* Media Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">사진 및 동영상 첨부</h3>
              <span className="text-xs text-gray-500">{mediaFiles.length}개 선택됨</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-32 h-32 bg-[#141414] border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all snap-start"
              >
                <div className="p-2 bg-white/5 rounded-full">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-500">추가하기</span>
              </button>

              {mediaFiles.map((media, index) => (
                <div 
                  key={index} 
                  onClick={() => setRepresentativeIndex(index)}
                  className={`flex-shrink-0 w-32 h-32 relative rounded-2xl overflow-hidden snap-start group border-2 transition-all cursor-pointer ${
                    representativeIndex === index ? 'border-primary-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'border-white/30'
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
                  
                  {representativeIndex === index && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-[10px] font-black rounded-md shadow-lg z-10">
                      대표사진
                    </div>
                  )}

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

          {/* Submit Button at the end of the flow */}
          <div className="pt-10 pb-20 flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-5 bg-[#141414] text-white font-bold text-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-primary-500 text-white font-black text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>수정 완료</span>
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
