from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
import crud
import schemas
from auth import get_admin_user

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=List[schemas.News])
def get_news(
    category: Optional[str] = Query(None, description="Filter by category: news, promotion"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get list of news with optional category filter"""
    news = crud.get_news(db, category=category, skip=skip, limit=limit)
    return news

@router.get("/{news_id}", response_model=schemas.News)
def get_news_item(news_id: int, db: Session = Depends(get_db)):
    """Get news item by ID"""
    news = crud.get_news_item(db, news_id=news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@router.post("/", response_model=schemas.News)
def create_news(news: schemas.NewsCreate, db: Session = Depends(get_db)):
    """Create new news item (Admin only)"""
    return crud.create_news(db=db, news=news)