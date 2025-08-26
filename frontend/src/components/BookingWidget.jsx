import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockMovies, mockCinemas, mockShowtimes } from '../data/mock';

const BookingWidget = () => {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Generate next 7 days for date selection
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : date.toLocaleDateString('vi-VN', { 
          weekday: 'short', 
          day: '2-digit',
          month: '2-digit'
        })
      });
    }
    return dates;
  };

  // Get available showtimes based on selections
  const getAvailableShowtimes = () => {
    if (!selectedMovie || !selectedCinema || !selectedDate) return [];
    
    const showtime = mockShowtimes.find(
      s => s.movieId === parseInt(selectedMovie) && 
           s.cinemaId === parseInt(selectedCinema) && 
           s.date === selectedDate
    );
    
    return showtime ? showtime.times : [];
  };

  const handleBooking = () => {
    if (selectedMovie && selectedCinema && selectedDate && selectedTime) {
      alert(`Đặt vé thành công!\nPhim: ${mockMovies.find(m => m.id === parseInt(selectedMovie))?.title}\nRạp: ${mockCinemas.find(c => c.id === parseInt(selectedCinema))?.name}\nNgày: ${selectedDate}\nSuất: ${selectedTime}`);
    } else {
      alert('Vui lòng chọn đầy đủ thông tin!');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg mx-4 -mt-12 relative z-30 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        {/* Movie Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-600">
            <Film className="h-4 w-4 mr-2 text-orange-500" />
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">1</span>
            <span className="ml-2">Chọn Phim</span>
          </label>
          <Select value={selectedMovie} onValueChange={setSelectedMovie}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phim muốn xem" />
            </SelectTrigger>
            <SelectContent>
              {mockMovies.filter(movie => movie.status === 'showing').map((movie) => (
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
          <Select value={selectedCinema} onValueChange={setSelectedCinema}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn rạp chiếu" />
            </SelectTrigger>
            <SelectContent>
              {mockCinemas.map((cinema) => (
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
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn ngày xem" />
            </SelectTrigger>
            <SelectContent>
              {generateDates().map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
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
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn suất chiếu" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableShowtimes().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10"
          >
            Mua vé nhanh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;