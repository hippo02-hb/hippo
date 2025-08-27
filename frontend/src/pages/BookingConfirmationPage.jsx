import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, User, Phone, Mail, Download, ArrowLeft, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { bookingsAPI, handleAPIError, formatPrice, formatDate, formatTime } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import ImageWithFallback from '../components/ImageWithFallback';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getDetails(bookingId);
      setBookingDetails(response.data);
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể tải thông tin đặt vé'));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintTicket = () => { window.print(); };
  const handleDownloadTicket = () => { toast.success('Tính năng tải vé sẽ được cập nhật sớm!'); };

  const handleCancelBooking = async () => {
    if (!bookingDetails) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này?')) return;

    try {
      setCancelling(true);
      await bookingsAPI.cancel(bookingDetails.booking.id);
      toast.success('Đã hủy vé thành công');
      await loadBookingDetails();
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể hủy vé'));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) { return <LoadingSpinner message="Đang tải thông tin đặt vé..." />; }

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt vé</h2>
        <Button onClick={() => navigate('/')}>Về trang chủ</Button>
      </div>
    );
  }

  const { booking, movie, cinema, showtime } = bookingDetails;

  const StatusBadge = ({ status }) => {
    const map = { confirmed: 'bg-green-100 text-green-700 border-green-200', cancelled: 'bg-red-100 text-red-700 border-red-200' };
    const label = status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy';
    return <span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${map[status] || ''}`}>{label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Về trang chủ</Button>

        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt vé thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã chọn Galaxy Cinema. Vé của bạn đã được xác nhận.</p>
          <div className="mt-3"><StatusBadge status={booking.status} /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-orange-600"><Calendar className="h-5 w-5 mr-2" />Thông tin vé</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <ImageWithFallback src={movie.poster} alt={movie.title} label={movie.title} variant="poster" className="w-20 h-28 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{movie.title}</h3>
                  <p className="text-gray-600">{cinema.name}</p>
                  <p className="text-gray-600">{cinema.address}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><Calendar className="h-4 w-4 mr-2" />Ngày chiếu</span><span className="font-medium">{formatDate(showtime.date)}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><Clock className="h-4 w-4 mr-2" />Giờ chiếu</span><span className="font-medium">{formatTime(showtime.time)}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><MapPin className="h-4 w-4 mr-2" />Ghế</span><span className="font-medium">{booking.seats.join(', ')}</span></div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm text-orange-600 mb-1">Mã đặt vé</p>
                  <p className="text-2xl font-bold text-orange-800 tracking-wider">{booking.booking_code}</p>
                  <p className="text-xs text-gray-500 mt-2">Vui lòng xuất trình mã này tại quầy để nhận vé</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-orange-600"><User className="h-5 w-5 mr-2" />Thông tin khách hàng</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><User className="h-4 w-4 mr-2" />Họ tên</span><span className="font-medium">{booking.customer_name}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><Phone className="h-4 w-4 mr-2" />Điện thoại</span><span className="font-medium">{booking.customer_phone}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><Mail className="h-4 w-4 mr-2" />Email</span><span className="font-medium">{booking.customer_email}</span></div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-600">Chi tiết thanh toán</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Số lượng vé</span><span>{booking.seats.length} vé</span></div>
                <div className="flex justify-between"><span>Giá vé</span><span>{formatPrice(showtime.price)} / vé</span></div>
                <div className="flex justify-between"><span>Phương thức thanh toán</span><span className="capitalize">{booking.payment_method}</span></div>
                <div className="border-t pt-3"><div className="flex justify-between text-lg font-bold"><span>Tổng tiền</span><span className="text-orange-600">{formatPrice(booking.total_amount)}</span></div></div>
              </div>
            </Card>

            <div className="space-y-3">
              {booking.status === 'confirmed' && (
                <Button onClick={handleCancelBooking} disabled={cancelling} variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50"><XCircle className="h-4 w-4 mr-2" />{cancelling ? 'Đang hủy...' : 'Hủy vé'}</Button>
              )}
              <Button onClick={handlePrintTicket} className="w-full bg-orange-500 hover:bg-orange-600 text-white"><Download className="h-4 w-4 mr-2" />In vé</Button>
              <Button onClick={handleDownloadTicket} variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"><Download className="h-4 w-4 mr-2" />Tải vé về máy</Button>
            </div>
          </div>
        </div>

        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3">Lưu ý quan trọng:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Vui lòng có mặt tại rạp trước giờ chiếu 15 phút</li>
            <li>• Xuất trình mã đặt vé hoặc vé đã in tại quầy để nhận vé</li>
            <li>• Không được hoàn vé sau khi đã xác nhận đặt</li>
            <li>• Liên hệ hotline 1900 2224 nếu cần hỗ trợ</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;