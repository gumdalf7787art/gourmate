import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '@/services/postService';

export default function ThemeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemeDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await postService.getTheme(id);
        if (res.success) {
          setTheme(res.data);
        } else {
          setError(res.error || '테마를 불러오지 못했습니다.');
        }
      } catch (err: any) {
        setError(err.message || '네트워크 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemeDetail();
  }, [id]);

  if (isLoading) {
    return <div className="p-20 text-white">Loading... {id}</div>;
  }

  if (error || !theme) {
    return <div className="p-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-4">{theme.title}</h1>
      <p className="mb-8">{theme.description}</p>
      <div className="space-y-4">
        {theme.posts?.map((post: any) => (
          <div key={post.id} className="p-4 border border-white/10 rounded-xl">
            <h3 className="font-bold">{post.restaurant_name}</h3>
            <p className="text-sm text-gray-500">{post.address}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(-1)} className="mt-8 px-4 py-2 bg-white text-black rounded">Back</button>
    </div>
  );
}
