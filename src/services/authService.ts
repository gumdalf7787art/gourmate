import { apiFetch } from './api';

export const authService = {
  async signup(data: any) {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: any) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSettings(data: any) {
    return apiFetch('/user/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyPassword(data: any) {
    return apiFetch('/user/verify-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
