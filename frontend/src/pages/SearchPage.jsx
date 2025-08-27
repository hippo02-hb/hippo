import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { moviesAPI, cinemasAPI, handleAPIError } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer group" onClick={handleViewDetails}>
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.style.opacity = 0; }}
        />
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
          {movie.rating || 'T13'}
        </div>
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
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-semibold">Thể loại:</span> {movie.genre || 'Đang cập nhật'}</p>
          <p><span className="font-semibold">Thời lượng:</span> {movie.duration ? `${movie.duration} phút` : '—'}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm font-medium">8.5</span>
          </div>
          {movie.status === 'showing' && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Đặt vé
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    status: searchParams.get('status') || '',
    genre: searchParams.get('genre') || '',
    cinema: searchParams.get('cinema') || ''
  });

  useEffect(() => {
    loadCinemas();
    if (filters.query || filters.status || filters.genre || filters.cinema) {
      searchMovies();
    } else {
      loadAllMovies();
    }
  }, []);

  const loadAllMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAll();
      setMovies(response.data || []);
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể tải danh sách phim'));
    } finally {
      setLoading(false);
    }
  };

  const loadCinemas = async () => {
    try {
      const response = await cinemasAPI.getAll();
      setCinemas(response.data || []);
    } catch (error) {
      console.error('Error loading cinemas:', error);
    }
  };

  const searchMovies = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filters.status) {
        response = await moviesAPI.getAll(filters.status);
      } else {
        response = await moviesAPI.getAll();
      }
      
      let filteredMovies = response.data || [];
      
      // Client-side filtering for search query and genre (null-safe)
      const q = (filters.query || '').toLowerCase();
      if (q) {
        filteredMovies = filteredMovies.filter((movie) => {
          const title = (movie.title || '').toLowerCase();
          const genre = (movie.genre || '').toLowerCase();
          const director = (movie.director || '').toLowerCase();
          return (
            title.includes(q) ||
            genre.includes(q) ||
            director.includes(q)
          );
        });
      }
      
      if (filters.genre) {
        filteredMovies = filteredMovies.filter((movie) =>
          (movie.genre || '').toLowerCase().includes(filters.genre.toLowerCase())
        );
      }
      
      setMovies(filteredMovies);
      
      // Update URL params
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.status) params.set('status', filters.status);
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.cinema) params.set('cinema', filters.cinema);
      setSearchParams(params);
      
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể tìm kiếm phim'));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies();
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      status: '',
      genre: '',
      cinema: ''
    });
    setSearchParams({});
    loadAllMovies();
  };

  const genres = [
    'Hành Động', 'Hoạt Hình', 'Phiêu Lưu', 'Khoa Học Viễn Tưởng',
    'Drama', 'Hình Sự', 'Thriller', 'Kinh Dị', 'Hài', 'Lãng Mạn'
  ];

  const hasActiveFilters = filters.query || filters.status || filters.genre || filters.cinema;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tìm kiếm phim</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm phim, thể loại, đạo diễn..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </form>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value="showing">Đang chiếu</SelectItem>
                    <SelectItem value="coming">Sắp chiếu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Thể loại</label>
                <Select value={filters.genre} onValueChange={(value) => handleFilterChange('genre', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rạp chiếu</label>
                <Select value={filters.cinema} onValueChange={(value) => handleFilterChange('cinema', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {cinemas.map((cinema) => (
                      <SelectItem key={cinema.id} value={cinema.id.toString()}>
                        {cinema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={searchMovies}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Áp dụng bộ lọc
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Kết quả tìm kiếm ({movies.length} phim)
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner message="Đang tìm kiếm phim..." />
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy phim nào</h3>
              <p className="text-gray-600 mb-4">
                Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
              </p>
              <Button onClick={clearFilters} variant="outline">
                Xem tất cả phim
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;