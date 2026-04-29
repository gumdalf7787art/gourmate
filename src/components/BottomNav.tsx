import { Home, Map as MapIcon, PlusSquare, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: '홈', icon: Home },
  { path: '/map', label: '지도', icon: MapIcon },
  { path: '/write', label: '포스팅', icon: PlusSquare },
  { path: '/my', label: '마이', icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[640px] mx-auto bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe z-50">
      <ul className="flex items-center justify-around h-[72px] px-2 mb-2">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300',
                  isActive ? 'text-primary-500 scale-105' : 'text-gray-500 hover:text-gray-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
