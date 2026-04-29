export type Guide = {
  id: string;
  nickname: string;
  profileImageUrl: string;
  trustScore: number;
};

export type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  openingHours?: string;
  tags?: string[];
};

export type Collection = {
  id: string;
  userId: string;
  title: string;
  thumbnail: string;
  likes: number;
  places: Place[];
};

export type Post = {
  id: string;
  guide: Guide;
  place: Place;
  content: string;
  images: string[];
  isPaidByMe: boolean;
  createdAt: string;
  likes: number;
  bookmarks: number;
  tags?: string[];
  rating: number;
};

export const MOCK_GUIDES: Guide[] = [
  { id: 'g1', nickname: '푸디트래블러', profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', trustScore: 98 },
  { id: 'g2', nickname: '미식탐험가', profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', trustScore: 92 },
  { id: 'g3', nickname: '동네미식가', profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', trustScore: 88 },
  { id: 'g4', nickname: '카페장인', profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', trustScore: 95 },
];

export const MOCK_PLACES: Place[] = [
  { 
    id: 'p1', 
    name: '명동교자', 
    category: '한식', 
    address: '서울 중구 명동10길 29', 
    latitude: 37.5627, 
    longitude: 126.9850,
    phone: '02-776-5348',
    openingHours: '10:30 - 21:00',
    tags: ['칼국수', '만두', '미쉐린가이드']
  },
  { 
    id: 'p2', 
    name: '오레노라멘', 
    category: '일식', 
    address: '서울 마포구 독막로6길 14', 
    latitude: 37.5486, 
    longitude: 126.9189,
    phone: '02-322-3539',
    openingHours: '11:00 - 21:00',
    tags: ['라멘', '합정맛집', '미쉐린가이드']
  },
  { 
    id: 'p3', 
    name: '몽탄', 
    category: '한식', 
    address: '서울 용산구 백범로99길 50', 
    latitude: 37.5342, 
    longitude: 126.9739,
    phone: '02-794-5992',
    openingHours: '12:00 - 21:00',
    tags: ['우대갈비', '짚불구이', '웨이팅맛집']
  },
  { 
    id: 'p4', 
    name: '다운타우너', 
    category: '양식', 
    address: '서울 강남구 도산대로53길 14', 
    latitude: 37.5252, 
    longitude: 127.0378,
    phone: '070-8806-3693',
    openingHours: '11:00 - 21:00',
    tags: ['수제버거', '청담맛집', '아보카도버거']
  },
  { 
    id: 'p5', 
    name: '진진', 
    category: '중식', 
    address: '서울 마포구 잔다리로 123', 
    latitude: 37.5552, 
    longitude: 126.9149,
    phone: '070-5035-8878',
    openingHours: '17:00 - 22:00',
    tags: ['멘보샤', '중식당', '미쉐린가이드']
  },
  {
    id: 'p6',
    name: '한일관',
    category: '한식',
    address: '서울 강남구 압구정로38길 14',
    latitude: 37.5268,
    longitude: 127.0345,
    phone: '02-732-3735',
    tags: ['불고기', '한정식', '백년가게']
  },
  {
    id: 'p7',
    name: '필동면옥',
    category: '한식',
    address: '서울 중구 서애로 26',
    latitude: 37.5602,
    longitude: 126.9972,
    phone: '02-2266-2611',
    tags: ['평양냉면', '미쉐린가이드', '필동맛집']
  },
  {
    id: 'p8',
    name: '우육미',
    category: '중식',
    address: '서울 중구 퇴계로 373',
    latitude: 37.5658,
    longitude: 127.0016,
    phone: '02-2233-1501',
    tags: ['우육면', 'DDP맛집', '딤섬']
  },
  {
    id: 'p9',
    name: '누데이크',
    category: '카페',
    address: '서울 강남구 압구정로46길 50',
    latitude: 37.5266,
    longitude: 127.0366,
    tags: ['디저트', '전시같은카페', '압구정핫플']
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: '서울 3대 텐동 맛집 투어',
    userId: 'gourmet_king',
    thumbnail: 'https://images.unsplash.com/photo-1615361413100-d1e3d368e539?w=800&q=80',
    likes: 1240,
    places: [MOCK_PLACES[0], MOCK_PLACES[1], MOCK_PLACES[2]],
  },
  {
    id: 'c2',
    title: '비 오는 날 가기 좋은 신당동 감성 카페',
    userId: 'cafe_tourer',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    likes: 856,
    places: [MOCK_PLACES[3], MOCK_PLACES[4]],
  },
  {
    id: 'c3',
    title: '부모님 모시고 가기 좋은 깔끔한 한정식',
    userId: 'family_food',
    thumbnail: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    likes: 2310,
    places: [MOCK_PLACES[5], MOCK_PLACES[6]],
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    guide: MOCK_GUIDES[0],
    place: MOCK_PLACES[2],
    content: '우대갈비는 역시 몽탄입니다. 웨이팅이 길지만 그럴 가치가 충분합니다. 육즙이 가득하고 부드러워요. 짚불 향이 입혀진 고기 맛은 다른 곳에서 경험하기 힘든 독보적인 맛입니다. 특히 양파볶음밥으로 마무리하는 거 잊지 마세요!',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1529692236671-f1f6e9481bfa?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: true,
    createdAt: '2026-04-28',
    likes: 1280,
    bookmarks: 450,
    tags: ['인생우대갈비', '웨이팅지옥', '용산핫플'],
    rating: 4.9,
  },
  {
    id: 'post4',
    guide: MOCK_GUIDES[1],
    place: MOCK_PLACES[2],
    content: '몽탄의 우대갈비는 단순한 고기 이상입니다. 입안 가득 퍼지는 훈연 향과 지방의 고소함이 조화롭습니다. 웨이팅 팁이라면 오픈 2시간 전에는 가야 안전합니다!',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: false,
    createdAt: '2026-04-25',
    likes: 890,
    bookmarks: 120,
    tags: ['줄서는식당', '고기장인', '짚불구이'],
    rating: 4.7,
  },
  {
    id: 'post2',
    guide: MOCK_GUIDES[1],
    place: MOCK_PLACES[1],
    content: '토리빠이탄 라멘의 정석. 진한 닭육수가 일품입니다. 거품이 있어 부드러운 목넘김이 특징입니다. 합정역 근처에서 라멘이 생각날 때 가장 먼저 떠오르는 곳이에요.',
    images: [
      'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591814468924-caf7f5823281?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: true,
    createdAt: '2026-04-27',
    likes: 850,
    bookmarks: 220,
    tags: ['라멘성지', '해장완료', '합정맛집'],
    rating: 4.7,
  },
  {
    id: 'post5',
    guide: MOCK_GUIDES[2],
    place: MOCK_PLACES[1],
    content: '닭육수 베이스의 뽀얀 국물이 정말 고소해요. 면도 직접 뽑아서 그런지 식감이 쫄깃하고 국물을 잘 머금고 있습니다. 미쉐린 가이드에 선정될 만한 훌륭한 맛입니다.',
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: true,
    createdAt: '2026-04-20',
    likes: 640,
    bookmarks: 85,
    tags: ['인생라멘', '미쉐린가이드', '합정역맛집'],
    rating: 4.8,
  },
  {
    id: 'post3',
    guide: MOCK_GUIDES[2],
    place: MOCK_PLACES[0],
    content: '언제 먹어도 맛있는 명동교자 마늘김치와 칼국수 조합. 밥까지 말어먹어야 완성입니다. 외국인 친구들에게도 추천하기 좋은 서울의 맛입니다.',
    images: [
      'https://images.unsplash.com/photo-1588168333986-5d6e2e0fb584?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: false,
    createdAt: '2026-04-26',
    likes: 2100,
    bookmarks: 780,
    tags: ['명동필수코스', '미쉐린맛집', '마늘김치중독'],
    rating: 4.5,
  },
  {
    id: 'post6',
    guide: MOCK_GUIDES[3],
    place: MOCK_PLACES[8],
    content: '검정색 케이크가 시선을 압도하는 곳입니다. 단순히 비주얼만 좋은 게 아니라 맛도 훌륭해요. 마이크로 와상을 곁들인 시그니처 음료는 꼭 드셔보시길 추천합니다.',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: true,
    createdAt: '2026-04-24',
    likes: 3200,
    bookmarks: 1540,
    tags: ['힙한카페', '디저트맛집', '압구정데이트'],
    rating: 4.6,
  },
  {
    id: 'post7',
    guide: MOCK_GUIDES[0],
    place: MOCK_PLACES[3],
    content: '아보카도 버거의 창시자 같은 느낌? 번이 정말 쫄깃하고 패티의 육향이 진합니다. 함께 나오는 갈릭 버터 프라이즈는 멈출 수 없는 맛이에요.',
    images: [
      'https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: true,
    createdAt: '2026-04-22',
    likes: 1560,
    bookmarks: 420,
    tags: ['수제버거맛집', '아보카도버거', '청담핫플'],
    rating: 4.8,
  },
  {
    id: 'post8',
    guide: MOCK_GUIDES[1],
    place: MOCK_PLACES[5],
    content: '대통령의 맛집으로도 유명한 곳이죠. 불고기가 정말 부드럽고 양념이 과하지 않아 질리지 않습니다. 어르신들 모시고 오면 실패 없는 곳입니다.',
    images: [
      'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&q=80&w=800'
    ],
    isPaidByMe: false,
    createdAt: '2026-04-18',
    likes: 920,
    bookmarks: 180,
    tags: ['압구정불고기', '전통맛집', '효도코스'],
    rating: 4.9,
  }
];
