import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, MessageCircle, UserPlus, Bell, Sparkles } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';

export function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotificationStore();

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
    // 필요시 관련 페이지로 이동 로직 추가 가능
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
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
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
        <span className="text-sm font-bold text-gray-400 mr-2">알림</span>
      </header>

      <div className="flex flex-col divide-y divide-white/5">
        {notifications.map(noti => (
          <div 
            key={noti.id} 
            onClick={() => handleNotificationClick(noti.id)}
            className={`p-5 flex gap-4 cursor-pointer hover:bg-white/5 transition-colors ${noti.isRead ? 'opacity-60' : 'bg-[#111]'}`}
          >
            <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
              {getIcon(noti.type)}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-sm font-medium text-white leading-snug">{noti.message}</p>
              <span className="text-[10px] text-gray-500 font-bold">{noti.time}</span>
            </div>
            {!noti.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
