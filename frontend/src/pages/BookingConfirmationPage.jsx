import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, User, Phone, Mail, Download, ArrowLeft, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { bookingsAPI, handleAPIError, formatPrice, formatDate, formatTime } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

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

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    toast.success('Tính năng tải vé sẽ được cập nhật sớm!');
  };

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

  if (loading) {
    return &lt;LoadingSpinner message="Đang tải thông tin đặt vé..." /&gt;;
  }

  if (!bookingDetails) {
    return (
      &lt;div className="container mx-auto px-4 py-8 text-center"&gt;
        &lt;h2 className="text-2xl font-bold mb-4"&gt;Không tìm thấy thông tin đặt vé&lt;/h2&gt;
        &lt;Button onClick={() =&gt; navigate('/')}&gt;Về trang chủ&lt;/Button&gt;
      &lt;/div&gt;
    );
  }

  const { booking, movie, cinema, showtime } = bookingDetails;

  const StatusBadge = ({ status }) =&gt; {
    const map = {
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    const label = status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy';
    return &lt;span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${map[status] || ''}`}&gt;{label}&lt;/span&gt;;
  };

  return (
    &lt;div className="min-h-screen bg-gray-50 py-8"&gt;
      &lt;div className="container mx-auto px-4 max-w-4xl"&gt;
        &lt;Button
          onClick={() =&gt; navigate('/')}
          variant="ghost"
          className="mb-6"
        &gt;
          &lt;ArrowLeft className="h-4 w-4 mr-2" /&gt;
          Về trang chủ
        &lt;/Button&gt;

        {/* Success Header */}
        &lt;div className="text-center mb-8"&gt;
          &lt;CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" /&gt;
          &lt;h1 className="text-3xl font-bold text-gray-800 mb-2"&gt;
            Đặt vé thành công!
          &lt;/h1&gt;
          &lt;p className="text-gray-600"&gt;
            Cảm ơn bạn đã chọn Galaxy Cinema. Vé của bạn đã được xác nhận.
          &lt;/p&gt;
          &lt;div className="mt-3"&gt;
            &lt;StatusBadge status={booking.status} /&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-8"&gt;
          {/* Ticket Details */}
          &lt;Card className="p-6"&gt;
            &lt;h2 className="text-xl font-bold mb-4 flex items-center text-orange-600"&gt;
              &lt;Calendar className="h-5 w-5 mr-2" /&gt;
              Thông tin vé
            &lt;/h2&gt;
            
            &lt;div className="space-y-4"&gt;
              {/* Movie Info */}
              &lt;div className="flex space-x-4"&gt;
                &lt;img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded"
                /&gt;
                &lt;div className="flex-1"&gt;
                  &lt;h3 className="font-bold text-lg"&gt;{movie.title}&lt;/h3&gt;
                  &lt;p className="text-gray-600"&gt;{cinema.name}&lt;/p&gt;
                  &lt;p className="text-gray-600"&gt;{cinema.address}&lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;

              {/* Showtime Details */}
              &lt;div className="bg-gray-50 rounded-lg p-4 space-y-2"&gt;
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;span className="flex items-center text-gray-600"&gt;
                    &lt;Calendar className="h-4 w-4 mr-2" /&gt;
                    Ngày chiếu
                  &lt;/span&gt;
                  &lt;span className="font-medium"&gt;
                    {formatDate(showtime.date)}
                  &lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;span className="flex items-center text-gray-600"&gt;
                    &lt;Clock className="h-4 w-4 mr-2" /&gt;
                    Giờ chiếu
                  &lt;/span&gt;
                  &lt;span className="font-medium"&gt;
                    {formatTime(showtime.time)}
                  &lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;span className="flex items-center text-gray-600"&gt;
                    &lt;MapPin className="h-4 w-4 mr-2" /&gt;
                    Ghế
                  &lt;/span&gt;
                  &lt;span className="font-medium"&gt;
                    {booking.seats.join(', ')}
                  &lt;/span&gt;
                &lt;/div&gt;
              &lt;/div&gt;

              {/* Booking Code */}
              &lt;div className="bg-orange-50 border border-orange-200 rounded-lg p-4"&gt;
                &lt;div className="text-center"&gt;
                  &lt;p className="text-sm text-orange-600 mb-1"&gt;Mã đặt vé&lt;/p&gt;
                  &lt;p className="text-2xl font-bold text-orange-800 tracking-wider"&gt;
                    {booking.booking_code}
                  &lt;/p&gt;
                  &lt;p className="text-xs text-gray-500 mt-2"&gt;
                    Vui lòng xuất trình mã này tại quầy để nhận vé
                  &lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/Card&gt;

          {/* Customer &amp; Payment Info */}
          &lt;div className="space-y-6"&gt;
            {/* Customer Details */}
            &lt;Card className="p-6"&gt;
              &lt;h2 className="text-xl font-bold mb-4 flex items-center text-orange-600"&gt;
                &lt;User className="h-5 w-5 mr-2" /&gt;
                Thông tin khách hàng
              &lt;/h2&gt;
              
              &lt;div className="space-y-3"&gt;
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;span className="flex items-center text-gray-600"&gt;
                    &lt;User className="h-4 w-4 mr-2" /&gt;
                    Họ tên
                  &lt;/span&gt;
                  &lt;span className="font-medium"&gt;{booking.customer_name}&lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;span className="flex items-center text-gray-600"&gt;
                    &lt;Phone className="h-4 w-4 mr-2" /&gt;
                    Điện thoại
                  &lt;/span&gt;
                  &lt;span className="font-medium"&gt;{booking.customer_phone}&lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;span className="flex items-center text-gray-600"&gt;
                    &lt;Mail className="h-4 w-4 mr-2" /&gt;
                    Email
                  &lt;/span&gt;
                  &lt;span className="font-medium"&gt;{booking.customer_email}&lt;/span&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/Card&gt;

            {/* Payment Summary */}
            &lt;Card className="p-6"&gt;
              &lt;h2 className="text-xl font-bold mb-4 text-orange-600"&gt;
                Chi tiết thanh toán
              &lt;/h2&gt;
              
              &lt;div className="space-y-3"&gt;
                &lt;div className="flex justify-between"&gt;
                  &lt;span&gt;Số lượng vé&lt;/span&gt;
                  &lt;span&gt;{booking.seats.length} vé&lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex justify-between"&gt;
                  &lt;span&gt;Giá vé&lt;/span&gt;
                  &lt;span&gt;{formatPrice(showtime.price)} / vé&lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex justify-between"&gt;
                  &lt;span&gt;Phương thức thanh toán&lt;/span&gt;
                  &lt;span className="capitalize"&gt;{booking.payment_method}&lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="border-t pt-3"&gt;
                  &lt;div className="flex justify-between text-lg font-bold"&gt;
                    &lt;span&gt;Tổng tiền&lt;/span&gt;
                    &lt;span className="text-orange-600"&gt;
                      {formatPrice(booking.total_amount)}
                    &lt;/span&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/Card&gt;

            {/* Action Buttons */}
            &lt;div className="space-y-3"&gt;
              {booking.status === 'confirmed' &amp;&amp; (
                &lt;Button 
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  variant="outline"
                  className="w-full border-red-500 text-red-600 hover:bg-red-50"
                &gt;
                  &lt;XCircle className="h-4 w-4 mr-2" /&gt;
                  {cancelling ? 'Đang hủy...' : 'Hủy vé'}
                &lt;/Button&gt;
              )}

              &lt;Button 
                onClick={handlePrintTicket}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              &gt;
                &lt;Download className="h-4 w-4 mr-2" /&gt;
                In vé
              &lt;/Button&gt;
              
              &lt;Button 
                onClick={handleDownloadTicket}
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
              &gt;
                &lt;Download className="h-4 w-4 mr-2" /&gt;
                Tải vé về máy
              &lt;/Button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Important Notes */}
        &lt;Card className="mt-8 p-6 bg-blue-50 border-blue-200"&gt;
          &lt;h3 className="font-bold text-blue-800 mb-3"&gt;Lưu ý quan trọng:&lt;/h3&gt;
          &lt;ul className="text-blue-700 text-sm space-y-1"&gt;
            &lt;li&gt;• Vui lòng có mặt tại rạp trước giờ chiếu 15 phút&lt;/li&gt;
            &lt;li&gt;• Xuất trình mã đặt vé hoặc vé đã in tại quầy để nhận vé&lt;/li&gt;
            &lt;li&gt;• Không được hoàn vé sau khi đã xác nhận đặt&lt;/li&gt;
            &lt;li&gt;• Liên hệ hotline 1900 2224 nếu cần hỗ trợ&lt;/li&gt;
          &lt;/ul&gt;
        &lt;/Card&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default BookingConfirmationPage;