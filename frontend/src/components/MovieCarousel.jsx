import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { Button } from './ui/button';
import { moviesAPI, handleAPIError } from '../services/api';
import ImageWithFallback from './ImageWithFallback';
import { Link, useNavigate } from 'react-router-dom';

const MovieCarousel = ({ title = 'Phim', status = 'showing' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (status === 'showing') res = await moviesAPI.getShowing();
      else if (status === 'coming') res = await moviesAPI.getComing();
      else res = await moviesAPI.getAll();
      setMovies(res.data || []);
    } catch (e) {
      setError(handleAPIError(e, 'Không thể tải phim'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [status]);

  const scrollBy = (delta) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const openTrailer = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) window.open(url, '_blank');
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scrollBy(-600)} aria-label="Trước">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scrollBy(600)} aria-label="Sau">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div ref={scrollerRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-thumb-gray-300">
            {loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[220px] flex-shrink-0 bg-white rounded-lg shadow animate-pulse h-[360px]" />
              ))
            )}

            {!loading && error && (
              <div className="text-red-600">{error}</div>
            )}

            {!loading && !error && movies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="w-[220px] flex-shrink-0 snap-start group">
                <div className="relative bg-white rounded-lg shadow overflow-hidden">
                  <ImageWithFallback src={movie.poster} alt={movie.title} label={movie.title} variant="poster" className="w-full h-[300px] object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={(e) => openTrailer(e, movie.trailer)}>
                      <Play className="h-4 w-4 mr-1" /> Trailer
                    </Button>
                  </div>
                </div>
                <div className="px-1 pt-2">
                  <div className="font-semibold text-sm line-clamp-2 group-hover:text-orange-600">{movie.title}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1">8.5</span>
                    <span className="mx-2">•</span>
                    <span>{movie.duration ? `${movie.duration}p` : '-'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile arrows overlay */}
          <div className="md:hidden flex justify-between items-center absolute inset-y-1/3 left-0 right-0 px-2 pointer-events-none">
            <button onClick={() => scrollBy(-280)} className="pointer-events-auto rounded-full bg-white/80 p-1 shadow">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scrollBy(280)} className="pointer-events-auto rounded-full bg-white/80 p-1 shadow">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* See more */}
        {!loading && movies.length > 0 && (
          <div className="text-right mt-3">
            <Button variant="link" onClick={() => navigate(status === 'coming' ? '/search?status=coming' : '/search?status=showing')} className="text-orange-600">
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieCarousel;