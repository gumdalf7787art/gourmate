import { Home, Map as MapIcon, PlusSquare, User, Heart, LogIn } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import clsx from 'clsx';

export function BottomNav() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe z-[90]">
      <ul className="flex items-center justify-between h-[76px] px-2 relative">
        
        {/* 1. 홈 */}
        <li className="flex-1">
          <NavLink to="/" className={({ isActive }) => clsx(
            'flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300',
            isActive ? 'text-primary-500 scale-105' : 'text-gray-500'
          )}>
            {({ isActive }) => (
              <>
                <Home className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold">홈</span>
              </>
            )}
          </NavLink>
        </li>

        {/* 2. 지도 */}
        <li className="flex-1">
          <NavLink to="/map" className={({ isActive }) => clsx(
            'flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300',
            isActive ? 'text-primary-500 scale-105' : 'text-gray-500'
          )}>
            {({ isActive }) => (
              <>
                <MapIcon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold">지도</span>
              </>
            )}
          </NavLink>
        </li>

        {/* 3. 포스팅 (중앙 강조) */}
        <li className="flex-1 flex justify-center -mt-6">
          <NavLink to={user ? "/write" : "/login"} className="flex flex-col items-center gap-1">
            <div className="w-[52px] h-[52px] bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,107,0,0.4)] active:scale-90 transition-all border-4 border-black">
              <PlusSquare className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black text-primary-500">포스팅</span>
          </NavLink>
        </li>

        {/* 4. 관심 (Wishlist) */}
        <li className="flex-1">
          <NavLink to="/wishlist" className={({ isActive }) => clsx(
            'flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300',
            isActive ? 'text-primary-500 scale-105' : 'text-gray-500'
          )}>
            {({ isActive }) => (
              <>
                <Heart className={clsx("w-[22px] h-[22px]", isActive && "fill-primary-500")} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-bold">관심</span>
              </>
            )}
          </NavLink>
        </li>

        {/* 5. 마이 / 로그인 */}
        <li className="flex-1">
          <NavLink to={user ? "/my" : "/login"} className={({ isActive }) => clsx(
            'flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300',
            isActive ? 'text-primary-500 scale-105' : 'text-gray-500'
          )}>
            {({ isActive }) => (
              <>
                {user ? (
                  <User className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.5} />
                ) : (
                  <LogIn className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.5} />
                )}
                <span className="text-[10px] font-bold">{user ? '마이' : '로그인'}</span>
              </>
            )}
          </NavLink>
        </li>

      </ul>
    </nav>
  );
}

