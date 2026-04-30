import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  X, 
  Plus, 
  Star, 
  MapPin, 
  Tag as TagIcon,
  Utensils
} from 'lucide-react';
import { MOCK_POSTS, MenuItem } from '@/data/mock';

export function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [content, setContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const post = MOCK_POSTS.find(p => p.id === id);
    if (post) {
      setContent(post.content);
      setPostTitle(post.place.name);
      setCategory(post.place.category);
      setAddress(post.place.address);
      setRating(post.rating);
      setImages(post.images);
      setTags(post.tags || []);
      setMenuItems(post.menuItems || []);
    } else {
      alert('포스트를 찾을 수 없습니다.');
      navigate(-1);
    }
  }, [id, navigate]);

  const handleSave = () => {
    alert('수정이 완료되었습니다.');
    navigate(-1);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', isSignature: false }]);
  };

  const updateMenuItem = (idx: number, field: keyof MenuItem, value: string | boolean) => {
    const newList = [...menuItems];
    newList[idx] = { ...newList[idx], [field]: value };
    setMenuItems(newList);
  };

  const removeMenuItem = (idx: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">포스팅 수정</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col">
        {/* 1. Image Editor */}
        <section className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary-500" />
              사진 수정 ({images.length})
            </h2>
            <button className="text-[11px] font-bold text-primary-500 uppercase tracking-widest bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20">
              사진 추가
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {images.map((img, idx) => (
              <div key={idx} className="relative flex-none w-32 aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/5"></div>

        {/* 2. Place & Rating Info */}
        <section className="px-5 py-8 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 bg-primary-500 text-white text-[9px] font-black rounded-md uppercase tracking-tight mb-2 inline-block">
                {category}
              </span>
              <h2 className="text-2xl font-black text-white tracking-tighter leading-tight mb-2">
                {postTitle}
              </h2>
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-3 h-3 text-primary-500/70" />
                <span className="text-[11px] font-medium">{address}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Guide Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star 
                      className={`w-5 h-5 transition-all ${
                        star <= Math.round(rating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-700'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-1 text-lg font-black text-white">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Tag Editor */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest opacity-70">
              <TagIcon className="w-3 h-3 text-primary-500" />
              키워드 태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1.5 text-[11px] text-primary-500 font-bold px-3 py-1.5 bg-primary-500/5 rounded-xl border border-primary-500/20 group">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-primary-500/40 hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ 태그 추가"
                className="bg-transparent border border-dashed border-white/20 rounded-xl px-3 py-1.5 text-[11px] text-gray-400 focus:outline-none focus:border-primary-500 transition-colors w-24"
              />
            </div>
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/5"></div>

        {/* 3. Review Content */}
        <section className="px-5 py-8 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest opacity-70">
            가이드의 한마디
          </h3>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 px-5 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl text-[14px] text-gray-200 leading-relaxed font-light focus:outline-none focus:border-primary-500 transition-colors resize-none italic"
            placeholder="포스팅 내용을 입력해주세요"
          />
        </section>

        <div className="w-full h-[1px] bg-white/5"></div>

        {/* 4. Menu Items Editor */}
        <section className="px-5 py-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest opacity-70">
              <Utensils className="w-3.5 h-3.5 text-primary-500" />
              가이드 추천 메뉴 관리
            </h3>
            <button 
              onClick={addMenuItem}
              className="text-[10px] font-black text-primary-500 border border-primary-500/30 px-2 py-1 rounded-md"
            >
              메뉴 추가
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {menuItems.map((item, idx) => (
              <div key={idx} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 relative group">
                <button 
                  onClick={() => removeMenuItem(idx)}
                  className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => updateMenuItem(idx, 'name', e.target.value)}
                      placeholder="메뉴명"
                      className="w-full bg-transparent border-b border-white/10 py-1 text-sm font-bold text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div className="w-24 text-right">
                    <input 
                      type="text" 
                      value={item.price}
                      onChange={(e) => updateMenuItem(idx, 'price', e.target.value)}
                      placeholder="가격"
                      className="w-full bg-transparent border-b border-white/10 py-1 text-sm font-black text-primary-500 text-right focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={`sig-${idx}`}
                    checked={item.isSignature}
                    onChange={(e) => updateMenuItem(idx, 'isSignature', e.target.checked)}
                    className="accent-primary-500"
                  />
                  <label htmlFor={`sig-${idx}`} className="text-[10px] font-black text-gray-500 uppercase tracking-tighter cursor-pointer select-none">
                    Signature Menu
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Action Buttons (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto p-5 bg-black/90 backdrop-blur-xl border-t border-white/10 flex gap-3 z-50 pb-safe">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/10"
        >
          취소
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 py-4 bg-primary-500 text-white font-black rounded-2xl hover:bg-primary-600 transition-all shadow-[0_10px_20px_rgba(255,107,0,0.3)] active:scale-95"
        >
          수정 완료
        </button>
      </div>
    </div>
  );
}
