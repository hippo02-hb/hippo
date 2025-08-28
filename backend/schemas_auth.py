# Authentication related schemas
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin" 
    SUPER_ADMIN = "super_admin"

# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[UserRole] = UserRole.USER

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Admin user management
class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    role: UserRole = UserRole.ADMIN

class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None
    password: Optional[str] = Field(None, min_length=6)

# User stats for admin dashboard
class UserStats(BaseModel):
    total_users: int
    active_users: int
    total_admins: int
    users_this_month: int
    
class BookingStats(BaseModel):
    total_bookings: int
    confirmed_bookings: int
    cancelled_bookings: int
    bookings_this_month: int
    revenue_this_month: float