import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Star, Play, MapPin, Users, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { moviesAPI, showtimesAPI, handleAPIError, formatPrice, formatTime } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showtimesLoading, setShowtimesLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadMovieDetails();
      loadShowtimes();
    }
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getById(id);
      setMovie(response.data);
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể tải thông tin phim'));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadShowtimes = async () => {
    try {
      setShowtimesLoading(true);
      const response = await showtimesAPI.getAll({ movie_id: id });
      setShowtimes(response.data);
    } catch (error) {
      toast.error('Không thể tải lịch chiếu');
    } finally {
      setShowtimesLoading(false);
    }
  };

  const openTrailer = () => {
    if (movie?.trailer) {
      window.open(movie.trailer, '_blank');
    }
  };

  const handleBooking = (showtimeId) => {
    navigate(`/booking/${showtimeId}`);
  };

  const groupShowtimesByDateAndCinema = () => {
    const grouped = {};
    
    showtimes.forEach(showtime => {
      const date = showtime.show_date;
      const cinema = showtime.cinema_name;
      
      if (!grouped[date]) {
        grouped[date] = {};
      }
      
      if (!grouped[date][cinema]) {
        grouped[date][cinema] = [];
      }
      
      grouped[date][cinema].push(showtime);
    });
    
    return grouped;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', { 
        weekday: 'long',
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải thông tin phim..." />;
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy phim</h2>
        <Button onClick={() => navigate('/')}>Về trang chủ</Button>
      </div>
    );
  }

  const groupedShowtimes = groupShowtimesByDateAndCinema();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.poster})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8 mt-16">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl"
            />
            
            <div className="text-white flex-1">
              <div className="mb-2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-bold mr-2">
                  {movie.rating}
                </span>
                <span className="text-orange-400">{movie.genre}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{movie.duration} phút</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400 fill-current" />
                  <span>8.5</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
              
              <p className="text-lg mb-6 leading-relaxed max-w-2xl">
                {movie.description}
              </p>
              
              <div className="flex space-x-4">
                {movie.status === 'showing' && (
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    Đặt vé ngay
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={openTrailer}
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Xem trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Movie Details */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Thông tin phim</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-600">Đạo diễn</h3>
                  <p>{movie.director}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Thể loại</h3>
                  <p>{movie.genre}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Thời lượng</h3>
                  <p>{movie.duration} phút</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Ngày khởi chiếu</h3>
                  <p>{new Date(movie.release_date).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              
              {movie.cast && movie.cast.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-600 mb-2">Diễn viên</h3>
                  <p>{movie.cast.join(', ')}</p>
                </div>
              )}
            </Card>

            {/* Showtimes */}
            {movie.status === 'showing' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Lịch chiếu</h2>
                
                {showtimesLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner message="Đang tải lịch chiếu..." />
                  </div>
                ) : Object.keys(groupedShowtimes).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Hiện tại chưa có lịch chiếu cho phim này
                  </p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedShowtimes).map(([date, cinemas]) => (
                      <div key={date}>
                        <h3 className="text-lg font-semibold mb-3 text-orange-600">
                          {formatDate(date)}
                        </h3>
                        
                        <div className="space-y-4">
                          {Object.entries(cinemas).map(([cinemaName, times]) => (
                            <div key={cinemaName} className="border rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                                <h4 className="font-medium">{cinemaName}</h4>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {times.map((showtime) => (
                                  <Button
                                    key={showtime.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBooking(showtime.id)}
                                    className="min-w-[80px] hover:bg-orange-50 hover:border-orange-500"
                                    disabled={showtime.available_seats === 0}
                                  >
                                    <div className="text-center">
                                      <div className="font-medium">
                                        {formatTime(showtime.show_time)}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatPrice(showtime.price)}
                                      </div>
                                      <div className="text-xs text-gray-400 flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        {showtime.available_seats}
                                      </div>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {movie.status === 'coming' && (
              <Card className="p-6 mb-6 bg-blue-50">
                <h3 className="text-lg font-bold mb-2 text-blue-800">Sắp chiếu</h3>
                <p className="text-blue-600 mb-4">
                  Phim sẽ được khởi chiếu vào {new Date(movie.release_date).toLocaleDateString('vi-VN')}
                </p>
                <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                  Đặt trước
                </Button>
              </Card>
            )}

            {/* Quick Book Widget */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Đặt vé nhanh</h3>
              <p className="text-gray-600 mb-4">
                Chọn suất chiếu phù hợp và đặt vé ngay!
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Giá vé từ:</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(80000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thời lượng:</span>
                  <span>{movie.duration} phút</span>
                </div>
                <div className="flex justify-between">
                  <span>Đánh giá:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>8.5/10</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;