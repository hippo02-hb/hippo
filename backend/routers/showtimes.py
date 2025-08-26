from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/showtimes", tags=["showtimes"])

@router.get("/", response_model=List[schemas.ShowtimeWithDetails])
def get_showtimes(
    movie_id: Optional[int] = Query(None, description="Filter by movie ID"),
    cinema_id: Optional[int] = Query(None, description="Filter by cinema ID"),
    show_date: Optional[date] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get showtimes with movie and cinema details"""
    showtimes = crud.get_showtimes_with_details(
        db, 
        movie_id=movie_id, 
        cinema_id=cinema_id, 
        show_date=show_date
    )
    
    # Convert to response format
    result = []
    for st in showtimes:
        result.append(schemas.ShowtimeWithDetails(
            id=st.id,
            show_date=st.show_date,
            show_time=st.show_time,
            price=st.price,
            available_seats=st.available_seats,
            movie_title=st.movie_title,
            cinema_name=st.cinema_name,
            screen_type=st.screen_type
        ))
    
    return result[skip:skip+limit]

@router.get("/{showtime_id}", response_model=schemas.Showtime)
def get_showtime(showtime_id: int, db: Session = Depends(get_db)):
    """Get showtime by ID"""
    showtime = crud.get_showtime(db, showtime_id=showtime_id)
    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")
    return showtime

@router.post("/", response_model=schemas.Showtime)
def create_showtime(showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """Create new showtime (Admin only)"""
    return crud.create_showtime(db=db, showtime=showtime)

@router.get("/dates/available")
def get_available_dates(
    movie_id: Optional[int] = Query(None, description="Filter by movie ID"),
    cinema_id: Optional[int] = Query(None, description="Filter by cinema ID"), 
    db: Session = Depends(get_db)
):
    """Get available dates for movie/cinema combination"""
    dates = crud.get_available_dates(db, movie_id=movie_id, cinema_id=cinema_id)
    return {"dates": dates}

@router.get("/times/available")
def get_available_times(
    movie_id: int = Query(..., description="Movie ID"),
    cinema_id: int = Query(..., description="Cinema ID"),
    show_date: date = Query(..., description="Show date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """Get available times for specific movie, cinema, and date"""
    times = crud.get_available_times(db, movie_id=movie_id, cinema_id=cinema_id, show_date=show_date)
    
    result = []
    for time_data in times:
        result.append({
            "time": str(time_data[0]),
            "showtime_id": time_data[1], 
            "available_seats": time_data[2]
        })
    
    return {"times": result}