import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { PostDetail } from '@/pages/PostDetail';
import { GeneralSearch } from '@/pages/GeneralSearch';
import { SearchPlace } from '@/pages/SearchPlace';
import { RegisterPlace } from '@/pages/RegisterPlace';
import GuideProfile from '@/pages/GuideProfile';
import GuidePostList from '@/pages/GuidePostList';
import { PopularGuides } from './pages/PopularGuides';
import GuideCollectionList from './pages/GuideCollectionList';
import ThemeDetail from './pages/ThemeDetail';
import PopularRestaurants from './pages/PopularRestaurants';
import GlobalMap from './pages/GlobalMap';
import Wishlist from './pages/Wishlist';
import { Signup } from '@/pages/Signup';
import { Login } from '@/pages/Login';
import { MyPage } from '@/pages/MyPage';
import { ProfileSettings } from '@/pages/ProfileSettings';
import { MyPosts } from '@/pages/MyPosts';
import { EditPost } from '@/pages/EditPost';
import { FollowingList } from '@/pages/FollowingList';
import { Notifications } from '@/pages/Notifications';
import { MyThemes } from '@/pages/MyThemes';
import { ThemeEditor } from '@/pages/ThemeEditor';
import { Analytics } from '@/pages/Analytics';
import { AllComments } from '@/pages/AllComments';
import { Notice } from '@/pages/Notice';
import { CustomerCenter } from '@/pages/CustomerCenter';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminReports } from '@/pages/AdminReports';
import { AdminUsers } from '@/pages/AdminUsers';
import { AdminPosts } from '@/pages/AdminPosts';
import { AdminCampaigns } from '@/pages/AdminCampaigns';
import { BottomNav } from '@/components/BottomNav';

// 똑똑한 스크롤 관리 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // 뒤로 가기(POP)가 아닐 때만 최상단으로 스크롤
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[640px] w-full min-h-screen bg-black border-x border-white/10 relative shadow-2xl">
      {children}
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/guide/:id" element={<GuideProfile />} />
          <Route path="/guide/:id/posts" element={<GuidePostList />} />
          <Route path="/guide/:id/themes" element={<GuideCollectionList />} />
          <Route path="/popular-guides" element={<PopularGuides />} />
          <Route path="/theme/:id" element={<ThemeDetail />} />
          <Route path="/popular-restaurants" element={<PopularRestaurants />} />
          <Route path="/search" element={<GeneralSearch />} />
          <Route path="/register-place" element={<RegisterPlace />} />
          <Route path="/map" element={<GlobalMap />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/write" element={<SearchPlace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/my/settings" element={<ProfileSettings />} />
          <Route path="/my/posts" element={<MyPosts />} />
          <Route path="/my/posts/edit/:id" element={<EditPost />} />
          <Route path="/my/following" element={<FollowingList />} />
          <Route path="/my/notifications" element={<Notifications />} />
          <Route path="/my/themes" element={<MyThemes />} />
          <Route path="/my/themes/create" element={<ThemeEditor />} />
          <Route path="/my/themes/edit/:id" element={<ThemeEditor />} />
          <Route path="/my/analytics" element={<Analytics />} />
          <Route path="/my/analytics/comments" element={<AllComments />} />
          <Route path="/my/notice" element={<Notice />} />
          <Route path="/my/support" element={<CustomerCenter />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
