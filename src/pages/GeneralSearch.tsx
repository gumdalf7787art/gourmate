import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Utensils, User, MapPin, Hash } from 'lucide-react';
import { MOCK_POSTS } from '@/data/mock';

type TabType = 'restaurant' | 'menu' | 'guide';

export function GeneralSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('restaurant');

  const TABS = [
    { id: 'restaurant', label: '식당', icon: MapPin },
    { id: 'menu', label: '메뉴', icon: Utensils },
    { id: 'guide', label: '가이드', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 pt-12 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              autoFocus
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-[#141414] border border-white/10 rounded-xl leading-5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium"
              placeholder={`${activeTab === 'restaurant' ? '어떤 식당' : activeTab === 'menu' ? '어떤 메뉴' : '어떤 가이드'}를 찾으시나요?`}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-[#141414] text-gray-500 hover:bg-[#1a1a1a]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Search Results (Placeholder / Mock) */}
      <main className="flex-1 p-5">
        {!keyword ? (
          <div className="space-y-8 pt-4">
            {/* Recent Searches / Popular Tags */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {['텐동', '오마카세', '신당동 맛집', '데이트 코스', '평양냉면'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setKeyword(tag)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0c0c0c] border border-white/5 rounded-full text-sm text-gray-300 hover:border-primary-500/50 transition-all"
                  >
                    <Hash className="w-3 h-3 text-primary-500" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Guides */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">추천 가이드</h3>
              <div className="space-y-3">
                {MOCK_POSTS.slice(0, 3).map((post) => (
                  <div key={post.guide.id} className="flex items-center justify-between p-4 bg-[#0c0c0c] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img src={post.guide.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-white">{post.guide.nickname}</p>
                        <p className="text-[11px] text-gray-500">신뢰지수 {post.guide.trustScore} • 포스트 24개</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-primary-500 text-white text-xs font-bold rounded-lg">팔로우</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 opacity-20" />
            </div>
            <p className="text-sm">'{keyword}'에 대한 검색 결과를 찾는 중입니다...</p>
          </div>
        )}
      </main>
    </div>
  );
}
