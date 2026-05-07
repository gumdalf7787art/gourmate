import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, MessageCircle, UserPlus, Bell, Sparkles, Loader2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';

export function Notifications() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { notifications, fetchNotifications, markAsRead, clearNotifications, setNotifications, isLoading } = useNotificationStore();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id, fetchNotifications]);

  const handleClearAll = () => {
    if (window.confirm('모든 알림 내역을 완전히 지우시겠습니까?')) {
      clearNotifications();
      setIsEditMode(false);
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`${selectedIds.length}개의 알림을 삭제하시겠습니까?`)) {
      const remaining = notifications.filter(n => !selectedIds.includes(n.id));
      setNotifications(remaining);
      setSelectedIds([]);
      if (remaining.length === 0) setIsEditMode(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNotificationClick = (noti: any) => {
    if (isEditMode) {
      toggleSelect(noti.id);
      return;
    }
    markAsRead(noti.id);
    if (noti.link) {
      navigate(noti.link);
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '방금 전';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'like': return <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-green-400" />;
      case 'guide': return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'system': default: return <Bell className="w-4 h-4 text-primary-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <img src="/logo.png" alt="Gourmate Logo" className="w-6 h-6 object-contain" />
            <h1 className="text-lg font-black tracking-tighter">
              <span className="text-white">GOUR</span>
              <span className="text-primary-500">MATE</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <button 
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedIds([]);
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                isEditMode ? 'bg-white text-black' : 'text-gray-400 hover:text-white bg-white/5'
              }`}
            >
              {isEditMode ? '완료' : '편집'}
            </button>
          )}
          <span className="text-sm font-bold text-gray-400">알림</span>
        </div>
      </header>

      {isEditMode && notifications.length > 0 && (
        <div className="bg-primary-500/10 border-b border-primary-500/20 px-5 py-3 flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedIds(selectedIds.length === notifications.length ? [] : notifications.map(n => n.id))}
              className="text-xs font-bold text-primary-500"
            >
              {selectedIds.length === notifications.length ? '선택 해제' : '전체 선택'}
            </button>
            <span className="text-[10px] text-gray-500">({selectedIds.length}개 선택됨)</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearAll}
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
            >
              전체삭제
            </button>
            <button 
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              선택삭제
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20" />
          <p className="text-sm font-medium">알림을 불러오는 중...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="flex flex-col divide-y divide-white/5">
          {notifications.map(noti => (
            <div 
              key={noti.id} 
              onClick={() => handleNotificationClick(noti)}
              className={`p-5 flex gap-4 cursor-pointer hover:bg-white/5 transition-colors relative ${
                noti.isRead ? 'opacity-60' : 'bg-[#111]'
              } ${selectedIds.includes(noti.id) ? 'bg-primary-500/5' : ''}`}
            >
              {isEditMode && (
                <div className="flex items-center pr-1 animate-in zoom-in duration-200">
                  {selectedIds.includes(noti.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-700" />
                  )}
                </div>
              )}
              <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                {getIcon(noti.type)}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm font-medium text-white leading-snug">{noti.message}</p>
                <span className="text-[10px] text-gray-500 font-bold">{formatTime(noti.createdAt)}</span>
              </div>
              {!noti.isRead && !isEditMode && (
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 opacity-10" />
          </div>
          <h3 className="text-white font-bold mb-2">새로운 알림이 없습니다</h3>
          <p className="text-xs leading-relaxed opacity-60">
            가이드들의 소식이나 회원님의 활동에 대한<br />
            새로운 알림이 도착하면 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
