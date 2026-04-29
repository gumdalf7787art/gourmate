import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { BottomNav } from '@/components/BottomNav';

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
          <Route path="/write" element={<SearchPlace />} />
          <Route path="/my" element={<div className="p-8 pb-24 text-center text-white">마이 페이지 준비중</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
