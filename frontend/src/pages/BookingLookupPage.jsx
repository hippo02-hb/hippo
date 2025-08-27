import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, XCircle, ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { bookingsAPI, handleAPIError, formatDate, formatTime, formatPrice } from '../services/api';
import toast from 'react-hot-toast';

const BookingLookupPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setLoading(true);
      const bookingRes = await bookingsAPI.getByCode(code.trim());
      const id = bookingRes.data.id;
      const detailsRes = await bookingsAPI.getDetails(id);
      setDetails(detailsRes.data);
      toast.success('Tìm thấy thông tin đặt vé');
    } catch (error) {
      setDetails(null);
      toast.error(handleAPIError(error, 'Không tìm thấy vé với mã này'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!details) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này?')) return;

    try {
      setCancelling(true);
      await bookingsAPI.cancel(details.booking.id);
      const refreshed = await bookingsAPI.getDetails(details.booking.id);
      setDetails(refreshed.data);
      toast.success('Đã hủy vé thành công');
    } catch (error) {
      toast.error(handleAPIError(error, 'Không thể hủy vé'));
    } finally {
      setCancelling(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const map = {
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    const label = status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy';
    return <span className={`inline-block px-2 py-1 rounded border text-xs font-semibold ${map[status] || ''}`}>{label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Về trang chủ
        </Button>

        <h1 className="text-3xl font-bold mb-4">Tra cứu vé</h1>
        <p className="text-gray-600 mb-6">Nhập mã đặt vé (ví dụ: GCXXXXXXXX) để xem chi tiết vé của bạn.</p>

        <form onSubmit={handleLookup} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Nhập mã đặt vé"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="pl-9"
              />
            </div>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? 'Đang tra cứu...' : 'Tra cứu'}
            </Button>
          </div>
        </form>

        {!details ? (
          <Card className="p-6">
            <p className="text-gray-500">Nhập mã đặt vé để xem thông tin chi tiết.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">Thông tin vé</h2>
                  <div className="mt-2"><StatusBadge status={details.booking.status} /></div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Mã đặt vé</div>
                  <div className="text-2xl font-bold text-orange-600">{details.booking.booking_code}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex space-x-4">
                  <img src={details.movie.poster} alt={details.movie.title} className="w-20 h-28 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{details.movie.title}</div>
                    <div className="text-gray-600">{details.cinema.name}</div>
                    <div className="text-gray-600">{details.cinema.address}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600"><Calendar className="h-4 w-4 mr-2" /> Ngày chiếu</span>
                    <span className="font-medium">{formatDate(details.showtime.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600"><Clock className="h-4 w-4 mr-2" /> Giờ chiếu</span>
                    <span className="font-medium">{formatTime(details.showtime.time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600"><MapPin className="h-4 w-4 mr-2" /> Ghế</span>
                    <span className="font-medium">{details.booking.seats.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-sm text-gray-500 mb-2">Thông tin khách hàng</div>
                  <div className="flex items-center justify-between"><span className="flex items-center text-gray-600"><User className="h-4 w-4 mr-2" /> Họ tên</span><span className="font-medium">{details.booking.customer_name}</span></div>
                  <div className="flex items-center justify-between mt-2"><span className="flex items-center text-gray-600"><Phone className="h-4 w-4 mr-2" /> Điện thoại</span><span className="font-medium">{details.booking.customer_phone}</span></div>
                  <div className="flex items-center justify-between mt-2"><span className="flex items-center text-gray-600"><Mail className="h-4 w-4 mr-2" /> Email</span><span className="font-medium">{details.booking.customer_email}</span></div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-sm text-gray-500 mb-2">Thanh toán</div>
                  <div className="flex items-center justify-between"><span>Phương thức</span><span className="capitalize">{details.booking.payment_method}</span></div>
                  <div className="flex items-center justify-between mt-2"><span>Số vé</span><span>{details.booking.seats.length} vé</span></div>
                  <div className="flex items-center justify-between mt-2"><span>Giá vé</span><span>{formatPrice(details.showtime.price)} / vé</span></div>
                  <div className="border-t mt-3 pt-3 flex items-center justify-between text-lg font-bold"><span>Tổng tiền</span><span className="text-orange-600">{formatPrice(details.booking.total_amount)}</span></div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                {details.booking.status === 'confirmed' && (
                  <Button onClick={handleCancelBooking} disabled={cancelling} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" /> {cancelling ? 'Đang hủy...' : 'Hủy vé'}
                  </Button>
                )}
                <Button onClick={() => window.print()} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Download className="h-4 w-4 mr-2" /> In vé
                </Button>
                <Button onClick={() => toast.success('Tính năng tải vé sẽ có sớm!')} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  <Download className="h-4 w-4 mr-2" /> Tải vé về máy
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLookupPage;