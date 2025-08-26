import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { moviesAPI, handleAPIError } from '../services/api';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedMovies();
  }, []);

  const loadFeaturedMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getShowing();
      // Use first 3 showing movies for hero slider
      setMovies(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured movies:', error);
      // Fallback to empty array to prevent crashes
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length]);

  const nextSlide = () => {
    if (movies.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }
  };

  const prevSlide = () => {
    if (movies.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    }
  };

  const openTrailer = (trailerUrl) => {
    window.open(trailerUrl, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative h-[500px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải phim đặc sắc...</p>
        </div>
      </section>
    );
  }

  // Fallback when no movies available
  if (movies.length === 0) {
    return (
      <section className="relative h-[500px] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              GALAXY CINEMA
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Trải nghiệm điện ảnh đỉnh cao
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 text-lg">
              Khám phá ngay
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[500px] overflow-hidden bg-gray-900">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${movie.poster})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div className="text-sm text-orange-400 mb-2 font-semibold">
                  {movie.genre}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                  {movie.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold">
                    {movie.rating}
                  </span>
                  <span className="text-gray-300">{movie.duration} phút</span>
                </div>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed line-clamp-3">
                  {movie.description}
                </p>
                <div className="flex space-x-4">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg"
                  >
                    ĐẶT VÉ NGAY
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3"
                    onClick={() => openTrailer(movie.trailer)}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Trailer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
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
        </>
      )}

      {/* Slide Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

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