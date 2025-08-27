import React, { useEffect, useState } from 'react';
import { cinemasAPI, handleAPIError } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';

const CinemasPricingPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [screensCache, setScreensCache] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await cinemasAPI.getAll();
        setCinemas(res.data);
      } catch (e) {
        console.error(handleAPIError(e, 'Không thể tải danh sách rạp'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleScreens = async (cinemaId) => {
    setExpanded((prev) => ({ ...prev, [cinemaId]: !prev[cinemaId] }));
    if (!screensCache[cinemaId]) {
      try {
        const res = await cinemasAPI.getScreens(cinemaId);
        setScreensCache((prev) => ({ ...prev, [cinemaId]: res.data }));
      } catch (e) {
        console.error(handleAPIError(e, 'Không thể tải phòng chiếu'));
      }
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải rạp/Giá vé..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Rạp / Giá vé</h1>
        <p className="text-gray-600 mb-6">Danh sách rạp và thông tin phòng chiếu tham khảo (giá vé có thể thay đổi theo suất chiếu và loại phòng).</p>

        {cinemas.length === 0 ? (
          <Card className="p-6 text-gray-500">Hiện chưa có dữ liệu rạp.</Card>
        ) : (
          <div className="space-y-4">
            {cinemas.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <div className="text-gray-600">{c.address}</div>
                    <div className="text-gray-500 text-sm">{c.province}</div>
                  </div>
                  <Button variant="outline" onClick={() => toggleScreens(c.id)}>
                    {expanded[c.id] ? 'Ẩn phòng chiếu' : 'Xem phòng chiếu'}
                  </Button>
                </div>

                {expanded[c.id] && (
                  <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(screensCache[c.id] || []).map((s) => (
                      <div key={s.id} className="bg-gray-50 rounded p-3">
                        <div className="font-medium">Phòng {s.screen_number} - {s.screen_type}</div>
                        <div className="text-sm text-gray-600">Số ghế: {s.total_seats}</div>
                      </div>
                    ))}
                    {(screensCache[c.id] || []).length === 0 && (
                      <div className="text-gray-500">Chưa có dữ liệu phòng chiếu.</div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemasPricingPage;