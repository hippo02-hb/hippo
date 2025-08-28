from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
import crud
import schemas
from auth import get_admin_user

router = APIRouter(prefix="/cinemas", tags=["cinemas"])

@router.get("/", response_model=List[schemas.Cinema])
def get_cinemas(
    province: Optional[str] = Query(None, description="Filter by province"),
    db: Session = Depends(get_db)
):
    """Get list of cinemas with optional province filter"""
    cinemas = crud.get_cinemas(db, province=province)
    return cinemas

@router.get("/{cinema_id}", response_model=schemas.Cinema) 
def get_cinema(cinema_id: int, db: Session = Depends(get_db)):
    """Get cinema by ID"""
    cinema = crud.get_cinema(db, cinema_id=cinema_id)
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    return cinema

@router.get("/{cinema_id}/screens", response_model=List[schemas.Screen])
def get_cinema_screens(cinema_id: int, db: Session = Depends(get_db)):
    """Get screens for a specific cinema"""
    cinema = crud.get_cinema(db, cinema_id=cinema_id)
    if not cinema:
        raise HTTPException(status_code=404, detail="Cinema not found")
    
    screens = crud.get_screens_by_cinema(db, cinema_id=cinema_id)
    return screens

@router.post("/", response_model=schemas.Cinema)
def create_cinema(cinema: schemas.CinemaCreate, db: Session = Depends(get_db), current_user = Depends(get_admin_user)):
    """Create new cinema (Admin only)"""
    return crud.create_cinema(db=db, cinema=cinema)