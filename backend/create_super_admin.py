#!/usr/bin/env python3
"""
Script to create super admin user for Galaxy Cinema
Run this once after setting up authentication system
"""

import sys
import os
from database import SessionLocal, create_tables
from models import User, UserRole
from auth import get_password_hash

def create_super_admin():
    """Create super admin user"""
    
    # Create tables if they don't exist
    create_tables()
    
    db = SessionLocal()
    
    try:
        # Check if super admin already exists
        existing_super_admin = db.query(User).filter(User.role == UserRole.SUPER_ADMIN).first()
        if existing_super_admin:
            print(f"✅ Super admin already exists: {existing_super_admin.email}")
            return
        
        # Create super admin user
        super_admin_email = "admin@galaxycinema.vn"
        super_admin_password = "Galaxy2024@Admin"  # Change this in production!
        
        super_admin = User(
            email=super_admin_email,
            hashed_password=get_password_hash(super_admin_password),
            full_name="Galaxy Cinema Super Admin",
            phone="1900224466",
            role=UserRole.SUPER_ADMIN,
            is_active=True
        )
        
        db.add(super_admin)
        db.commit()
        db.refresh(super_admin)
        
        print("🎉 Super admin user created successfully!")
        print(f"📧 Email: {super_admin_email}")
        print(f"🔑 Password: {super_admin_password}")
        print("⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating super admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_super_admin()