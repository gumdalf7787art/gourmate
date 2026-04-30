import { Link } from 'react-router-dom';
import { 
  Settings, Users, Bell, Heart, 
  FileText, FolderPlus, BarChart2, 
  HelpCircle, Megaphone, LogOut, UserX, ChevronRight 
} from 'lucide-react';

export function MyPage() {
  // Mock User Data
  const user = {
    nickname: '고독한 미식가',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    email: 'gourmate@example.com'
  };

  const menuGroups = [
    {
      title: '내 활동 관리',
      items: [
        { icon: <Settings className="w-5 h-5" />, label: '정보 설정', desc: '프로필, 닉네임, 비밀번호 변경', link: '/my/settings' },
        { icon: <Users className="w-5 h-5" />, label: '나의 팔로우', desc: '내가 팔로우하는 가이드 목록', link: '/my/following' },
        { icon: <Bell className="w-5 h-5" />, label: '알림', desc: '새로운 소식 및 활동 알림', link: '/my/notifications' },
        { icon: <Heart className="w-5 h-5" />, label: '나의 관심 목록', desc: '저장한 장소 및 테마', link: '/wishlist' },
      ]
    },
    {
      title: '콘텐츠 관리',
      items: [
        { icon: <FileText className="w-5 h-5" />, label: '나의 포스팅 관리', desc: '작성한 포스팅 조회/수정/삭제', link: '/my/posts' },
        { icon: <FolderPlus className="w-5 h-5" />, label: '나의 테마 관리', desc: '나만의 맛집 지도 만들기', link: '/my/themes' },
        { icon: <BarChart2 className="w-5 h-5" />, label: '접속 및 통계 관리', desc: '조회수 및 댓글 확인', link: '/my/analytics' },
      ]
    },
    {
      title: '고객 지원 및 기타',
      items: [
        { icon: <Megaphone className="w-5 h-5" />, label: '공지사항', desc: 'GOURMATE의 새로운 소식', link: '/my/notice' },
        { icon: <HelpCircle className="w-5 h-5" />, label: '고객센터', desc: '자주 묻는 질문 및 문의', link: '#' },
        { icon: <LogOut className="w-5 h-5" />, label: '로그아웃', link: '#' },
        { icon: <UserX className="w-5 h-5 text-red-500" />, label: '회원탈퇴', link: '#', textClass: 'text-red-500' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl px-5 py-4 border-b border-white/5">
        <h1 className="text-xl font-black text-white tracking-tight">마이페이지</h1>
      </header>

      {/* Profile Section */}
      <section className="px-5 py-8 flex items-center gap-4 border-b border-white/5 bg-[#0a0a0a]">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 p-0.5">
          <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">{user.nickname}</h2>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </section>

      {/* Menus */}
      <div className="flex flex-col gap-2">
        {menuGroups.map((group, idx) => (
          <section key={idx} className="bg-[#0f0f0f] border-b border-white/5 py-4">
            <h3 className="px-5 text-[11px] font-bold text-primary-500 mb-2 uppercase tracking-wider">{group.title}</h3>
            <ul className="flex flex-col">
              {group.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Link 
                    to={item.link} 
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-gray-400 group-hover:text-primary-500 transition-colors ${item.textClass || ''}`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold text-white ${item.textClass || ''}`}>
                          {item.label}
                        </span>
                        {item.desc && (
                          <span className="text-[10px] text-gray-500">{item.desc}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-500 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
