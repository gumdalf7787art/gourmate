import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Reply, ExternalLink, Check, Clock } from 'lucide-react';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/store/useAuthStore';

export default function ManageComments() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>({});

  const fetchComments = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const res = await postService.getReceivedComments(user.id);
      if (res.success) {
        setComments(res.data);
        
        // Mark all unread as read when entering the page
        const unreadIds = res.data.filter((c: any) => !c.is_read).map((c: any) => c.id);
        if (unreadIds.length > 0) {
          await postService.markCommentsAsRead(unreadIds);
        }
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [user?.id]);

  const handleReplySubmit = async (comment: any) => {
    const text = replyText[comment.id];
    if (!text || !text.trim() || !user?.id) return;

    setIsSubmitting(prev => ({ ...prev, [comment.id]: true }));
    try {
      const res = await postService.addReview({
        post_id: comment.post_id,
        user_id: user.id,
        content: text,
        parent_id: comment.id
      });

      if (res.success) {
        setReplyText(prev => ({ ...prev, [comment.id]: '' }));
        alert('답글이 등록되었습니다.');
        // Refresh comments to show the reply if needed, though this view only shows incoming comments.
        // Actually, let's just refresh.
        fetchComments();
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('답글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(prev => ({ ...prev, [comment.id]: false }));
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white font-pretendard">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-5 h-16 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-black tracking-tighter">댓글 관리</span>
          <span className="text-[10px] text-primary-500 font-bold uppercase tracking-widest italic">Received Comments</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="px-5 pt-6">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                className={`bg-[#0f0f0f] border rounded-2xl p-5 transition-all ${
                  !comment.is_read ? 'border-primary-500/30 bg-primary-500/5' : 'border-white/5'
                }`}
              >
                {/* Header: Reviewer Info & Post Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={comment.reviewer_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.reviewer_nickname)}&background=333&color=fff`} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{comment.reviewer_nickname}</span>
                      <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/post/${comment.post_id}`)}
                    className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md text-[9px] font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    <span>{comment.post_title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {comment.content}
                  </p>
                </div>

                {/* Reply Form */}
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <textarea 
                      value={replyText[comment.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      placeholder="답글을 남겨보세요..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:border-primary-500/50 outline-none transition-all min-h-[60px] resize-none"
                    />
                    <button 
                      onClick={() => handleReplySubmit(comment)}
                      disabled={!replyText[comment.id]?.trim() || isSubmitting[comment.id]}
                      className="absolute bottom-3 right-3 p-2 bg-primary-500 text-black rounded-lg active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
                    >
                      {isSubmitting[comment.id] ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Reply className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-50">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold tracking-tight">아직 도착한 댓글이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
