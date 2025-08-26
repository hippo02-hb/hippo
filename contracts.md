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

### Movies Table
```sql
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    poster TEXT,
    rating VARCHAR(10), -- T13, T16, T18, K
    genre TEXT,
    duration INTEGER, -- phút
    status VARCHAR(20) DEFAULT 'coming', -- showing, coming, stopped
    trailer TEXT, -- YouTube URL
    description TEXT,
    director VARCHAR(255),
    cast TEXT[], -- Array of cast members
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cinemas Table
```sql
CREATE TABLE cinemas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    province VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Screens Table
```sql
CREATE TABLE screens (
    id SERIAL PRIMARY KEY,
    cinema_id INTEGER REFERENCES cinemas(id),
    screen_number INTEGER,
    screen_type VARCHAR(20), -- 2D, 3D, IMAX
    total_seats INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Showtimes Table
```sql
CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id),
    cinema_id INTEGER REFERENCES cinemas(id),
    screen_id INTEGER REFERENCES screens(id),
    show_date DATE,
    show_time TIME,
    price DECIMAL(10,2),
    available_seats INTEGER,
    booked_seats TEXT[], -- Array of seat codes ["A1", "A2"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    showtime_id INTEGER REFERENCES showtimes(id),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    seats TEXT[], -- Array of seat codes
    total_amount DECIMAL(10,2),
    booking_code VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### News Table
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    image TEXT,
    category VARCHAR(50), -- news, promotion
    publish_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Database Connection Setup

### Neon PostgreSQL Connection
```
Host: ep-royal-cake-afq7xl9y-pooler.c-2.us-west-2.aws.neon.tech
Database: neondb  
User: neondb_owner
Password: npg_ziGvUol6KN7C
Port: 5432
SSL: require
```

### Connection String
```
postgresql://neondb_owner:npg_ziGvUol6KN7C@ep-royal-cake-afq7xl9y-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
```

## 4. Mock Data cần thay thế

### Trong `/app/frontend/src/data/mock.js`:
- `mockMovies` → API call tới `/api/movies`
- `mockCinemas` → API call tới `/api/cinemas`  
- `mockShowtimes` → API call tới `/api/showtimes`
- `mockNews` → API call tới `/api/news`
- `mockHeroSlides` → Sử dụng top movies từ API

## 5. Frontend Integration Changes

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