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
  }
};
