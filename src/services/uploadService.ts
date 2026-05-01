import { API_BASE } from './api';

export const uploadService = {
  async uploadImage(file: File): Promise<{ success: boolean; url: string; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
        // apiFetch를 사용하지 않는 이유는 Content-Type: application/json 헤더가 자동 추가되기 때문입니다.
        // FormData를 보낼 때는 브라우저가 자동으로 Boundary가 포함된 multipart/form-data를 설정하게 해야 합니다.
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '이미지 업로드에 실패했습니다.');
      }

      return data;
    } catch (err: any) {
      console.error('Upload error:', err);
      return { success: false, url: '', error: err.message };
    }
  }
};
