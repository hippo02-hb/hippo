import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import SeatSelection from '../components/SeatSelection';
import LoadingSpinner from '../components/LoadingSpinner';
import { showtimesAPI, moviesAPI, cinemasAPI, handleAPIError } from '../services/api';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [cinema, setCinema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showtimeId) {
      loadBookingData();
    }
  }, [showtimeId]);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      const showtimeResponse = await showtimesAPI.getById(showtimeId);
      const showtimeData = showtimeResponse.data;
      setShowtime(showtimeData);
      const [movieResponse, cinemaResponse] = await Promise.all([
        moviesAPI.getById(showtimeData.movie_id),
        cinemasAPI.getById(showtimeData.cinema_id)
      ]);
      setMovie(movieResponse.data);
      setCinema(cinemaResponse.data);
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể tải thông tin đặt vé'));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = (bookingData) => {
    toast.success('Đặt vé thành công!');
    navigate(`/booking-confirmation/${bookingData.id}`);
  };

  const handleBack = () => {
    if (movie) navigate(`/movie/${movie.id}`);
    else navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải thông tin đặt vé..." />;
  }

  if (!showtime || !movie || !cinema) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt vé</h2>
        <Button onClick={() => navigate('/')}>Về trang chủ</Button>
      </div>
    );
  }

  const showtimeWithDetails = { ...showtime, movie, cinema };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <SeatSelection
          showtimeId={showtimeId}
          showtimeDetails={showtimeWithDetails}
          onBookingComplete={handleBookingComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default BookingPage;