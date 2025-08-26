# Galaxy Cinema - Backend Integration Contracts (Neon PostgreSQL)

## 1. API Endpoints cần phát triển

### Movies API
- `GET /api/movies` - Lấy danh sách phim (có filter: status=showing/coming)
- `GET /api/movies/:id` - Lấy chi tiết phim
- `POST /api/movies` - Thêm phim mới (admin)
- `PUT /api/movies/:id` - Cập nhật phim (admin)

### Cinemas API  
- `GET /api/cinemas` - Lấy danh sách rạp
- `GET /api/cinemas/:id` - Lấy chi tiết rạp

### Showtimes API
- `GET /api/showtimes` - Lấy lịch chiếu (filter theo movieId, cinemaId, date)
- `POST /api/showtimes` - Thêm lịch chiếu (admin)

### Bookings API
- `POST /api/bookings` - Đặt vé
- `GET /api/bookings/:id` - Lấy thông tin đặt vé
- `GET /api/user/bookings` - Lấy lịch sử đặt vé của user

### News API
- `GET /api/news` - Lấy tin tức/khuyến mãi
- `GET /api/news/:id` - Lấy chi tiết tin tức

## 2. PostgreSQL Tables cần tạo

### Movie Model
```javascript
{
  _id: ObjectId,
  title: String,
  poster: String,
  rating: String, // T13, T16, T18, K
  genre: String,
  duration: Number, // phút
  status: String, // "showing", "coming", "stopped"
  trailer: String, // YouTube URL
  description: String,
  director: String,
  cast: [String],
  releaseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Cinema Model
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  province: String,
  screens: [{
    screenNumber: Number,
    type: String, // "2D", "3D", "IMAX"
    totalSeats: Number
  }],
  createdAt: Date
}
```

### Showtime Model
```javascript
{
  _id: ObjectId,
  movieId: ObjectId,
  cinemaId: ObjectId,
  screenNumber: Number,
  date: Date,
  time: String, // "10:00", "13:30"
  price: Number,
  availableSeats: Number,
  bookedSeats: [String], // ["A1", "A2", "B5"]
  createdAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  showtimeId: ObjectId,
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  seats: [String], // ["A1", "A2"]
  totalAmount: Number,
  bookingCode: String, // Mã đặt vé
  status: String, // "confirmed", "cancelled"
  paymentMethod: String,
  createdAt: Date
}
```

### News Model
```javascript
{
  _id: ObjectId,
  title: String,
  summary: String,
  content: String,
  image: String,
  category: String, // "news", "promotion"
  publishDate: Date,
  isActive: Boolean,
  createdAt: Date
}
```

## 3. Mock Data cần thay thế

### Trong `/app/frontend/src/data/mock.js`:
- `mockMovies` → API call tới `/api/movies`
- `mockCinemas` → API call tới `/api/cinemas`  
- `mockShowtimes` → API call tới `/api/showtimes`
- `mockNews` → API call tới `/api/news`
- `mockHeroSlides` → Sử dụng top movies từ API

## 4. Frontend Integration Changes

### BookingWidget.jsx
- Thay thế mock data bằng API calls
- Implement real-time seat availability
- Add loading states cho dropdowns

### MovieSection.jsx
- Connect tới movies API với filters
- Implement pagination cho "Xem thêm phim"
- Real movie ratings từ database

### HeroSection.jsx  
- Dynamic slider từ featured movies API
- Real movie trailers integration

### NewsSection.jsx
- Connect tới news API
- Implement news detail pages

## 5. New Features cần thêm

### Booking Flow
- Seat selection UI
- Payment integration (mock)  
- Booking confirmation page
- Email confirmation (mock)

### Search & Filter
- Movie search functionality
- Filter by genre, rating, cinema
- Date range picker cho showtimes

### User Management (Optional)
- User registration/login
- Booking history
- G-Star membership points

## 6. Business Logic

### Seat Management
- Prevent double booking
- Auto-release unpaid bookings after 15 minutes
- Real-time seat updates

### Pricing Logic
- Different prices for different showtimes
- Weekend/weekday pricing
- IMAX premium pricing

### Validation Rules
- Booking không được quá 8 ghế/1 lần
- Ghế phải liên tiếp (optional)
- Kiểm tra tuổi cho phim có rating

## 7. Error Handling

- Movie sold out scenarios
- Invalid showtime selections  
- Booking conflicts
- Payment failures (mock)

---

**Implementation Priority:**
1. ✅ Frontend with mock data (DONE)
2. 🔄 Backend models & basic CRUD APIs  
3. 🔄 Frontend-Backend integration
4. 🔄 Booking flow implementation
5. 🔄 Testing & optimization