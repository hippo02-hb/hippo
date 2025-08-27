import React from 'react';
import { Film, Building2, CalendarClock, Smile } from 'lucide-react';

const StatItem = ({ icon: Icon, label, value, sub }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow-sm">
    <div className="p-2.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="text-xl font-extrabold text-gray-800 tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  </div>
);

const StatsStrip = () => {
  return (
    <section className="relative -mt-10 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatItem icon={Building2} label="Cụm rạp" value="45+" sub="Toàn quốc" />
          <StatItem icon={CalendarClock} label="Suất chiếu/ngày" value="1.2K+" sub="Trung bình" />
          <StatItem icon={Smile} label="Khách hàng hài lòng" value="97%" sub="Đánh giá 5★" />
          <StatItem icon={Film} label="Phim đang chiếu" value="50+" sub="Liên tục cập nhật" />
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;