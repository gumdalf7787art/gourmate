import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  FileText, 
  ArrowLeft,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: '대시보드', path: '/admin' },
    { icon: <AlertTriangle className="w-5 h-5" />, label: '신고 관리', path: '/admin/reports' },
    { icon: <Users className="w-5 h-5" />, label: '사용자 관리', path: '/admin/users' },
    { icon: <FileText className="w-5 h-5" />, label: '포스팅 관리', path: '/admin/posts' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">Admin</span>
            </Link>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5">
            <Link to="/my" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-sm font-bold">
              <ArrowLeft className="w-4 h-4" />
              마이페이지로 돌아가기
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header - Mobile & Desktop Top Bar */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-black text-white uppercase tracking-widest hidden sm:block">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border border-[#050505]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Super Admin</p>
                <p className="text-[10px] text-gray-500 mt-1">goodduck2@naver.com</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/30 flex items-center justify-center text-primary-500 font-black text-xs">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay - Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
