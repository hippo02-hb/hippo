import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Film, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { moviesAPI, cinemasAPI, showtimesAPI, formatTime } from '../services/api';
import { useNavigate } from 'react-router-dom';

const BookingWidget = () => {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();
  
  // Data states
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  
  // Loading states
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Load initial data
  useEffect(() => {
    loadMovies();
    loadCinemas();
  }, []);

  const loadMovies = async () => {
    try {
      setLoadingMovies(true);
      const response = await moviesAPI.getShowing();
      setMovies(response.data);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoadingMovies(false);
    }
  };

  const loadCinemas = async () => {
    try {
      setLoadingCinemas(true);
      const response = await cinemasAPI.getAll();
      setCinemas(response.data);
    } catch (error) {
      console.error('Error loading cinemas:', error);
    } finally {
      setLoadingCinemas(false);
    }
  };

  // Load available dates when movie or cinema changes
  useEffect(() => {
    if (selectedMovie || selectedCinema) {
      loadAvailableDates();
    } else {
      setAvailableDates([]);
    }
    // Reset dependent selections
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
  }, [selectedMovie, selectedCinema]);

  const loadAvailableDates = async () => {
    try {
      setLoadingDates(true);
      const response = await showtimesAPI.getAvailableDates(
        selectedMovie || null,
        selectedCinema || null
      );
      setAvailableDates(response.data.dates);
    } catch (error) {
      console.error('Error loading dates:', error);
      setAvailableDates([]);
    } finally {
      setLoadingDates(false);
    }
  };

  // Load available times when date changes
  useEffect(() => {
    if (selectedMovie && selectedCinema && selectedDate) {
      loadAvailableTimes();
    } else {
      setAvailableTimes([]);
    }
    setSelectedTime('');
  }, [selectedDate]);

  const loadAvailableTimes = async () => {
    try {
      setLoadingTimes(true);
      const response = await showtimesAPI.getAvailableTimes(
        selectedMovie,
        selectedCinema,
        selectedDate
      );
      setAvailableTimes(response.data.times);
    } catch (error) {
      console.error('Error loading times:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  // Format dates for display
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', { 
        weekday: 'short', 
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const handleBooking = () => {
    if (selectedMovie && selectedCinema && selectedDate && selectedTime) {
      const timeInfo = availableTimes.find(t => t.time === selectedTime);
      if (timeInfo && timeInfo.showtime_id) {
        navigate(`/booking/${timeInfo.showtime_id}`);
      } else {
        alert('Không tìm thấy suất chiếu phù hợp, vui lòng thử lại.');
      }
    } else {
      alert('Vui lòng chọn đầy đủ thông tin!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Movie Selection */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              <Film className="h-4 w-4 mr-2 text-orange-500" />
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">1</span>
              <span className="ml-2">Chọn Phim</span>
            </label>
            <Select value={selectedMovie} onValueChange={setSelectedMovie} disabled={loadingMovies}>
              <SelectTrigger>
                <SelectValue placeholder={loadingMovies ? 'Đang tải...' : 'Chọn phim muốn xem'} />
              </SelectTrigger>
              <SelectContent>
                {movies.map((movie) => (
                  <SelectItem key={movie.id} value={movie.id.toString()}>
                    {movie.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cinema Selection */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-orange-500" />
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">2</span>
              <span className="ml-2">Chọn Rạp</span>
            </label>
            <Select value={selectedCinema} onValueChange={setSelectedCinema} disabled={loadingCinemas}>
              <SelectTrigger>
                <SelectValue placeholder={loadingCinemas ? 'Đang tải...' : 'Chọn rạp chiếu'} />
              </SelectTrigger>
              <SelectContent>
                {cinemas.map((cinema) => (
                  <SelectItem key={cinema.id} value={cinema.id.toString()}>
                    {cinema.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-orange-500" />
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">3</span>
              <span className="ml-2">Chọn Ngày</span>
            </label>
            <Select value={selectedDate} onValueChange={setSelectedDate} disabled={loadingDates || availableDates.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingDates ? 'Đang tải...' : 
                  availableDates.length === 0 ? 'Chọn phim/rạp trước' : 
                  'Chọn ngày xem'
                } />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {formatDateForDisplay(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">4</span>
              <span className="ml-2">Chọn Suất</span>
            </label>
            <Select value={selectedTime} onValueChange={setSelectedTime} disabled={loadingTimes || availableTimes.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingTimes ? 'Đang tải...' :
                  availableTimes.length === 0 ? 'Chọn ngày trước' :
                  'Chọn suất chiếu'
                } />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((timeInfo) => (
                  <SelectItem key={timeInfo.time} value={timeInfo.time}>
                    {formatTime(timeInfo.time)} ({timeInfo.available_seats} ghế trống)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Book Button */}
          <div className="space-y-2">
            <div className="h-6"></div>
            <Button 
              onClick={handleBooking}
              size="lg" 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold h-10 shadow"
              disabled={!selectedMovie || !selectedCinema || !selectedDate || !selectedTime}
            >
              {(loadingMovies || loadingCinemas || loadingDates || loadingTimes) ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Mua vé nhanh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;