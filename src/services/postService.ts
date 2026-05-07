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
  phone?: string;
  is_paid?: boolean | number;
  isPaid?: boolean | number;
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
    return apiFetch(`/themes/${id}`);
  },

  async updateTheme(id: string, data: any) {
    return apiFetch(`/themes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteTheme(id: string) {
    return apiFetch(`/themes/${id}`, {
      method: 'DELETE',
    });
  },

  async getAnalytics(userId: string) {
    return apiFetch(`/analytics?userId=${userId}`);
  },

  // Bookmark (Wishlist) functions
  async getBookmarks(userId: string) {
    return apiFetch(`/user/bookmarks?userId=${userId}`);
  },

  async checkBookmark(userId: string, postId: string) {
    return apiFetch(`/user/bookmarks?userId=${userId}&postId=${postId}`);
  },

  async addBookmark(userId: string, postId: string) {
    return apiFetch('/user/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ userId, postId })
    });
  },

  async removeBookmark(userId: string, postId: string) {
    return apiFetch(`/user/bookmarks?userId=${userId}&postId=${postId}`, {
      method: 'DELETE'
    });
  },

  // Like functions
  async checkLike(userId: string, postId: string) {
    return apiFetch(`/user/likes?userId=${userId}&postId=${postId}`);
  },

  async addLike(userId: string, postId: string) {
    return apiFetch('/user/likes', {
      method: 'POST',
      body: JSON.stringify({ userId, postId })
    });
  },

  async removeLike(userId: string, postId: string) {
    return apiFetch(`/user/likes?userId=${userId}&postId=${postId}`, {
      method: 'DELETE'
    });
  },

  // Follow functions
  async checkFollow(followerId: string, followingId: string) {
    return apiFetch(`/user/follow?followerId=${followerId}&followingId=${followingId}`);
  },

  async addFollow(followerId: string, followingId: string) {
    return apiFetch('/user/follow', {
      method: 'POST',
      body: JSON.stringify({ followerId, followingId })
    });
  },

  async removeFollow(followerId: string, followingId: string) {
    return apiFetch(`/user/follow?followerId=${followerId}&followingId=${followingId}`, {
      method: 'DELETE'
    });
  },

  async getFollowedGuides(userId: string) {
    return apiFetch(`/user/follow?followerId=${userId}`);
  },

  // User Map functions
  async getUserMaps(userId: string) {
    return apiFetch(`/user/maps?userId=${userId}`);
  },

  async createUserMap(userId: string, name: string) {
    return apiFetch('/user/maps', {
      method: 'POST',
      body: JSON.stringify({ action: 'create_map', userId, name })
    });
  },

  async deleteUserMap(mapId: string) {
    return apiFetch(`/user/maps?action=delete_map&mapId=${mapId}`, {
      method: 'DELETE'
    });
  },

  async getMapItems(userId: string, mapId: string) {
    return apiFetch(`/user/maps?userId=${userId}&mapId=${mapId}`);
  },

  async addToMap(mapId: string, postId: string) {
    return apiFetch('/user/maps', {
      method: 'POST',
      body: JSON.stringify({ action: 'add_item', mapId, postId })
    });
  },

  async removeFromMap(mapId: string, postId: string) {
    return apiFetch(`/user/maps?action=remove_item&mapId=${mapId}&postId=${postId}`, {
      method: 'DELETE'
    });
  }
};
