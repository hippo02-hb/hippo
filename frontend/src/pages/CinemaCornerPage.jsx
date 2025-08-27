import React, { useEffect, useState } from 'react';
import { newsAPI, handleAPIError } from '../services/api';
import { Card } from '../components/ui/card';
import LoadingSpinner from '../components/LoadingSpinner';

const CinemaCornerPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await newsAPI.getNews();
        setArticles(res.data);
      } catch (e) {
        console.error(handleAPIError(e, 'Không thể tải bài viết'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Đang tải Góc điện ảnh..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Góc Điện Ảnh</h1>

        {articles.length === 0 ? (
          <Card className="p-6 text-gray-500">Hiện chưa có bài viết.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((item) => (
              <Card key={item.id} className="overflow-hidden flex">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-40 h-40 object-cover flex-shrink-0" />
                )}
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  {item.summary && (
                    <p className="text-gray-600 text-sm line-clamp-3">{item.summary}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemaCornerPage;