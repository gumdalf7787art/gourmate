import { apiFetch } from './api';

export interface PostData {
  id?: string;
  guide_id: string;
  restaurant_name: string;
  address: string;
  category: string;
  content: string;
  review?: string;
  rating: number;
  images: string[];
  tags: string[];
  editor_mode?: 'simple' | 'story';
  story_blocks?: any[];
  menu_items?: any[];
  latitude?: number | string;
  longitude?: number | string;
}

export const postService = {
  async getPosts() {
    return apiFetch('/posts');
  },

  async createPost(data: PostData) {
    return apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getUserPosts(userId: string) {
    return apiFetch(`/posts/user?userId=${userId}`);
  },

  async getPost(id: string) {
    return apiFetch(`/posts/detail?id=${id}`);
  },

  async updatePost(id: string, data: Partial<PostData>) {
    return apiFetch(`/posts/detail?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deletePost(id: string) {
    return apiFetch(`/posts/detail?id=${id}`, {
      method: 'DELETE',
    });
  },

  async getReviews(postId: string) {
    return apiFetch(`/posts/reviews?postId=${postId}`);
  },

  async addReview(data: { post_id: string; user_id: string; content: string; parent_id?: string }) {
    return apiFetch('/posts/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getGuideProfile(id: string) {
    return apiFetch(`/guide/profile?id=${id}`);
  },

  async search(keyword: string) {
    return apiFetch(`/search?q=${encodeURIComponent(keyword)}`);
  },

  async updateTop20(guideId: string, top20Ids: string[]) {
    return apiFetch('/guide/top20', {
      method: 'POST',
      body: JSON.stringify({ guideId, top20Ids })
    });
  },

  async createTheme(data: any) {
    return apiFetch('/themes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getThemes(guideId?: string) {
    return apiFetch(`/themes${guideId ? `?guideId=${guideId}` : ''}`);
  },

  async getTheme(id: string) {
    return apiFetch(`/themes/detail?id=${id}`);
  },

  async updateTheme(id: string, data: any) {
    return apiFetch(`/themes/detail?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteTheme(id: string) {
    return apiFetch(`/themes/detail?id=${id}`, {
      method: 'DELETE',
    });
  }
};
