import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { moviesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadFeaturedMovies(); }, []);

  const loadFeaturedMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getShowing();
      setMovies((response.data || []).slice(0, 3));
    } catch (error) {
      setMovies([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % movies.length), 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % movies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);

  const smoothScrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else navigate('/search?status=showing');
  };

  const openTrailer = (trailerUrl) => trailerUrl && window.open(trailerUrl, '_blank');

  if (loading) {
    return (
      <section className="relative h-[560px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải phim đặc sắc...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[560px] overflow-hidden">
      {/* Decorative shapes */}
      <div className="pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-amber-300 rounded-full blur-3xl opacity-30" />
      </div>

      {(movies && movies.length > 0) ? movies.map((movie, index) => (
        <div key={movie.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          {/* Background */}
          <div className="absolute inset-0">
            {movie.poster ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${movie.poster})` }} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
            )}
            <div className="absolute inset-0 bg-black/55" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div className="text-sm text-orange-400 mb-2 font-semibold">{movie.genre || '—'}</div>
                <h1 className="text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow">{movie.title}</h1>
                <p className="text-lg text-gray-200 mb-6 leading-relaxed line-clamp-3">{movie.description || ''}</p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8" onClick={smoothScrollToBooking}>
                    Đặt vé ngay
                  </Button>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 px-6" onClick={() => openTrailer(movie.trailer)}>
                    <Play className="h-5 w-5 mr-2" /> Trailer
                  </Button>
                  <Button variant="ghost" size="lg" className="text-white/80 hover:text-white" onClick={() => navigate('/search?status=showing')}>
                    Xem phim đang chiếu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
      )}

      {/* Arrows */}
      {movies.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-20">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-20">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {movies.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;