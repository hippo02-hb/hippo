import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { moviesAPI, handleAPIError } from '../services/api';
import toast from 'react-hot-toast';
import ImageWithFallback from './ImageWithFallback';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  const openTrailer = (trailerUrl) => {
    window.open(trailerUrl, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="relative">
          <ImageWithFallback 
            src={movie.poster}
            alt={movie.title}
            label={movie.title}
            variant="poster"
            className="w-full h-80 object-cover"
          />
          
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openTrailer(movie.trailer);
              }}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Play className="h-5 w-5 mr-2" />
              Xem Trailer
            </Button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
            {movie.rating}
          </div>

          {/* Status Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
            movie.status === 'showing' 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {movie.status === 'showing' ? 'Đang chiếu' : 'Sắp chiếu'}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {movie.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Thể loại:</span> {movie.genre || 'Đang cập nhật'}</p>
            <p><span className="font-semibold">Thời lượng:</span> {movie.duration ? `${movie.duration} phút` : '—'}</p>
            <p><span className="font-semibold">Đạo diễn:</span> {movie.director || '—'}</p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">8.5</span>
            </div>
            
            {movie.status === 'showing' && (
              <Button 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                Đặt vé
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const MovieSection = () => {
  const [activeTab, setActiveTab] = useState('showing');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'showing', label: 'Đang chiếu', count: 0 },
    { id: 'coming', label: 'Sắp chiếu', count: 0 },
    { id: 'imax', label: 'Phim IMAX', count: 0 },
    { id: 'all', label: 'Toàn quốc', count: 0 }
  ];

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      switch (activeTab) {
        case 'showing':
          response = await moviesAPI.getShowing();
          break;
        case 'coming':
          response = await moviesAPI.getComing();
          break;
        case 'imax':
          response = await moviesAPI.getAll();
          break;
        case 'all':
        default:
          response = await moviesAPI.getAll();
          break;
      }
      
      setMovies(response.data || []);
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Không thể tải danh sách phim');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  const getTabCount = (tabId) => {
    switch (tabId) {
      case 'showing':
        return movies.filter(m => m.status === 'showing').length;
      case 'coming':
        return movies.filter(m => m.status === 'coming').length;
      case 'imax':
        return Math.min(3, movies.length);
      case 'all':
        return movies.length;
      default:
        return 0;
    }
  };

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
            <Button 
              onClick={fetchMovies} 
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-l-lg font-bold text-lg">PHIM</div>
            <div className="bg-gray-200 h-12 w-2"></div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap space-x-0 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-500 bg-white'
                    : 'border-transparent text-gray-600 hover:text-orange-500'
                }`}
              >
                {tab.label} ({getTabCount(tab.id)})
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Đang tải phim...</span>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {movies.length > 0 && (
              <div className="text-center mt-8">
                <Link to="/search">
                  <Button variant="outline" size="lg" className="px-8">Xem thêm phim</Button>
                </Link>
              </div>
            )}

            {movies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không có phim nào trong danh mục này.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MovieSection;