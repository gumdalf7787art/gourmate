import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, MapPin, Image as ImageIcon, 
  X, Plus, Type, Star 
} from 'lucide-react';
import { postService } from '@/services/postService';
import { uploadService } from '@/services/uploadService';
import { useAuthStore } from '@/store/useAuthStore';
import { KakaoMap } from '@/components/KakaoMap';

export function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<any>(null);

  // Form states
  const [review, setReview] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ file?: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [menuItems, setMenuItems] = useState<{ name: string; price: string; isSignature: boolean }[]>([]);

  // 스토리 에디터 관련 상태
  const [editorMode, setEditorMode] = useState<'simple' | 'story'>('simple');
  type StoryBlock = {
    id: string;
    type: 'text' | 'image';
    value: string;
    file?: File;
  };
  const [storyBlocks, setStoryBlocks] = useState<StoryBlock[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await postService.getPost(id);
        const foundPost = response.data || response; // success/data 래퍼가 있거나 없는 경우 모두 대응
        console.log('Fetched Post Data:', foundPost);
        
        if (foundPost && (foundPost.id || foundPost.restaurant_name)) {
          setPost(foundPost);
          setReview(foundPost.review || '');
          setContent(foundPost.content || '');
          setRating(foundPost.rating || 0);
          setSelectedTag(foundPost.category || foundPost.place?.category || '음식점');
          setTags(foundPost.tags || []);
          setMenuItems(foundPost.menu_items || []);
          setEditorMode(foundPost.editor_mode || 'simple');
          
          if (foundPost.story_blocks && foundPost.story_blocks.length > 0) {
            setStoryBlocks(foundPost.story_blocks);
          } else {
             setStoryBlocks([{ id: Math.random().toString(36).substr(2, 9), type: 'text', value: foundPost.content || '' }]);
          }

          if (foundPost.images && foundPost.images.length > 0) {
            setMediaFiles(foundPost.images.map((url: string) => ({
              preview: url,
              type: 'image' as const
            })));
          }
        } else {
          alert('포스트를 찾을 수 없습니다.');
          navigate('/my/posts');
        }
      } catch (err) {
        console.error('Failed to load post:', err);
        alert('데이터 로딩 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [id, navigate]);

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
    const newFiles: { file?: File; preview: string; type: 'image' | 'video' }[] = await Promise.all(Array.from(files).map(async file => {
      const resized = file.type.startsWith('image/') ? await resizeImage(file) : file;
      return {
        file: resized,
        preview: URL.createObjectURL(resized),
        type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video'
      };
    }));
    setMediaFiles([...mediaFiles, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    const newMedia = [...mediaFiles];
    if (newMedia[index].file) URL.revokeObjectURL(newMedia[index].preview);
    newMedia.splice(index, 1);
    setMediaFiles(newMedia);
  };

  const addStoryBlock = (type: 'text' | 'image', index?: number) => {
    const newBlock: StoryBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      value: ''
    };
    setStoryBlocks(prev => {
      const newBlocks = [...prev];
      if (typeof index === 'number') newBlocks.splice(index + 1, 0, newBlock);
      else newBlocks.push(newBlock);
      return newBlocks;
    });
  };

  const updateStoryBlock = (id: string, value: string, file?: File) => {
    setStoryBlocks(prev => prev.map(block => block.id === id ? { ...block, value, file } : block));
  };

  const removeStoryBlock = (id: string) => {
    if (storyBlocks.length <= 1) return;
    setStoryBlocks(prev => prev.filter(block => block.id !== id));
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
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles: { file?: File; preview: string; type: 'image' | 'video' }[] = await Promise.all(Array.from(files).map(async file => {
        const resized = file.type.startsWith('image/') ? await resizeImage(file) : file;
        return {
          file: resized,
          preview: URL.createObjectURL(resized),
          type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video'
        };
      }));
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const handleStoryDrop = async (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const resized = await resizeImage(file);
      const preview = URL.createObjectURL(resized);
      updateStoryBlock(blockId, preview, resized);
    }
  };

  const handleStoryImageUpload = async (id: string, file: File) => {
    const resized = await resizeImage(file);
    const preview = URL.createObjectURL(resized);
    updateStoryBlock(id, preview, resized);
  };

  const handleSubmit = async () => {
    if (!id || !user) return;
    setIsSubmitting(true);
    try {
      // 1. 이미지 업로드 (간편 모드)
      const finalImages: string[] = [];
      if (editorMode === 'simple') {
        for (const media of mediaFiles) {
          if (media.file) {
            const res = await uploadService.uploadImage(media.file);
            if (res.success) finalImages.push(res.url);
          } else {
            finalImages.push(media.preview);
          }
        }
      }

      // 2. 스토리 블록 업데이트 (스토리 모드)
      const finalStoryBlocks = editorMode === 'story' 
        ? await Promise.all(storyBlocks.map(async (block) => {
            if (block.type === 'image' && block.file) {
              const res = await uploadService.uploadImage(block.file);
              if (res.success) return { ...block, value: res.url, file: undefined };
            }
            return block;
          }))
        : [];

      const updateData = {
        category: selectedTag,
        content: editorMode === 'simple' 
          ? content 
          : finalStoryBlocks.map(b => b.type === 'text' ? b.value : `[이미지]`).join('\n'),
        review: review,
        rating: rating,
        images: editorMode === 'simple' ? finalImages : finalStoryBlocks.filter(b => b.type === 'image').map(b => b.value),
        tags: tags,
        editor_mode: editorMode,
        story_blocks: finalStoryBlocks,
        menu_items: menuItems
      };

      const res = await postService.updatePost(id, updateData);
      if (res.success) {
        alert('포스트가 성공적으로 수정되었습니다.');
        navigate('/my/posts');
      } else {
        alert(res.error || '수정 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('수정 중 서버 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CUSTOM_TAGS = ['한식', '일식', '중식', '양식', '카페', '파인다이닝', '가성비', '배달맛집', '기타'];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">로딩 중...</p>
      </div>
    );
  }

  const place = post?.place;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
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
                lat: Number(place.latitude || post.y),
                lng: Number(place.longitude || post.x),
                name: place.name || post.restaurant_name
              }]} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        </section>

        {/* Place Info */}
        <section className="px-5 -mt-8 relative z-10">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            <h2 className="text-2xl font-black text-white leading-tight mb-1">{place?.name || post.restaurant_name}</h2>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <MapPin className="w-3.5 h-3.5 text-primary-500" />
              <span>{place?.address || post.address}</span>
            </div>
          </div>
        </section>

        <section className="px-5 mt-8 space-y-8">
          {/* Category */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedTag === tag ? 'bg-primary-500 text-white border border-primary-500' : 'bg-[#141414] text-gray-400 border border-white/5'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">키워드 (#태그)</h3>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">#</span>
                <input
                  type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                      setTagInput('');
                    }
                  }}
                  className="w-full pl-7 pr-4 py-3 bg-[#141414] border border-white/30 rounded-xl text-white text-sm"
                  placeholder="예: 인생라멘, 데이트성지"
                />
              </div>
              <button onClick={() => { if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(''); } }} className="px-4 py-3 bg-white/5 border border-white/30 rounded-xl text-white">추가</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-lg text-primary-500 text-xs font-bold">
                  <span>#{tag}</span>
                  <button onClick={() => setTags(tags.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">평점</h3>
              <span className="text-primary-500 font-black text-2xl">{rating.toFixed(1)}</span>
            </div>
            <div className="relative pt-2 pb-6">
              <div className="flex gap-1.5 mb-6 justify-between">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="relative w-12 h-12 flex-1 max-w-[56px]">
                    <Star className="w-full h-full text-gray-800" strokeWidth={1} />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${Math.max(0, Math.min(100, (rating - (star - 1)) * 100))}%` }}>
                      <Star className="w-full h-full fill-primary-500 text-primary-500" strokeWidth={1} />
                    </div>
                  </div>
                ))}
              </div>
              <input type="range" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>

          {/* Review */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">한줄 평</h3>
            <textarea
              value={review} onChange={(e) => setReview(e.target.value)}
              className="w-full h-24 bg-[#141414] border border-white/30 rounded-2xl p-4 text-white resize-none"
              placeholder="예: 웨이팅이 길지만 그럴 가치가 충분합니다..."
            />
          </div>

          {/* Editor Mode */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-6 p-1 bg-[#111] rounded-2xl border border-white/5">
              <button onClick={() => setEditorMode('simple')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${editorMode === 'simple' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>간편 작성</button>
              <button onClick={() => setEditorMode('story')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${editorMode === 'story' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>스토리 작성</button>
            </div>

            {editorMode === 'simple' ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">상세 후기</h3>
                  <textarea
                    ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)}
                    className="w-full h-80 bg-[#141414] border border-white/30 rounded-2xl p-5 text-white resize-none"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">사진/동영상</h3>
                  <div 
                    onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    className={`flex gap-3 overflow-x-auto pb-4 no-scrollbar rounded-2xl ${isDragging ? 'bg-primary-500/10 ring-2 ring-primary-500 ring-dashed p-4' : ''}`}
                  >
                    <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 w-32 h-32 bg-[#141414] border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center">
                      <Plus className="w-6 h-6 text-gray-400" /><span className="text-[10px] text-gray-500">추가</span>
                    </button>
                    {mediaFiles.map((media, index) => (
                      <div key={index} className="flex-shrink-0 w-32 h-32 relative rounded-2xl overflow-hidden border border-white/30">
                        <img src={media.preview} className="w-full h-full object-cover" />
                        <button onClick={() => removeMedia(index)} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-10">
                {storyBlocks.map((block, index) => (
                  <div key={block.id} className="relative group">
                    {block.type === 'text' ? (
                      <div className="relative">
                        <textarea
                          value={block.value} onChange={(e) => updateStoryBlock(block.id, e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-white text-[16px] leading-relaxed focus:ring-0 resize-none min-h-[40px]"
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto'; target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                        <button onClick={() => removeStoryBlock(block.id)} className="absolute -right-2 -top-2 p-1 text-red-500 opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <div 
                        onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => handleStoryDrop(e, block.id)}
                        onClick={() => { if (!block.value) { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleStoryImageUpload(block.id, file); }; input.click(); } }}
                        className={`relative rounded-2xl overflow-hidden border border-dashed aspect-video flex items-center justify-center cursor-pointer ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/20'}`}
                      >
                        {block.value ? <img src={block.value} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-gray-500" />}
                        <button onClick={(e) => { e.stopPropagation(); removeStoryBlock(block.id); }} className="absolute right-3 top-3 p-2 bg-black/60 text-white rounded-full"><X className="w-4 h-4" /></button>
                      </div>
                    )}
                    <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100">
                      <button onClick={() => addStoryBlock('text', index)} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 hover:text-white"><Plus className="w-3 h-3 inline mr-1" />글 추가</button>
                      <button onClick={() => addStoryBlock('image', index)} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 hover:text-white"><Plus className="w-3 h-3 inline mr-1" />사진 추가</button>
                    </div>
                  </div>
                ))}
                <div className="pt-6 flex justify-center gap-4">
                  <button onClick={() => addStoryBlock('text')} className="p-4 bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-primary-500/50 w-24"><Type className="w-6 h-6 text-primary-500" /><span className="text-[10px] text-gray-400">글 추가</span></button>
                  <button onClick={() => addStoryBlock('image')} className="p-4 bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-primary-500/50 w-24"><ImageIcon className="w-6 h-6 text-primary-500" /><span className="text-[10px] text-gray-400">사진 추가</span></button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-10 pb-20 flex gap-3">
            <button onClick={() => navigate(-1)} className="flex-1 py-5 bg-[#141414] text-white font-bold rounded-2xl border border-white/10">취소</button>
            <button
              onClick={handleSubmit} disabled={isSubmitting}
              className="flex-1 bg-primary-500 text-white font-black text-lg py-5 rounded-2xl shadow-xl hover:bg-primary-600 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><CheckCircle2 className="w-6 h-6" /><span>수정 완료</span></>}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
