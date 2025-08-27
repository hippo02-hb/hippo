import React, { useEffect, useState } from 'react';
import { newsAPI, handleAPIError } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await newsAPI.getPromotions();
        setEvents(res.data);
      } catch (e) {
        console.error(handleAPIError(e, 'Không thể tải sự kiện'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Đang tải sự kiện..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Sự kiện & Khuyến mãi</h1>

        {events.length === 0 ? (
          <Card className="p-6 text-gray-500">Hiện chưa có sự kiện nào.</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  {item.summary && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{item.summary}</p>
                  )}
                  <div className="text-xs text-gray-400 mb-3">{item.publish_date ? new Date(item.publish_date).toLocaleDateString('vi-VN') : ''}</div>
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">Chi tiết</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;