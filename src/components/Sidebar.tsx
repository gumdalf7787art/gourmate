import { Home, Map as MapIcon, PlusSquare, Heart, LogIn, Search, Bell, Settings } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import clsx from 'clsx';

export function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const menuItems = [
    { to: '/', icon: Home, label: '홈' },
    { to: '/search', icon: Search, label: '검색' },
    { to: '/map', icon: MapIcon, label: '지도' },
    { to: '/wishlist', icon: Heart, label: '관심' },
    { to: '/my/notifications', icon: Bell, label: '알림', count: unreadCount },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-black border-r border-white/5 hidden lg:flex flex-col p-6 z-[100]">
      {/* Logo */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-3 mb-10 cursor-pointer active:scale-95 transition-transform px-2"
      >
        <img src="/logo.png" alt="Gourmate Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-2xl font-black tracking-tighter">
          <span className="text-white">GOUR</span>
          <span className="text-primary-500">MATE</span>
        </h1>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              'flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 group',
              isActive 
                ? 'bg-primary-500/10 text-primary-500' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <div className="relative">
              <item.icon className={clsx(
                "w-6 h-6",
                item.to === '/wishlist' && "group-hover:fill-primary-500/50"
              )} strokeWidth={2} />
              {item.count !== undefined && item.count > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-black" />
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Post Button */}
        <button
          onClick={() => navigate(user ? '/write' : '/login')}
          className="w-full mt-6 flex items-center gap-4 px-4 py-4 bg-primary-500 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          <PlusSquare className="w-6 h-6" strokeWidth={2.5} />
          <span>포스팅 하기</span>
        </button>
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <NavLink
          to={user ? "/my" : "/login"}
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
            isActive ? 'bg-white/5' : 'hover:bg-white/5'
          )}
        >
          {user ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#111]">
              <img src={user.profileImageUrl || '/default-avatar.png'} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user ? user.nickname : '로그인 하세요'}</p>
            <p className="text-[11px] text-gray-500 font-medium">{user ? '가이드 프로필' : '환영합니다!'}</p>
          </div>
          <Settings className="w-4 h-4 text-gray-600" />
        </NavLink>
      </div>
    </aside>
  );
}
