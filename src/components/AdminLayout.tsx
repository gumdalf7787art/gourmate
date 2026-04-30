import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Megaphone,
  LifeBuoy,
  Settings,
  ArrowLeft,
  Bell,
  Menu,
  X,
  Search,
  Activity
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { icon: <LayoutDashboard className="w-4 h-4" />, label: '대시보드', path: '/admin' },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { icon: <Users className="w-4 h-4" />, label: '회원 관리', path: '/admin/users' },
        { icon: <FileText className="w-4 h-4" />, label: '콘텐츠 관리', path: '/admin/posts' },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { icon: <Megaphone className="w-4 h-4" />, label: '알림/캠페인', path: '/admin/campaigns' },
        { icon: <LifeBuoy className="w-4 h-4" />, label: '고객 지원', path: '/admin/reports' },
      ]
    }
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#030303] text-gray-200 font-sans selection:bg-primary-500/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative Gradient */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none"></div>

          <div className="p-6 flex items-center justify-between relative z-10">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-black text-white tracking-tighter leading-none">GOURMATE</span>
                <span className="text-[9px] text-primary-500 font-bold uppercase tracking-widest mt-0.5">Workspace</span>
              </div>
            </Link>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto no-scrollbar relative z-10">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="px-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 relative group overflow-hidden ${
                          isActive
                            ? 'text-white bg-white/5'
                            : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.02]'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"></div>
                        )}
                        <div className={`transition-colors duration-300 ${isActive ? 'text-primary-500' : 'group-hover:text-gray-400'}`}>
                          {item.icon}
                        </div>
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 relative z-10 bg-[#0a0a0a]">
            <Link to="/my" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-xs font-bold rounded-xl hover:bg-white/5">
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 w-full">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search (Mock) */}
            <div className="hidden md:flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-4 py-1.5 focus-within:border-primary-500/50 focus-within:bg-[#1a1a1a] transition-colors w-64">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search anything (Press '/')" 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-600 w-full font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 right-0 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#030303]"></span>
            </button>
            <div className="w-[1px] h-6 bg-white/10"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-white font-black text-xs group-hover:border-primary-500/50 transition-colors">
                A
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">Admin User</span>
                <span className="text-[10px] text-gray-500">Super Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-10 overflow-x-hidden relative">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
