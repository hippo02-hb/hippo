import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, User, Phone, Mail } from 'lucide-react';
import { bookingsAPI, showtimesAPI, handleAPIError, formatPrice, formatDate, formatTime } from '../services/api';
import toast from 'react-hot-toast';

const SeatSelection = ({ showtimeId, showtimeDetails = null, onBookingComplete, onBack }) => {
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    paymentMethod: 'cash'
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showtimeId) {
      loadShowtime();
    }
  }, [showtimeId]);

  const loadShowtime = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await showtimesAPI.getById(showtimeId);
      setShowtime(response.data);
    } catch (err) {
      setError(handleAPIError(err, 'Không thể tải thông tin suất chiếu'));
    } finally {
      setLoading(false);
    }
  };

  // Generate seat layout (simplified)
  const generateSeatLayout = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats = [];

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const isBooked = showtime?.booked_seats?.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        seats.push({ id: seatId, row, number: i, isBooked, isSelected, isAisle: i === 3 || i === 9 });
      }
    });

    return seats;
  };

  const handleSeatClick = (seatId) => {
    if (showtime?.booked_seats?.includes(seatId)) return;
    setSelectedSeats(prev => prev.includes(seatId)
      ? prev.filter(id => id !== seatId)
      : (prev.length < 8 ? [...prev, seatId] : prev)
    );
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    return selectedSeats.length * parseFloat(showtime?.price || 0);
  };

  const validateForm = () => {
    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ghế');
      return false;
    }
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    try {
      setBooking(true);
      setError(null);

      const bookingData = {
        showtime_id: showtimeId,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        seats: selectedSeats,
        total_amount: calculateTotal(),
        payment_method: customerInfo.paymentMethod
      };

      const response = await bookingsAPI.create(bookingData);
      toast.success(`Đặt vé thành công! Mã: ${response.data.booking_code}`);

      if (onBookingComplete) onBookingComplete(response.data);
    } catch (err) {
      setError(handleAPIError(err, 'Không thể đặt vé'));
      toast.error(handleAPIError(err, 'Không thể đặt vé'));
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2">Đang tải thông tin suất chiếu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Button onClick={onBack} variant="outline">Quay lại</Button>
      </div>
    );
  }

  if (!showtime) return null;

  const seats = generateSeatLayout();

  const movieTitle = showtimeDetails?.movie?.title || '';
  const cinemaName = showtimeDetails?.cinema?.name || '';

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4">← Quay lại</Button>
        <h2 className="text-2xl font-bold mb-2">Chọn ghế</h2>
        <div className="text-gray-600">
          <p>{movieTitle}</p>
          <p>{formatDate(showtime.show_date)} - {formatTime(showtime.show_time)}</p>
          <p>{cinemaName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="bg-gray-300 text-center py-2 rounded text-sm font-medium mb-6">MÀN HÌNH</div>
          </div>

          {/* Seat Legend */}
          <div className="flex justify-center space-x-6 mb-6 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 rounded mr-2"></div><span>Trống</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-orange-500 rounded mr-2"></div><span>Đã chọn</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded mr-2"></div><span>Đã đặt</span></div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
              <div key={row} className="flex justify-center items-center space-x-1">
                <span className="w-6 text-center text-sm font-medium">{row}</span>
                {seats.filter(seat => seat.row === row).map(seat => (
                  <React.Fragment key={seat.id}>
                    <button
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                        seat.isBooked ? 'bg-red-500 text-white cursor-not-allowed' :
                        seat.isSelected ? 'bg-orange-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={seat.isBooked}
                    >
                      {seat.number}
                    </button>
                    {seat.isAisle && <div className="w-4"></div>}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Thông tin đặt vé</h3>

          {/* Selected Seats */}
          <div className="mb-4">
            <Label>Ghế đã chọn</Label>
            <div className="mt-1 p-2 bg-white rounded border">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn ghế nào'}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name">Họ tên *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="name" type="text" placeholder="Nhập họ tên" value={customerInfo.name} onChange={(e) => handleInputChange('name', e.target.value)} className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="phone" type="tel" placeholder="Nhập số điện thoại" value={customerInfo.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Nhập email" value={customerInfo.email} onChange={(e) => handleInputChange('email', e.target.value)} className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="payment">Phương thức thanh toán</Label>
              <select id="payment" value={customerInfo.paymentMethod} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="cash">Tiền mặt</option>
                <option value="card">Thẻ tín dụng</option>
                <option value="banking">Chuyển khoản</option>
              </select>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Tổng tiền:</span>
              <span className="text-orange-500">{formatPrice(calculateTotal())}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{selectedSeats.length} ghế × {formatPrice(showtime.price)}</p>
          </div>

          {/* Book Button */}
          <Button onClick={handleBooking} disabled={selectedSeats.length === 0 || booking} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3">
            {booking ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" />Đang xử lý...</>) : 'Xác nhận đặt vé'}
          </Button>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;