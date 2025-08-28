from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas
from auth import get_current_user_optional

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=schemas.Booking)
def create_booking(
    booking: schemas.BookingCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Create new booking"""
    try:
        # Add user_id if user is logged in
        if current_user:
            booking.user_id = current_user.id
            # If user is logged in, prefill customer info from user profile
            if not booking.customer_name:
                booking.customer_name = current_user.full_name
            if not booking.customer_email:
                booking.customer_email = current_user.email
            if not booking.customer_phone and current_user.phone:
                booking.customer_phone = current_user.phone
        
        # Validate required fields are present
        if not booking.customer_name:
            raise HTTPException(status_code=400, detail="Customer name is required")
        if not booking.customer_email:
            raise HTTPException(status_code=400, detail="Customer email is required")
        if not booking.customer_phone:
            raise HTTPException(status_code=400, detail="Customer phone is required")
        
        return crud.create_booking(db=db, booking=booking)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{booking_id}", response_model=schemas.Booking)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get booking by ID"""
    booking = crud.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.get("/code/{booking_code}", response_model=schemas.Booking)
def get_booking_by_code(booking_code: str, db: Session = Depends(get_db)):
    """Get booking by booking code"""
    booking = crud.get_booking_by_code(db, booking_code=booking_code)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.patch("/{booking_id}/cancel", response_model=schemas.Booking)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel booking and free up seats"""
    booking = crud.cancel_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.get("/{booking_id}/details")
def get_booking_details(booking_id: int, db: Session = Depends(get_db)):
    """Get detailed booking information with movie and cinema info"""
    booking = crud.get_booking(db, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    showtime = crud.get_showtime(db, booking.showtime_id)
    movie = crud.get_movie(db, showtime.movie_id)
    cinema = crud.get_cinema(db, showtime.cinema_id)
    
    return {
        "booking": booking,
        "movie": {"id": movie.id, "title": movie.title, "poster": movie.poster},
        "cinema": {"id": cinema.id, "name": cinema.name, "address": cinema.address},
        "showtime": {
            "date": showtime.show_date,
            "time": showtime.show_time,
            "price": showtime.price
        }
    }