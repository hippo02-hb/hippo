import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Film, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { moviesAPI, cinemasAPI, showtimesAPI, handleAPIError, formatTime } from '../services/api';
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
    if (selectedMovie &amp;&amp; selectedCinema &amp;&amp; selectedDate) {
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
  const formatDateForDisplay = (dateStr) =&gt; {
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

  const handleBooking = () =&gt; {
    if (selectedMovie &amp;&amp; selectedCinema &amp;&amp; selectedDate &amp;&amp; selectedTime) {
      const timeInfo = availableTimes.find(t =&gt; t.time === selectedTime);
      if (timeInfo &amp;&amp; timeInfo.showtime_id) {
        navigate(`/booking/${timeInfo.showtime_id}`);
      } else {
        alert('Không tìm thấy suất chiếu phù hợp, vui lòng thử lại.');
      }
    } else {
      alert('Vui lòng chọn đầy đủ thông tin!');
    }
  };

  return (
    &lt;div className="bg-white shadow-lg rounded-lg mx-4 -mt-12 relative z-30 p-6"&gt;
      &lt;div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"&gt;
        {/* Movie Selection */}
        &lt;div className="space-y-2"&gt;
          &lt;label className="flex items-center text-sm font-medium text-gray-600"&gt;
            &lt;Film className="h-4 w-4 mr-2 text-orange-500" /&gt;
            &lt;span className="bg-orange-500 text-white px-2 py-1 rounded text-xs"&gt;1&lt;/span&gt;
            &lt;span className="ml-2"&gt;Chọn Phim&lt;/span&gt;
          &lt;/label&gt;
          &lt;Select value={selectedMovie} onValueChange={setSelectedMovie} disabled={loadingMovies}&gt;
            &lt;SelectTrigger&gt;
              &lt;SelectValue placeholder={loadingMovies ? "Đang tải..." : "Chọn phim muốn xem"} /&gt;
            &lt;/SelectTrigger&gt;
            &lt;SelectContent&gt;
              {movies.map((movie) =&gt; (
                &lt;SelectItem key={movie.id} value={movie.id.toString()}&gt;
                  {movie.title}
                &lt;/SelectItem&gt;
              ))}
            &lt;/SelectContent&gt;
          &lt;/Select&gt;
        &lt;/div&gt;

        {/* Cinema Selection */}
        &lt;div className="space-y-2"&gt;
          &lt;label className="flex items-center text-sm font-medium text-gray-600"&gt;
            &lt;MapPin className="h-4 w-4 mr-2 text-orange-500" /&gt;
            &lt;span className="bg-orange-500 text-white px-2 py-1 rounded text-xs"&gt;2&lt;/span&gt;
            &lt;span className="ml-2"&gt;Chọn Rạp&lt;/span&gt;
          &lt;/label&gt;
          &lt;Select value={selectedCinema} onValueChange={setSelectedCinema} disabled={loadingCinemas}&gt;
            &lt;SelectTrigger&gt;
              &lt;SelectValue placeholder={loadingCinemas ? "Đang tải..." : "Chọn rạp chiếu"} /&gt;
            &lt;/SelectTrigger&gt;
            &lt;SelectContent&gt;
              {cinemas.map((cinema) =&gt; (
                &lt;SelectItem key={cinema.id} value={cinema.id.toString()}&gt;
                  {cinema.name}
                &lt;/SelectItem&gt;
              ))}
            &lt;/SelectContent&gt;
          &lt;/Select&gt;
        &lt;/div&gt;

        {/* Date Selection */}
        &lt;div className="space-y-2"&gt;
          &lt;label className="flex items-center text-sm font-medium text-gray-600"&gt;
            &lt;Calendar className="h-4 w-4 mr-2 text-orange-500" /&gt;
            &lt;span className="bg-orange-500 text-white px-2 py-1 rounded text-xs"&gt;3&lt;/span&gt;
            &lt;span className="ml-2"&gt;Chọn Ngày&lt;/span&gt;
          &lt;/label&gt;
          &lt;Select value={selectedDate} onValueChange={setSelectedDate} disabled={loadingDates || availableDates.length === 0}&gt;
            &lt;SelectTrigger&gt;
              &lt;SelectValue placeholder={
                loadingDates ? "Đang tải..." : 
                availableDates.length === 0 ? "Chọn phim/rạp trước" : 
                "Chọn ngày xem"
              } /&gt;
            &lt;/SelectTrigger&gt;
            &lt;SelectContent&gt;
              {availableDates.map((date) =&gt; (
                &lt;SelectItem key={date} value={date}&gt;
                  {formatDateForDisplay(date)}
                &lt;/SelectItem&gt;
              ))}
            &lt;/SelectContent&gt;
          &lt;/Select&gt;
        &lt;/div&gt;

        {/* Time Selection */}
        &lt;div className="space-y-2"&gt;
          &lt;label className="flex items-center text-sm font-medium text-gray-600"&gt;
            &lt;Clock className="h-4 w-4 mr-2 text-orange-500" /&gt;
            &lt;span className="bg-orange-500 text-white px-2 py-1 rounded text-xs"&gt;4&lt;/span&gt;
            &lt;span className="ml-2"&gt;Chọn Suất&lt;/span&gt;
          &lt;/label&gt;
          &lt;Select value={selectedTime} onValueChange={setSelectedTime} disabled={loadingTimes || availableTimes.length === 0}&gt;
            &lt;SelectTrigger&gt;
              &lt;SelectValue placeholder={
                loadingTimes ? "Đang tải..." :
                availableTimes.length === 0 ? "Chọn ngày trước" :
                "Chọn suất chiếu"
              } /&gt;
            &lt;/SelectTrigger&gt;
            &lt;SelectContent&gt;
              {availableTimes.map((timeInfo) =&gt; (
                &lt;SelectItem key={timeInfo.time} value={timeInfo.time}&gt;
                  {formatTime(timeInfo.time)} ({timeInfo.available_seats} ghế trống)
                &lt;/SelectItem&gt;
              ))}
            &lt;/SelectContent&gt;
          &lt;/Select&gt;
        &lt;/div&gt;

        {/* Book Button */}
        &lt;div className="space-y-2"&gt;
          &lt;div className="h-6"&gt;&lt;/div&gt;
          &lt;Button 
            onClick={handleBooking}
            size="lg" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10"
            disabled={!selectedMovie || !selectedCinema || !selectedDate || !selectedTime}
          &gt;
            {loadingMovies || loadingCinemas || loadingDates || loadingTimes ? (
              &lt;Loader2 className="h-4 w-4 animate-spin mr-2" /&gt;
            ) : null}
            Mua vé nhanh
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default BookingWidget;