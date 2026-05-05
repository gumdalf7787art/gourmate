import { apiFetch } from './api';

export interface PostData {
  guide_id: string;
  restaurant_name: string;
  address: string;
  category: string;
  content: string;
  rating: number;
  images: string[];
  tags: string[];
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
  }
};
