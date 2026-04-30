import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Heart, MessageCircle } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

export function MyPosts() {
  const navigate = useNavigate();
  // 임의로 2개의 포스트를 내 포스트로 가정
  const [myPosts, setMyPosts] = useState(MOCK_POSTS.slice(0, 2));

  const handleDelete = (id: string) => {
    if(window.confirm('정말 이 포스팅을 삭제하시겠습니까?')) {
      setMyPosts(prev => prev.filter(p => p.id !== id));
      alert('삭제되었습니다.');
    }
  };

  const handleEdit = (id: string) => {
    // 임시로 수정 알림
    alert(`포스트 ID ${id} 수정 화면으로 이동합니다.`);
  };

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

      <div className="px-5 py-6 flex flex-col gap-4">
        {myPosts.length > 0 ? (
          myPosts.map(post => (
            <div key={post.id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={post.images[0]} alt={post.place.name} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[8px] font-bold text-white">
                    {post.images.length}장
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">{post.place.name}</h3>
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  수정
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <p className="text-sm font-medium">작성한 포스팅이 없습니다.</p>
            <Link to="/write" className="mt-4 px-6 py-2.5 bg-primary-500 text-white font-bold rounded-xl text-sm">
              포스팅 작성하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
