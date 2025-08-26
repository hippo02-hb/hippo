import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { mockHeroSlides } from '../data/mock';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockHeroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockHeroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockHeroSlides.length) % mockHeroSlides.length);
  };

  return (
    <section className="relative h-[500px] overflow-hidden bg-gray-900">
      {mockHeroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  {slide.title}
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-red-500 mb-4">
                  {slide.subtitle}
                </h2>
                <p className="text-lg text-white mb-8 font-semibold">
                  {slide.description}
                </p>
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg"
                >
                  {slide.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {mockHeroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Partner Logos - positioned at bottom right */}
      <div className="absolute bottom-4 right-4 flex space-x-4 z-20">
        <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=60&h=30&fit=crop" alt="Partner" className="h-8 opacity-80" />
        <img src="https://images.unsplash.com/photo-1611262588019-db6935269279?w=60&h=30&fit=crop" alt="Partner" className="h-8 opacity-80" />
        <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=60&h=30&fit=crop" alt="Partner" className="h-8 opacity-80" />
      </div>
    </section>
  );
};

export default HeroSection;