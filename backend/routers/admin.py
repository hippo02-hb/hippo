from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
import crud
import schemas
from auth import get_admin_user, get_super_admin_user, get_password_hash
from schemas import AdminUserCreate, AdminUserUpdate, UserResponse, UserStats, BookingStats

router = APIRouter(prefix="/admin", tags=["admin"])

# User Management (Super Admin only)
@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    role: Optional[str] = Query(None),
    current_user = Depends(get_super_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (Super Admin only)"""
    return crud.get_users(db, skip=skip, limit=limit, role=role)

@router.post("/users", response_model=UserResponse)
def create_admin_user(
    user_data: AdminUserCreate,
    current_user = Depends(get_super_admin_user),
    db: Session = Depends(get_db)
):
    """Create new admin user (Super Admin only)"""
    # Check if user already exists
    if crud.get_user_by_email(db, email=user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_create = schemas.UserCreate(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=user_data.role
    )
    
    return crud.create_user(db=db, user=user_create)

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user_admin(
    user_id: int,
    user_update: AdminUserUpdate,
    current_user = Depends(get_super_admin_user),
    db: Session = Depends(get_db)
):
    """Update user (Super Admin only)"""
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = crud.update_user(db, user_id, user_update)
    return updated_user

@router.delete("/users/{user_id}")
def delete_user_admin(
    user_id: int,
    current_user = Depends(get_super_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user (Super Admin only)"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

# Movie Management (Admin+)
@router.get("/movies", response_model=List[schemas.Movie])
def get_all_movies_admin(
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all movies for admin management"""
    return crud.get_movies(db, limit=1000)  # Get all movies

@router.put("/movies/{movie_id}", response_model=schemas.Movie)
def update_movie_admin(
    movie_id: int,
    movie: schemas.MovieCreate,
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update movie (Admin+)"""
    updated_movie = crud.update_movie(db, movie_id, movie)
    if not updated_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return updated_movie

@router.delete("/movies/{movie_id}")
def delete_movie_admin(
    movie_id: int,
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete movie (Admin+)"""
    # In a real app, you'd want to check if movie has bookings first
    movie = crud.get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db.delete(movie)
    db.commit()
    return {"message": "Movie deleted successfully"}

# Cinema Management (Admin+)
@router.get("/cinemas", response_model=List[schemas.Cinema])
def get_all_cinemas_admin(
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all cinemas for admin management"""
    return crud.get_cinemas(db)

# Booking Management (Admin+)
@router.get("/bookings", response_model=List[schemas.Booking])
def get_all_bookings_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all bookings for admin management"""
    query = db.query(crud.Booking)
    if status:
        query = query.filter(crud.Booking.status == status)
    return query.offset(skip).limit(limit).all()

# Dashboard Stats (Admin+)
@router.get("/stats/users", response_model=UserStats)
def get_user_stats_admin(
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get user statistics for dashboard"""
    return crud.get_user_stats(db)

@router.get("/stats/bookings", response_model=BookingStats)
def get_booking_stats_admin(
    current_user = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get booking statistics for dashboard"""
    return crud.get_booking_stats(db)