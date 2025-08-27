import React from 'react';
import { Popcorn, ShieldCheck, Clock, Crown } from 'lucide-react';

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center mb-3">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

const WhyGalaxy = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-orange-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Vì sao chọn Galaxy?</h2>
          <p className="text-gray-600 mt-2">Trải nghiệm điện ảnh đỉnh cao với dịch vụ tận tâm</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Feature icon={Crown} title="Mạng lưới rộng" desc="Hệ thống rạp phủ khắp, vị trí thuận tiện." />
          <Feature icon={ShieldCheck} title="Chuẩn quốc tế" desc="Phòng chiếu hiện đại, âm thanh sống động." />
          <Feature icon={Clock} title="Lịch chiếu dày" desc="Nhiều khung giờ phù hợp lịch trình của bạn." />
          <Feature icon={Popcorn} title="Ưu đãi hấp dẫn" desc="Combo bắp nước và chương trình thành viên." />
        </div>
      </div>
    </section>
  );
};

export default WhyGalaxy;