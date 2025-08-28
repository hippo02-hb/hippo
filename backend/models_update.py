# Add User model and BookingHistory to existing models.py
# This file contains the additions needed - will be merged with models.py

from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin" 
    SUPER_ADMIN = "super_admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user_bookings = relationship("UserBooking", back_populates="user")

class UserBooking(Base):
    __tablename__ = "user_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_bookings")
    booking = relationship("Booking")

# Update Booking model to support both guest and user bookings
# Add user_id as optional field to existing Booking model:
# user_id = Column(Integer, ForeignKey("users.id"), nullable=True)