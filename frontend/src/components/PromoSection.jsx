import React from 'react';
import { Gift, Percent, Star, Calendar } from 'lucide-react';
import { Button } from './ui/button';

const PromoCard = ({ icon: Icon, title, description, discount, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}>
      <div className={`${textColor} mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-20 mb-4 group-hover:bg-opacity-30 transition-all`}>
        <Icon className="h-8 w-8" />
      </div>
      
      <h3 className={`${textColor} font-bold text-lg mb-2`}>
        {title}
      </h3>
      
      <p className={`${textColor} text-sm opacity-90 mb-4 leading-relaxed`}>
        {description}
      </p>
      
      {discount && (
        <div className={`${textColor} text-2xl font-bold mb-4`}>
          {discount}
        </div>
      )}
      
      <Button variant="ghost" size="sm" className={`${textColor} border border-current hover:bg-white hover:text-gray-800 transition-all`}>
        Chi tiết
      </Button>
    </div>
  );
};

const PromoSection = () => {
  const promotions = [
    {
      icon: Percent,
      title: 'Giảm 50% Thứ 2',
      description: 'Giảm giá 50% cho tất cả các suất chiếu vào thứ 2 hằng tuần',
      discount: '50% OFF',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-600',
      textColor: 'text-white'
    },
    {
      icon: Star,
      title: 'Thành Viên G-Star',
      description: 'Tích điểm và nhận ưu đãi độc quyền dành cho thành viên VIP',
      discount: 'VIP',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      textColor: 'text-white'
    },
    {
      icon: Gift,
      title: 'Combo Ưu Đãi',
      description: 'Combo bắp nước giảm giá khi mua cùng vé xem phim',
      discount: '30% OFF',
      bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600',
      textColor: 'text-white'
    },
    {
      icon: Calendar,
      title: 'Early Bird',
      description: 'Đặt vé sớm cho các bộ phim sắp chiếu với giá ưu đãi',
      discount: 'SỚM',
      bgColor: 'bg-gradient-to-br from-blue-500 to-teal-600',
      textColor: 'text-white'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-xl mb-4">
            <Gift className="h-6 w-6 mr-3" />
            KHUYẾN MÃI HOT
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá những ưu đãi đặc biệt và chương trình khuyến mãi hấp dẫn tại Galaxy Cinema
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo, index) => (
            <PromoCard key={index} {...promo} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Đăng Ký Nhận Thông Báo</h3>
            <p className="text-gray-600 mb-6">Nhận thông tin về các chương trình khuyến mãi và phim mới nhất</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input type="email" placeholder="Nhập email của bạn" className="flex-1 max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">Đăng Ký</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;