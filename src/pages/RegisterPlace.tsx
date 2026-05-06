import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, MapPin, Tag, Image as ImageIcon, 
  Video, X, Plus, Type, Minus, Utensils, Star, Hash 
} from 'lucide-react';
import { KakaoMap } from '@/components/KakaoMap';
import { uploadService } from '@/services/uploadService';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/store/useAuthStore';

export function RegisterPlace() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const place = location.state?.place;

  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState(place?.category_group_name || '음식점');
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [representativeIndex, setRepresentativeIndex] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [menuItems, setMenuItems] = useState<{ name: string; price: string; isSignature: boolean }[]>([]);
  const [isPaid, setIsPaid] = useState(false);

  // 스토리 에디터 관련 상태
  const [editorMode, setEditorMode] = useState<'simple' | 'story'>('simple');
  type StoryBlock = {
    id: string;
    type: 'text' | 'image';
    value: string;
    file?: File;
  };
  const [storyBlocks, setStoryBlocks] = useState<StoryBlock[]>([
    { id: Math.random().toString(36).substr(2, 9), type: 'text', value: '' }
  ]);

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

  const processFiles = async (files: File[]) => {
    const processedFiles = await Promise.all(
      files.map(async (file) => {
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
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    await processFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const newMedia = [...prev];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  // 스토리 블록 관리 함수
  const addStoryBlock = (type: 'text' | 'image', index?: number) => {
    const newBlock: StoryBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: ''
    };
    
    setStoryBlocks(prev => {
      const newBlocks = [...prev];
      if (typeof index === 'number') {
        newBlocks.splice(index + 1, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return newBlocks;
    });
  };

  const updateStoryBlock = (id: string, value: string, file?: File) => {
    setStoryBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, value, file } : block
    ));
  };

  const removeStoryBlock = (id: string) => {
    if (storyBlocks.length <= 1) return; // 최소 하나는 유지
    setStoryBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleStoryDrop = async (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await handleStoryImageUpload(blockId, file);
    }
  };

  const handleStoryImageUpload = async (id: string, file: File) => {
    const resized = await resizeImage(file);
    const preview = URL.createObjectURL(resized);
    updateStoryBlock(id, preview, resized);
  };

  const CUSTOM_TAGS = ['한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비', '배달맛집', '기타'];

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

  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. 이미지 업로드 (간편 모드용)
      const imageUrls: string[] = [];
      if (editorMode === 'simple') {
        for (const media of mediaFiles) {
          const res = await uploadService.uploadImage(media.file);
          if (res.success) {
            imageUrls.push(res.url);
          }
        }
      }

      // 2. 스토리 블록 이미지 URL 업데이트 (스토리 모드용)
      const finalStoryBlocks = editorMode === 'story' 
        ? await Promise.all(storyBlocks.map(async (block) => {
            if (block.type === 'image' && block.file) {
              const res = await uploadService.uploadImage(block.file);
              if (res.success) {
                return { ...block, value: res.url };
              }
            }
            return block;
          }))
        : [];

      // 3. 포스트 데이터 생성
      const postData = {
        guide_id: user.id,
        restaurant_name: place.place_name,
        address: place.road_address_name || place.address_name,
        category: selectedTag,
        content: editorMode === 'simple' 
          ? content 
          : finalStoryBlocks.map(b => b.type === 'text' ? b.value : `[이미지]`).join('\n'),
        review: review,
        rating: rating,
        images: editorMode === 'simple' ? imageUrls : finalStoryBlocks.filter(b => b.type === 'image').map(b => b.value),
        tags: tags,
        editor_mode: editorMode,
        story_blocks: finalStoryBlocks,
        menu_items: menuItems,
        latitude: place.y,
        longitude: place.x,
        phone: place.phone || '',
        is_paid: isPaid
      };

      // 4. API 호출
      await postService.createPost(postData as any);

      setIsLoading(false);
      alert('맛집 등록이 완료되었습니다!\n상세 글과 미디어가 성공적으로 업로드되었습니다.');
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setIsLoading(false);
      alert('등록 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
    }
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
          <KakaoMap 
            places={[{
              id: place.id,
              lat: parseFloat(place.y),
              lng: parseFloat(place.x),
              name: place.place_name
            }]} 
          />
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
              {/* Star Display behind the slider */}
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

              {/* Range Input Overlay */}
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
                
                {/* Visual Track */}
                <div className="w-full h-1.5 bg-white/5 rounded-full relative overflow-hidden border border-white/5">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-600 to-primary-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  ></div>
                </div>
                
                {/* Indicator Dots */}
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

          {/* 내돈내산 Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setIsPaid(!isPaid)}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                isPaid 
                  ? 'bg-primary-500/10 border-primary-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
                  : 'bg-[#111] border-white/30 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isPaid ? 'bg-primary-500 text-white rotate-[360deg]' : 'bg-white/5 text-gray-700'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-black tracking-tight ${isPaid ? 'text-white' : 'text-gray-500'}`}>
                    내돈내산 리뷰인가요?
                  </p>
                  <p className="text-[10px] font-medium opacity-60">직접 결제하고 이용한 솔직한 후기임을 인증합니다.</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${isPaid ? 'bg-primary-500' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${isPaid ? 'left-7 shadow-lg' : 'left-1'}`} />
              </div>
            </button>
          </div>

          {/* Editor Mode Tabs */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-6 p-1 bg-[#111] rounded-2xl border border-white/5">
              <button
                onClick={() => setEditorMode('simple')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  editorMode === 'simple'
                    ? 'bg-white/10 text-white shadow-xl'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                간편 작성
              </button>
              <button
                onClick={() => setEditorMode('story')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  editorMode === 'story'
                    ? 'bg-white/10 text-white shadow-xl'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                스토리 작성 (블로그형)
              </button>
            </div>

            {editorMode === 'simple' ? (
              <div className="space-y-8">
                {/* Simple Mode Editor */}
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

                {/* Media Upload Section (Simple Mode) */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">사진 및 동영상 첨부</h3>
                    <span className="text-xs text-gray-500">{mediaFiles.length}개 선택됨</span>
                  </div>
                  
                  <div 
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar transition-all duration-300 rounded-2xl ${
                      isDragging ? 'bg-primary-500/10 ring-2 ring-primary-500 ring-dashed p-4' : ''
                    }`}
                  >
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-shrink-0 w-32 h-32 bg-[#141414] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all snap-start ${
                        isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-white/30'
                      }`}
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
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-10">
                {/* Story Mode Editor */}
                {storyBlocks.map((block, index) => (
                  <div key={block.id} className="relative group">
                    {block.type === 'text' ? (
                      <div className="relative">
                        <textarea
                          value={block.value}
                          onChange={(e) => updateStoryBlock(block.id, e.target.value)}
                          placeholder="이곳에 글을 작성하세요..."
                          className="w-full bg-transparent border-none p-0 text-white text-[16px] leading-relaxed focus:ring-0 resize-none min-h-[40px] placeholder-gray-700"
                          style={{ height: 'auto' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                        {storyBlocks.length > 1 && (
                          <button 
                            onClick={() => removeStoryBlock(block.id)}
                            className="absolute -right-2 -top-2 p-1.5 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div 
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleStoryDrop(e, block.id)}
                        onClick={() => {
                          if (!block.value) {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleStoryImageUpload(block.id, file);
                            };
                            input.click();
                          }
                        }}
                        className={`relative rounded-2xl overflow-hidden border transition-all duration-300 bg-[#111] aspect-video flex items-center justify-center cursor-pointer ${
                          isDragging ? 'border-primary-500 bg-primary-500/10 ring-2 ring-primary-500/50 ring-offset-0' : 'border-dashed border-white/20 hover:border-primary-500/50 hover:bg-primary-500/5'
                        }`}
                      >
                        {block.value ? (
                          <img src={block.value} className="w-full h-full object-cover" alt="story" />
                        ) : (
                          <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
                            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-primary-500/20' : 'bg-white/5'}`}>
                              <ImageIcon className={`w-10 h-10 transition-colors ${isDragging ? 'text-primary-500' : 'text-gray-500'}`} />
                            </div>
                            <div className="text-center">
                              <p className={`text-sm font-bold mb-1 transition-colors ${isDragging ? 'text-primary-500' : 'text-gray-400'}`}>
                                {isDragging ? '여기에 놓으세요!' : '사진 업로드'}
                              </p>
                              <p className="text-[11px] text-gray-600">클릭하거나 드래그하여 사진을 추가하세요</p>
                            </div>
                          </div>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeStoryBlock(block.id); }}
                          className="absolute right-3 top-3 p-2 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-all shadow-xl z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Add Block Controls (Bottom of each block) */}
                    <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => addStoryBlock('text', index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Plus className="w-3 h-3 text-primary-500" /> 글 추가
                      </button>
                      <button 
                        onClick={() => addStoryBlock('image', index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <ImageIcon className="w-3 h-3 text-primary-500" /> 사진 추가
                      </button>
                    </div>
                  </div>
                ))}

                {/* Final Add Block Button (If list is empty or for extra) */}
                <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                   <p className="text-[11px] text-gray-600 font-medium">스토리 블록을 추가하여 후기를 구성해보세요</p>
                   <div className="flex gap-4">
                    <button 
                      onClick={() => addStoryBlock('text')}
                      className="p-4 bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-primary-500/50 transition-all w-24"
                    >
                      <Type className="w-6 h-6 text-primary-500" />
                      <span className="text-[10px] text-gray-400 font-bold">글 추가</span>
                    </button>
                    <button 
                      onClick={() => addStoryBlock('image')}
                      className="p-4 bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-primary-500/50 transition-all w-24"
                    >
                      <ImageIcon className="w-6 h-6 text-primary-500" />
                      <span className="text-[10px] text-gray-400 font-bold">사진 추가</span>
                    </button>
                   </div>
                </div>
              </div>
            )}
          </div>
          {/* Submit Button at the end of the flow */}
          <div className="pt-10 pb-20">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-primary-500 text-white font-black text-xl py-5 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>맛집 등록 완료하기</span>
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-gray-600">
              * 등록된 정보는 가이드님의 맛집 지도에 즉시 반영됩니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
