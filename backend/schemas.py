from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, time, datetime
from decimal import Decimal

# Movie Schemas
class MovieBase(BaseModel):
    title: str
    poster: Optional[str] = None
    rating: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[int] = None
    status: Optional[str] = "coming"
    trailer: Optional[str] = None
    description: Optional[str] = None
    director: Optional[str] = None
    cast: Optional[List[str]] = []
    release_date: Optional[date] = None

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Cinema Schemas
class CinemaBase(BaseModel):
    name: str
    address: Optional[str] = None
    province: Optional[str] = None

class CinemaCreate(CinemaBase):
    pass

class Cinema(CinemaBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Screen Schemas
class ScreenBase(BaseModel):
    cinema_id: int
    screen_number: int
    screen_type: Optional[str] = "2D"
    total_seats: Optional[int] = 100

class ScreenCreate(ScreenBase):
    pass

class Screen(ScreenBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Showtime Schemas
class ShowtimeBase(BaseModel):
    movie_id: int
    cinema_id: int
    screen_id: int
    show_date: date
    show_time: time
    price: Decimal
    available_seats: Optional[int] = 100
    booked_seats: Optional[List[str]] = []

class ShowtimeCreate(ShowtimeBase):
    pass

class Showtime(ShowtimeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Enhanced Showtime with movie and cinema info
class ShowtimeWithDetails(BaseModel):
    id: int
    show_date: date
    show_time: time
    price: Decimal
    available_seats: int
    movie_title: str
    cinema_name: str
    screen_type: str
    
    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    showtime_id: int
    customer_name: str
    customer_phone: str
    customer_email: str
    seats: List[str]
    total_amount: Decimal
    payment_method: Optional[str] = "cash"

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    booking_code: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# News Schemas
class NewsBase(BaseModel):
    title: str
    summary: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = "news"
    publish_date: Optional[date] = None
    is_active: Optional[bool] = True

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Response Schemas
class MovieListResponse(BaseModel):
    movies: List[Movie]
    total: int

class ShowtimeListResponse(BaseModel):
    showtimes: List[ShowtimeWithDetails]
    total: int