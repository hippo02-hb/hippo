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
      <HeroSection />
      <StatsStrip />
      <div id="booking">
        <BookingWidget />
      </div>
      <MovieCarousel title="Đang chiếu" status="showing" />
      <MovieCarousel title="Sắp chiếu" status="coming" />
      <WhyGalaxy />
      <PromoSection />
      <NewsSection />
    </div>
  );
};

export default HomePage;