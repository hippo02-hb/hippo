from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, extract
from models import Movie, Cinema, Screen, Showtime, Booking, News, User, UserBooking
from schemas import MovieCreate, CinemaCreate, ShowtimeCreate, BookingCreate, NewsCreate, UserCreate, UserUpdate
from typing import Optional, List
from datetime import date, datetime
import uuid
from auth import get_password_hash

# Movie CRUD
def get_movies(db: Session, status: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(Movie)
    if status:
        query = query.filter(Movie.status == status)
    return query.offset(skip).limit(limit).all()

def get_movie(db: Session, movie_id: int):
    return db.query(Movie).filter(Movie.id == movie_id).first()

def create_movie(db: Session, movie: MovieCreate):
    db_movie = Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def update_movie(db: Session, movie_id: int, movie: MovieCreate):
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if db_movie:
        for field, value in movie.dict().items():
            setattr(db_movie, field, value)
        db.commit()
        db.refresh(db_movie)
    return db_movie

# Cinema CRUD
def get_cinemas(db: Session, province: Optional[str] = None):
    query = db.query(Cinema)
    if province:
        query = query.filter(Cinema.province == province)
    return query.all()

def get_cinema(db: Session, cinema_id: int):
    return db.query(Cinema).filter(Cinema.id == cinema_id).first()

def create_cinema(db: Session, cinema: CinemaCreate):
    db_cinema = Cinema(**cinema.dict())
    db.add(db_cinema)
    db.commit()
    db.refresh(db_cinema)
    return db_cinema

# Screen CRUD
def get_screens_by_cinema(db: Session, cinema_id: int):
    return db.query(Screen).filter(Screen.cinema_id == cinema_id).all()

# Showtime CRUD
def get_showtimes(
    db: Session, 
    movie_id: Optional[int] = None,
    cinema_id: Optional[int] = None, 
    show_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Showtime).join(Movie).join(Cinema).join(Screen)
    
    if movie_id:
        query = query.filter(Showtime.movie_id == movie_id)
    if cinema_id:
        query = query.filter(Showtime.cinema_id == cinema_id)
    if show_date:
        query = query.filter(Showtime.show_date == show_date)
    
    return query.offset(skip).limit(limit).all()

def get_showtime(db: Session, showtime_id: int):
    return db.query(Showtime).filter(Showtime.id == showtime_id).first()

def create_showtime(db: Session, showtime: ShowtimeCreate):
    db_showtime = Showtime(**showtime.dict())
    db.add(db_showtime)
    db.commit()
    db.refresh(db_showtime)
    return db_showtime

def get_showtimes_with_details(
    db: Session,
    movie_id: Optional[int] = None,
    cinema_id: Optional[int] = None,
    show_date: Optional[date] = None
):
    """Get showtimes with movie and cinema details"""
    query = db.query(
        Showtime.id,
        Showtime.show_date,
        Showtime.show_time, 
        Showtime.price,
        Showtime.available_seats,
        Movie.title.label('movie_title'),
        Cinema.name.label('cinema_name'),
        Screen.screen_type
    ).join(Movie).join(Cinema).join(Screen)
    
    if movie_id:
        query = query.filter(Showtime.movie_id == movie_id)
    if cinema_id:
        query = query.filter(Showtime.cinema_id == cinema_id)
    if show_date:
        query = query.filter(Showtime.show_date == show_date)
        
    return query.all()

# Booking CRUD
def create_booking(db: Session, booking: BookingCreate):
    # Check seat availability
    showtime = get_showtime(db, booking.showtime_id)
    if not showtime:
        raise ValueError("Showtime not found")
    
    # Check if requested seats are available
    booked_seats = showtime.booked_seats or []
    for seat in booking.seats:
        if seat in booked_seats:
            raise ValueError(f"Seat {seat} is already booked")
    
    # Check if enough seats available
    if len(booking.seats) > showtime.available_seats:
        raise ValueError("Not enough seats available")
    
    # Generate booking code
    booking_code = f"GC{str(uuid.uuid4())[:8].upper()}"
    
    # Create booking
    db_booking = Booking(
        **booking.dict(),
        booking_code=booking_code
    )
    
    # Update showtime
    showtime.booked_seats = booked_seats + booking.seats
    showtime.available_seats -= len(booking.seats)
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_booking(db: Session, booking_id: int):
    return db.query(Booking).filter(Booking.id == booking_id).first()

def get_booking_by_code(db: Session, booking_code: str):
    return db.query(Booking).filter(Booking.booking_code == booking_code).first()

def cancel_booking(db: Session, booking_id: int):
    booking = get_booking(db, booking_id)
    if not booking:
        return None
    
    # Update showtime to free seats
    showtime = get_showtime(db, booking.showtime_id)
    if showtime:
        booked_seats = showtime.booked_seats or []
        for seat in booking.seats:
            if seat in booked_seats:
                booked_seats.remove(seat)
        showtime.booked_seats = booked_seats
        showtime.available_seats += len(booking.seats)
    
    # Update booking status
    booking.status = "cancelled"
    db.commit()
    return booking

# News CRUD  
def get_news(db: Session, category: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(News).filter(News.is_active == True)
    if category:
        query = query.filter(News.category == category)
    return query.order_by(News.publish_date.desc()).offset(skip).limit(limit).all()

def get_news_item(db: Session, news_id: int):
    return db.query(News).filter(News.id == news_id, News.is_active == True).first()

def create_news(db: Session, news: NewsCreate):
    db_news = News(**news.dict())
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news

# Utility functions
def get_available_dates(db: Session, movie_id: Optional[int] = None, cinema_id: Optional[int] = None):
    """Get available dates for a movie/cinema combination"""
    query = db.query(Showtime.show_date).distinct()
    
    if movie_id:
        query = query.filter(Showtime.movie_id == movie_id)
    if cinema_id:
        query = query.filter(Showtime.cinema_id == cinema_id)
        
    dates = query.filter(Showtime.show_date >= date.today()).order_by(Showtime.show_date).all()
    return [d[0] for d in dates]

def get_available_times(db: Session, movie_id: int, cinema_id: int, show_date: date):
    """Get available times for specific movie, cinema, and date"""
    return db.query(Showtime.show_time, Showtime.id, Showtime.available_seats).filter(
        and_(
            Showtime.movie_id == movie_id,
            Showtime.cinema_id == cinema_id, 
            Showtime.show_date == show_date,
            Showtime.available_seats > 0
        )
    ).order_by(Showtime.show_time).all()

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100, role: Optional[str] = None):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    for field, value in user_update.dict(exclude_unset=True).items():
        if field == "password" and value:
            setattr(db_user, "hashed_password", get_password_hash(value))
        else:
            setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def get_user_bookings(db: Session, user_id: int):
    """Get all bookings for a user"""
    return db.query(Booking).filter(Booking.user_id == user_id).order_by(Booking.created_at.desc()).all()

# Admin stats
def get_user_stats(db: Session):
    """Get user statistics for admin dashboard"""
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year
    
    total_users = db.query(User).filter(User.role == "user").count()
    active_users = db.query(User).filter(User.role == "user", User.is_active == True).count()
    total_admins = db.query(User).filter(User.role.in_(["admin", "super_admin"])).count()
    users_this_month = db.query(User).filter(
        User.role == "user",
        extract('month', User.created_at) == current_month,
        extract('year', User.created_at) == current_year
    ).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users, 
        "total_admins": total_admins,
        "users_this_month": users_this_month
    }

def get_booking_stats(db: Session):
    """Get booking statistics for admin dashboard"""
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year
    
    total_bookings = db.query(Booking).count()
    confirmed_bookings = db.query(Booking).filter(Booking.status == "confirmed").count()
    cancelled_bookings = db.query(Booking).filter(Booking.status == "cancelled").count()
    bookings_this_month = db.query(Booking).filter(
        extract('month', Booking.created_at) == current_month,
        extract('year', Booking.created_at) == current_year
    ).count()
    
    # Calculate revenue this month
    revenue_result = db.query(func.sum(Booking.total_amount)).filter(
        Booking.status == "confirmed",
        extract('month', Booking.created_at) == current_month,
        extract('year', Booking.created_at) == current_year
    ).scalar()
    revenue_this_month = float(revenue_result) if revenue_result else 0.0
    
    return {
        "total_bookings": total_bookings,
        "confirmed_bookings": confirmed_bookings,
        "cancelled_bookings": cancelled_bookings, 
        "bookings_this_month": bookings_this_month,
        "revenue_this_month": revenue_this_month
    }