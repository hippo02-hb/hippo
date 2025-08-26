import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { newsAPI, handleAPIError } from '../services/api';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(news.publish_date).toLocaleDateString('vi-VN')}
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {news.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {news.summary}
        </p>
        
        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 p-0">
          Xem chi tiết
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (err) {
      setError(handleAPIError(err, 'Không thể tải tin tức'));
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
            <Button 
              onClick={loadNews} 
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-l-lg font-bold text-lg">
              TIN TỨC & KHUYẾN MÃI
            </div>
            <div className="bg-gray-200 h-12 w-2"></div>
          </div>
          
          <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50">
            Xem tất cả
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Đang tải tin tức...</span>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
            
            {/* Promotional CTA Card */}
            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-6 flex flex-col justify-center items-center text-center">
              <div className="bg-orange-500 text-white rounded-full p-4 mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Ưu Đãi Thành Viên G-Star
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Đăng ký ngay để nhận được các ưu đãi độc quyền
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Tham gia ngay
              </Button>
            </div>
          </div>
        )}

        {/* No news message */}
        {!loading && news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Hiện tại chưa có tin tức mới.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;