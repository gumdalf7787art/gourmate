import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Heart, MessageCircle, Search, X } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

export function MyPosts() {
  const navigate = useNavigate();
  // 임의로 5개의 포스트를 내 포스트로 가정
  const [myPosts, setMyPosts] = useState(MOCK_POSTS.slice(0, 5));
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    if(window.confirm('정말 이 포스팅을 삭제하시겠습니까?')) {
      setMyPosts(prev => prev.filter(p => p.id !== id));
      alert('삭제되었습니다.');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/my/posts/edit/${id}`);
  };

  // 검색 필터링 로직
  const filteredPosts = myPosts.filter(post => 
    post.place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">나의 포스팅 관리</h1>
        <div className="w-10"></div> {/* 여백 보정용 */}
      </header>

      {/* Search Bar */}
      <div className="px-5 pt-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="장소명 또는 내용으로 검색"
            className="block w-full pl-11 pr-10 py-3.5 bg-[#111] border border-white/10 rounded-2xl leading-5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all sm:text-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 group hover:border-white/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-1 left-1 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[8px] font-bold text-white">
                    {post.images.length}장
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate mb-1 group-hover:text-primary-400 transition-colors">{post.place.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-primary-500">
                      <Heart className="w-3 h-3 fill-primary-500" />
                      <span className="text-[10px] font-bold">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-[10px] font-bold">12</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleEdit(post.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors border border-white/5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  수정
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors border border-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-3xl">
            <Search className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm font-medium">검색 결과가 없습니다.</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-primary-500 text-xs font-bold hover:underline"
              >
                검색어 초기화
              </button>
            )}
            {!searchTerm && (
              <Link to="/write" className="mt-4 px-6 py-2.5 bg-primary-500 text-white font-bold rounded-xl text-sm">
                포스팅 작성하기
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

