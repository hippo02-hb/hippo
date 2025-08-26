import React, { useState } from 'react';
import { Star, Play } from 'lucide-react';
import { Button } from './ui/button';
import { mockMovies } from '../data/mock';

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
      <div className="relative">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-80 object-cover"
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            onClick={(e) => {
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
          <p><span className="font-semibold">Thể loại:</span> {movie.genre}</p>
          <p><span className="font-semibold">Thời lượng:</span> {movie.duration}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">8.5</span>
          </div>
          
          {movie.status === 'showing' && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Đặt vé
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const MovieSection = () => {
  const [activeTab, setActiveTab] = useState('showing');

  const tabs = [
    { id: 'showing', label: 'Đang chiếu', count: mockMovies.filter(m => m.status === 'showing').length },
    { id: 'coming', label: 'Sắp chiếu', count: mockMovies.filter(m => m.status === 'coming').length },
    { id: 'imax', label: 'Phim IMAX', count: 3 },
    { id: 'all', label: 'Toàn quốc', count: mockMovies.length }
  ];

  const getFilteredMovies = () => {
    switch (activeTab) {
      case 'showing':
        return mockMovies.filter(movie => movie.status === 'showing');
      case 'coming':
        return mockMovies.filter(movie => movie.status === 'coming');
      case 'imax':
        return mockMovies.slice(0, 3); // Mock IMAX movies
      case 'all':
      default:
        return mockMovies;
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-orange-500 text-white px-4 py-2 rounded-l-lg font-bold text-lg">
              PHIM
            </div>
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {getFilteredMovies().map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="px-8">
            Xem thêm phim
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MovieSection;