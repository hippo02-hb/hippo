from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash
from schemas import UserLogin, UserRegister, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register new user"""
    # Check if user already exists
    if crud.get_user_by_email(db, email=user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_create = schemas.UserCreate(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=schemas.UserRole.USER
    )
    
    db_user = crud.create_user(db=db, user=user_create)
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(db_user)
    }

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer", 
        "user": UserResponse.from_orm(user)
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_update: schemas.UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    # Remove role and is_active from user update (only admins can change these)
    user_update.role = None
    user_update.is_active = None
    
    updated_user = crud.update_user(db, current_user.id, user_update)
    return updated_user

@router.get("/bookings", response_model=list[schemas.Booking])
def get_my_bookings(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's bookings"""
    return crud.get_user_bookings(db, current_user.id)

@router.post("/logout")
def logout():
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}