from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/", response_model=List[schemas.Movie])
def get_movies(
    status: Optional[str] = Query(None, description="Filter by status: showing, coming, stopped"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get list of movies with optional status filter"""
    movies = crud.get_movies(db, status=status, skip=skip, limit=limit)
    return movies

@router.get("/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    """Get movie by ID"""
    movie = crud.get_movie(db, movie_id=movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.post("/", response_model=schemas.Movie)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    """Create new movie (Admin only)"""
    return crud.create_movie(db=db, movie=movie)

@router.put("/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    """Update movie (Admin only)"""
    updated_movie = crud.update_movie(db=db, movie_id=movie_id, movie=movie)
    if not updated_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return updated_movie