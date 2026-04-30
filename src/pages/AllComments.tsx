import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Search, Trash2, Reply, MoreHorizontal } from 'lucide-react';

export function AllComments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 가상의 전체 댓글 데이터
  const [comments, setComments] = useState([
    { id: 1, postName: '몽탄', postId: 'p1', author: '고기사랑', content: '진짜 인생 우대갈비입니다! 꿀팁 감사해요.', time: '2시간 전', profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
    { id: 2, postName: '오레노라멘', postId: 'p2', author: '면식수행자', content: '합정가면 무조건 들러야겠네요. 사진 너무 잘 찍으셨어요.', time: '5시간 전', profile: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
    { id: 3, postName: '누데이크', postId: 'p3', author: '디저트헌터', content: '피크 케이크 정말 궁금했는데 후기 보고 주말에 가기로 결심했습니다 ㅎㅎ', time: '1일 전', profile: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: 4, postName: '다운타우너', postId: 'p4', author: '버거맨', content: '갈릭 버터 프라이즈는 못 참죠 ㅠㅠ', time: '2일 전', profile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { id: 5, postName: '몽탄', postId: 'p1', author: '웨이팅지옥', content: '여기 웨이팅 얼마나 걸리셨나요? 가보려고 하는데 엄두가 안 나네요.', time: '3일 전', profile: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
    { id: 6, postName: '새들러하우스', postId: 'p5', author: '크로플덕후', content: '강남점보다 성수점이 확실히 더 맛있긴 하더라고요!', time: '4일 전', profile: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
    { id: 7, postName: '오레노라멘', postId: 'p2', author: '토리파이탄', content: '국물이 정말 진해서 좋았어요.', time: '1주일 전', profile: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80' },
  ]);

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.postName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">전체 댓글 관리</h1>
      </header>

      <main className="flex-1 px-5 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="댓글 내용, 작성자, 포스팅 이름 검색"
            className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-500 font-bold">총 <span className="text-primary-500">{filteredComments.length}</span>개의 댓글</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-bold">
            <span>최신순</span>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="py-20 text-center">
              <MessageCircle className="w-12 h-12 text-white/5 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
            </div>
          ) : (
            filteredComments.map(comment => (
              <div key={comment.id} className="bg-[#111] border border-white/10 rounded-2xl p-5 group transition-all hover:border-white/20 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={comment.profile} 
                      alt={comment.author} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10" 
                    />
                    <div>
                      <h4 className="text-sm font-black text-white">{comment.author}</h4>
                      <p className="text-[10px] text-gray-500 font-bold">{comment.time}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-600 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="pl-[52px]">
                  <p className="text-[14px] text-gray-200 leading-relaxed mb-4">
                    {comment.content}
                  </p>

                  <div 
                    onClick={() => navigate(`/post/${comment.postId}`)}
                    className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between group/post cursor-pointer hover:bg-white/10 transition-all mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-bold">원문 포스팅:</span>
                      <span className="text-[11px] font-black text-primary-500">{comment.postName}</span>
                    </div>
                    <ArrowLeft className="w-3 h-3 text-gray-600 rotate-180 group-hover/post:translate-x-1 transition-transform" />
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-500 transition-colors">
                      <Reply className="w-4 h-4" />
                      답글 달기
                    </button>
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
