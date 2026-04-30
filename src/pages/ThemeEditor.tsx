import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, X, Plus, Hash, Type, MapPin } from 'lucide-react';
import { MOCK_COLLECTIONS, MOCK_POSTS } from '@/data/mock';
import type { Place } from '@/data/mock';

export function ThemeEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<{ file?: File; preview: string } | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // 선택된 식당 (포스팅)
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

  // 내 포스팅 목록 (실제로는 API에서 가져오겠지만, 여기서는 전체 Mock Posts를 사용)
  const myPosts = MOCK_POSTS;

  useEffect(() => {
    if (isEditMode) {
      const existingTheme = MOCK_COLLECTIONS.find(c => c.id === id);
      if (existingTheme) {
        setTitle(existingTheme.title);
        setDescription(existingTheme.description || '');
        setThumbnail({ preview: existingTheme.thumbnail });
        setTags(existingTheme.keywords || []);
        setSelectedPlaces(existingTheme.places || []);
      } else {
        alert('테마를 찾을 수 없습니다.');
        navigate(-1);
      }
    }
  }, [id, isEditMode, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setThumbnail({ file, preview });
  };

  const removeThumbnail = () => {
    if (thumbnail?.file) {
      URL.revokeObjectURL(thumbnail.preview);
    }
    setThumbnail(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const togglePlaceSelection = (place: Place) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p.id === place.id);
      if (isSelected) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('테마 제목을 입력해주세요.');
      return;
    }
    if (!thumbnail) {
      alert('테마 썸네일을 추가해주세요.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(isEditMode ? '테마가 수정되었습니다!' : '새 테마가 생성되었습니다!');
      navigate('/my/themes');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">{isEditMode ? '테마 수정' : '테마 생성하기'}</h1>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8">
        {/* Thumbnail Upload */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-bold text-white">테마 썸네일</h3>
          </div>
          
          {thumbnail ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group">
              <img src={thumbnail.preview} alt="Thumbnail preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={removeThumbnail}
                  className="px-4 py-2 bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/50 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Trash2Icon className="w-4 h-4" />
                  삭제하기
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-primary-500/50 transition-all group bg-[#111]"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-500/10 transition-all">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium group-hover:text-primary-500 transition-colors">멋진 썸네일 이미지를 올려주세요</span>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-bold text-white">테마 제목</h3>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 비 오는 날 가기 좋은 신당동 감성 카페"
              className="w-full bg-[#111] border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-bold"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-3 ml-6">테마 설명 (선택)</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 테마에 대한 간단한 소개를 적어주세요."
              className="w-full h-24 bg-[#111] border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-all text-sm"
            ></textarea>
          </div>
        </section>

        {/* Keywords */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-bold text-white">테마 키워드</h3>
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
                placeholder="키워드 입력 후 엔터"
                className="w-full pl-7 pr-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
            <button
              onClick={() => {
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-primary-500 hover:border-primary-500 transition-all text-sm font-bold"
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
        </section>

        <div className="w-full h-[1px] bg-white/10 my-8"></div>

        {/* Post Selection */}
        <section>
          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">식당 추가하기</h3>
              <span className="text-sm font-bold text-primary-500">{selectedPlaces.length}곳 선택됨</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">내가 포스팅한 식당 중에서 이 테마에 포함시킬 식당을 선택하세요.</p>
          </div>

          <div className="grid gap-3">
            {myPosts.map(post => {
              const isSelected = selectedPlaces.some(p => p.id === post.place.id);
              return (
                <div 
                  key={post.id}
                  onClick={() => togglePlaceSelection(post.place)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-primary-500/10 border-primary-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                      : 'bg-[#111] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate mb-1">{post.place.name}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{post.place.address}</span>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-1 transition-colors ${
                    isSelected ? 'bg-primary-500 border-primary-500' : 'border-white/20'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-10 flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-4 bg-[#111] text-white font-bold text-sm rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-[2] bg-primary-500 text-white font-black text-sm py-4 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{isEditMode ? '수정 완료' : '테마 생성 완료'}</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

// Trash2Icon은 lucide-react에서 import하지 않았으므로 파일 하단에 임시로 정의하거나 상단에서 import 추가
function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18"></path>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}
