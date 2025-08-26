import React from 'react';
import HeroSection from '../components/HeroSection';
import BookingWidget from '../components/BookingWidget';
import MovieSection from '../components/MovieSection';
import PromoSection from '../components/PromoSection';
import NewsSection from '../components/NewsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <BookingWidget />
      <MovieSection />
      <PromoSection />
      <NewsSection />
    </div>
  );
};

export default HomePage;