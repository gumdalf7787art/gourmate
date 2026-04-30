// Mock Data for Gourmate
// 목업 데이터를 모두 제거하고 빈 배열로 초기화합니다.
// 실제 백엔드(D1) 연동 후 이 파일은 삭제될 예정입니다.

// ===== Type Definitions =====
export interface Guide {
  id: string;
  nickname: string;
  profileImageUrl: string;
  bio?: string;
  trustScore: number;
  isOfficial?: boolean;
  followers?: number;
  trustMetrics?: {
    paidRatio: number;
    contentQuality: number;
    communityScore: number;
    activityIndex: number;
  };
}

export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  lat?: number;
  lng?: number;
}

export interface Post {
  id: string;
  guide: Guide;
  place: Place;
  content: string;
  images: string[];
  likes: number;
  tags?: string[];
  createdAt?: string;
}

export interface Collection {
  id: string;
  userId: string;
  title: string;
  description?: string;
  thumbnail: string;
  places: Place[];
  likes?: number;
  keywords?: string[];
}

// ===== Empty Data Arrays =====
export const MOCK_POSTS: Post[] = [];
export const MOCK_COLLECTIONS: Collection[] = [];
export const MOCK_GUIDES: Guide[] = [];
export const MOCK_USERS: any[] = [];
