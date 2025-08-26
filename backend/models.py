from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, Date, Time, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    poster = Column(Text)
    rating = Column(String(10))  # T13, T16, T18, K
    genre = Column(Text)
    duration = Column(Integer)  # minutes
    status = Column(String(20), default="coming")  # showing, coming, stopped
    trailer = Column(Text)  # YouTube URL
    description = Column(Text)
    director = Column(String(255))
    cast = Column(ARRAY(String))  # Array of cast members
    release_date = Column(Date)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    showtimes = relationship("Showtime", back_populates="movie")

class Cinema(Base):
    __tablename__ = "cinemas"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    province = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    screens = relationship("Screen", back_populates="cinema")
    showtimes = relationship("Showtime", back_populates="cinema")

class Screen(Base):
    __tablename__ = "screens"
    
    id = Column(Integer, primary_key=True, index=True)
    cinema_id = Column(Integer, ForeignKey("cinemas.id"))
    screen_number = Column(Integer)
    screen_type = Column(String(20))  # 2D, 3D, IMAX
    total_seats = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    cinema = relationship("Cinema", back_populates="screens")
    showtimes = relationship("Showtime", back_populates="screen")

class Showtime(Base):
    __tablename__ = "showtimes"
    
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    cinema_id = Column(Integer, ForeignKey("cinemas.id"))
    screen_id = Column(Integer, ForeignKey("screens.id"))
    show_date = Column(Date)
    show_time = Column(Time)
    price = Column(DECIMAL(10, 2))
    available_seats = Column(Integer)
    booked_seats = Column(ARRAY(String))  # Array of seat codes
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    movie = relationship("Movie", back_populates="showtimes")
    cinema = relationship("Cinema", back_populates="showtimes")
    screen = relationship("Screen", back_populates="showtimes")
    bookings = relationship("Booking", back_populates="showtime")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    showtime_id = Column(Integer, ForeignKey("showtimes.id"))
    customer_name = Column(String(255))
    customer_phone = Column(String(20))
    customer_email = Column(String(255))
    seats = Column(ARRAY(String))  # Array of seat codes
    total_amount = Column(DECIMAL(10, 2))
    booking_code = Column(String(50), unique=True)
    status = Column(String(20), default="confirmed")  # confirmed, cancelled
    payment_method = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    showtime = relationship("Showtime", back_populates="bookings")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.booking_code:
            self.booking_code = f"GC{str(uuid.uuid4())[:8].upper()}"

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    summary = Column(Text)
    content = Column(Text)
    image = Column(Text)
    category = Column(String(50))  # news, promotion
    publish_date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())