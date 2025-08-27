import React from 'react';
import HeroSection from '../components/HeroSection';
import BookingWidget from '../components/BookingWidget';
import StatsStrip from '../components/StatsStrip';
import MovieCarousel from '../components/MovieCarousel';
import WhyGalaxy from '../components/WhyGalaxy';
import PromoSection from '../components/PromoSection';
import NewsSection from '../components/NewsSection';

const HomePage = () => {
  return (
    <div>
      {/* 1) Hero */}
      <HeroSection />

      {/* 2) Stats */}
      <StatsStrip />

      {/* 3) Why Galaxy */}
      <WhyGalaxy />

      {/* 4) Movies - Đang chiếu */}
      <MovieCarousel title="Đang chiếu" status="showing" />

      {/* 5) Movies - Sắp chiếu */}
      <MovieCarousel title="Sắp chiếu" status="coming" />

      {/* 6) Promo */}
      <PromoSection />

      {/* 7) News */}
      <NewsSection />

      {/* 8) Booking at bottom for deeper scroll from CTA */}
      <div id="booking">
        <BookingWidget />
      </div>
    </div>
  );
};

export default HomePage;