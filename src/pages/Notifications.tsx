import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';

export function Notifications() {
  const navigate = useNavigate();

  const MOCK_NOTIFICATIONS = [
    {
      id: 1,
      type: 'like',
      message: '회원님의 포스팅에 새로운 좋아요가 달렸습니다.',
      time: '10분 전',
      isRead: false
    },
    {
      id: 2,
      type: 'comment',
      message: '회원님의 테마에 새로운 댓글이 달렸습니다: "여기 진짜 맛있어요!"',
      time: '2시간 전',
      isRead: false
    },
    {
      id: 3,
      type: 'follow',
      message: '새로운 사용자가 회원님을 팔로우합니다.',
      time: '어제',
      isRead: true
    },
    {
      id: 4,
      type: 'system',
      message: '서비스 이용약관이 변경되었습니다. 확인해주세요.',
      time: '3일 전',
      isRead: true
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'like': return <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-green-400" />;
      case 'system': default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">알림</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col divide-y divide-white/5">
        {MOCK_NOTIFICATIONS.map(noti => (
          <div 
            key={noti.id} 
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
