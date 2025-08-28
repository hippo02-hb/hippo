#!/usr/bin/env python3
"""
Backend API Testing Script for Galaxy Cinema
Tests authentication system and role-based access control
"""

import requests
import json
import os
from datetime import date, datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get base URL from environment
BASE_URL = os.getenv('REACT_APP_BACKEND_URL')
if not BASE_URL:
    raise ValueError("REACT_APP_BACKEND_URL not found in frontend/.env")

API_BASE_URL = f"{BASE_URL}/api"

print(f"Testing Galaxy Cinema Authentication API at: {API_BASE_URL}")
print("=" * 80)

# Global variables to store tokens
admin_token = None
user_token = None

def test_auth_login_super_admin():
    """Test POST /api/auth/login with super admin credentials"""
    global admin_token
    print("\n1. Testing Super Admin Login")
    print("-" * 40)
    
    try:
        login_data = {
            "email": "admin@galaxycinema.vn",
            "password": "Galaxy2024@Admin"
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/login", 
                               json=login_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            
            # Check required fields
            required_fields = ['access_token', 'token_type', 'user']
            if all(field in data for field in required_fields):
                admin_token = data['access_token']
                user_info = data['user']
                print(f"✅ Login successful")
                print(f"   Token type: {data['token_type']}")
                print(f"   User role: {user_info.get('role')}")
                print(f"   User email: {user_info.get('email')}")
                
                # Verify it's super admin
                if user_info.get('role') == 'super_admin':
                    print("✅ Super admin role confirmed")
                    return True
                else:
                    print(f"❌ Expected super_admin role, got: {user_info.get('role')}")
                    return False
            else:
                print(f"❌ Missing required fields. Expected: {required_fields}")
                return False
        else:
            print(f"❌ Login failed - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login failed - Exception: {str(e)}")
        return False

def test_auth_login_invalid_credentials():
    """Test POST /api/auth/login with invalid credentials"""
    print("\n2. Testing Login with Invalid Credentials")
    print("-" * 40)
    
    try:
        login_data = {
            "email": "invalid@email.com",
            "password": "wrongpassword"
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/login", 
                               json=login_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Invalid credentials correctly rejected with 401")
            return True
        else:
            print(f"❌ Expected 401 for invalid credentials, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed - Exception: {str(e)}")
        return False

def test_auth_register_new_user():
    """Test POST /api/auth/register - Register new user"""
    global user_token
    print("\n3. Testing User Registration")
    print("-" * 40)
    
    try:
        # Use timestamp to ensure unique email
        timestamp = int(datetime.now().timestamp())
        register_data = {
            "email": f"testuser{timestamp}@galaxycinema.vn",
            "password": "TestPass123!",
            "full_name": "Nguyen Test User",
            "phone": "0987654321"
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/register", 
                               json=register_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            
            # Check required fields
            required_fields = ['access_token', 'token_type', 'user']
            if all(field in data for field in required_fields):
                user_token = data['access_token']
                user_info = data['user']
                print(f"✅ Registration successful")
                print(f"   Token type: {data['token_type']}")
                print(f"   User role: {user_info.get('role')}")
                print(f"   User email: {user_info.get('email')}")
                
                # Verify it's regular user
                if user_info.get('role') == 'user':
                    print("✅ User role confirmed")
                    return True
                else:
                    print(f"❌ Expected user role, got: {user_info.get('role')}")
                    return False
            else:
                print(f"❌ Missing required fields. Expected: {required_fields}")
                return False
        else:
            print(f"❌ Registration failed - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Registration failed - Exception: {str(e)}")
        return False

def test_auth_register_duplicate_email():
    """Test POST /api/auth/register with duplicate email"""
    print("\n4. Testing Registration with Duplicate Email")
    print("-" * 40)
    
    try:
        register_data = {
            "email": "admin@galaxycinema.vn",  # This should already exist
            "password": "TestPass123!",
            "full_name": "Duplicate User",
            "phone": "0987654321"
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/register", 
                               json=register_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Duplicate email correctly rejected with 400")
            return True
        else:
            print(f"❌ Expected 400 for duplicate email, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed - Exception: {str(e)}")
        return False

def test_auth_me_with_valid_token():
    """Test GET /api/auth/me with valid JWT token"""
    print("\n5. Testing Get Current User Info (Valid Token)")
    print("-" * 40)
    
    if not admin_token:
        print("❌ No admin token available for testing")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{API_BASE_URL}/auth/me", 
                              headers=headers,
                              timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print(f"User Info: {json.dumps(user_info, indent=2, default=str)}")
            
            # Check required fields
            required_fields = ['id', 'email', 'full_name', 'role', 'is_active']
            if all(field in user_info for field in required_fields):
                print("✅ User info retrieved successfully")
                return True
            else:
                print(f"❌ Missing required fields. Expected: {required_fields}")
                return False
        else:
            print(f"❌ Failed to get user info - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed - Exception: {str(e)}")
        return False

def test_auth_me_with_invalid_token():
    """Test GET /api/auth/me with invalid JWT token"""
    print("\n6. Testing Get Current User Info (Invalid Token)")
    print("-" * 40)
    
    try:
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = requests.get(f"{API_BASE_URL}/auth/me", 
                              headers=headers,
                              timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Invalid token correctly rejected with 401")
            return True
        else:
            print(f"❌ Expected 401 for invalid token, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed - Exception: {str(e)}")
        return False

def test_auth_me_without_token():
    """Test GET /api/auth/me without token"""
    print("\n7. Testing Get Current User Info (No Token)")
    print("-" * 40)
    
    try:
        response = requests.get(f"{API_BASE_URL}/auth/me", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401 or response.status_code == 403:
            print("✅ Missing token correctly rejected")
            return True
        else:
            print(f"❌ Expected 401/403 for missing token, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed - Exception: {str(e)}")
        return False

def test_admin_endpoints_with_admin_token():
    """Test admin-only endpoints with admin token"""
    print("\n8. Testing Admin Endpoints with Admin Token")
    print("-" * 40)
    
    if not admin_token:
        print("❌ No admin token available for testing")
        return {"movies": False, "cinemas": False, "news": False, "showtimes": False}
    
    results = {"movies": False, "cinemas": False, "news": False, "showtimes": False}
    headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    
    # Test POST /api/movies/
    try:
        print("\n8a. Testing POST /api/movies/ (Admin required)")
        movie_data = {
            "title": "Test Movie Admin Auth",
            "poster": "https://example.com/test-movie.jpg",
            "rating": "PG-13",
            "genre": "Action, Test",
            "duration": 120,
            "status": "showing",
            "description": "Test movie for admin authentication",
            "director": "Test Director",
            "cast": ["Test Actor 1", "Test Actor 2"],
            "release_date": "2024-01-15"
        }
        
        response = requests.post(f"{API_BASE_URL}/movies/", 
                               json=movie_data, 
                               headers=headers,
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ POST /api/movies/ with admin token PASSED")
            results["movies"] = True
        else:
            print(f"❌ POST /api/movies/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ POST /api/movies/ FAILED - Exception: {str(e)}")
    
    # Test POST /api/cinemas/
    try:
        print("\n8b. Testing POST /api/cinemas/ (Admin required)")
        cinema_data = {
            "name": "Test Cinema Admin Auth",
            "address": "123 Test Street, Test City",
            "province": "Test Province"
        }
        
        response = requests.post(f"{API_BASE_URL}/cinemas/", 
                               json=cinema_data, 
                               headers=headers,
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ POST /api/cinemas/ with admin token PASSED")
            results["cinemas"] = True
        else:
            print(f"❌ POST /api/cinemas/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ POST /api/cinemas/ FAILED - Exception: {str(e)}")
    
    # Test POST /api/news/
    try:
        print("\n8c. Testing POST /api/news/ (Admin required)")
        news_data = {
            "title": "Test News Admin Auth",
            "summary": "Test news for admin authentication",
            "content": "This is a test news item to verify admin authentication works correctly.",
            "category": "news",
            "publish_date": "2024-01-15",
            "is_active": True
        }
        
        response = requests.post(f"{API_BASE_URL}/news/", 
                               json=news_data, 
                               headers=headers,
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ POST /api/news/ with admin token PASSED")
            results["news"] = True
        else:
            print(f"❌ POST /api/news/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ POST /api/news/ FAILED - Exception: {str(e)}")
    
    # Test POST /api/showtimes/ (need to get valid movie and cinema IDs first)
    try:
        print("\n8d. Testing POST /api/showtimes/ (Admin required)")
        
        # Get a movie ID
        movies_response = requests.get(f"{API_BASE_URL}/movies/", timeout=10)
        cinemas_response = requests.get(f"{API_BASE_URL}/cinemas/", timeout=10)
        
        if movies_response.status_code == 200 and cinemas_response.status_code == 200:
            movies = movies_response.json()
            cinemas = cinemas_response.json()
            
            if movies and cinemas:
                showtime_data = {
                    "movie_id": movies[0]['id'],
                    "cinema_id": cinemas[0]['id'],
                    "screen_id": 1,  # Assuming screen ID 1 exists
                    "show_date": "2024-02-15",
                    "show_time": "19:30:00",
                    "price": 100000,
                    "available_seats": 100
                }
                
                response = requests.post(f"{API_BASE_URL}/showtimes/", 
                                       json=showtime_data, 
                                       headers=headers,
                                       timeout=10)
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    print("✅ POST /api/showtimes/ with admin token PASSED")
                    results["showtimes"] = True
                else:
                    print(f"❌ POST /api/showtimes/ FAILED - Status: {response.status_code}")
                    print(f"Response: {response.text}")
            else:
                print("⚠️ No movies or cinemas available for showtime test")
        else:
            print("⚠️ Could not fetch movies/cinemas for showtime test")
            
    except Exception as e:
        print(f"❌ POST /api/showtimes/ FAILED - Exception: {str(e)}")
    
    return results

def test_admin_endpoints_without_token():
    """Test admin-only endpoints without token"""
    print("\n9. Testing Admin Endpoints without Token")
    print("-" * 40)
    
    results = {"movies": False, "cinemas": False, "news": False, "showtimes": False}
    
    # Test POST /api/movies/ without token
    try:
        print("\n9a. Testing POST /api/movies/ (No token)")
        movie_data = {
            "title": "Test Movie No Auth",
            "rating": "PG-13",
            "genre": "Action",
            "duration": 120
        }
        
        response = requests.post(f"{API_BASE_URL}/movies/", 
                               json=movie_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [401, 403]:
            print("✅ POST /api/movies/ correctly rejected without token")
            results["movies"] = True
        else:
            print(f"❌ Expected 401/403, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Test failed - Exception: {str(e)}")
    
    # Test other endpoints similarly
    endpoints = [
        ("POST /api/cinemas/", "/cinemas/", {"name": "Test Cinema", "address": "Test"}),
        ("POST /api/news/", "/news/", {"title": "Test News", "content": "Test"}),
        ("POST /api/showtimes/", "/showtimes/", {"movie_id": 1, "cinema_id": 1, "screen_id": 1, "show_date": "2024-02-15", "show_time": "19:30:00", "price": 100000})
    ]
    
    for endpoint_name, endpoint_path, test_data in endpoints:
        try:
            print(f"\n9b. Testing {endpoint_name} (No token)")
            response = requests.post(f"{API_BASE_URL}{endpoint_path}", 
                                   json=test_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code in [401, 403]:
                print(f"✅ {endpoint_name} correctly rejected without token")
                key = endpoint_path.split('/')[1]  # Extract key from path
                if key in results:
                    results[key] = True
            else:
                print(f"❌ Expected 401/403, got {response.status_code}")
                
        except Exception as e:
            print(f"❌ Test failed - Exception: {str(e)}")
    
    return results

def test_admin_endpoints_with_user_token():
    """Test admin-only endpoints with regular user token"""
    print("\n10. Testing Admin Endpoints with User Token")
    print("-" * 40)
    
    if not user_token:
        print("❌ No user token available for testing")
        return {"movies": False, "cinemas": False, "news": False, "showtimes": False}
    
    results = {"movies": False, "cinemas": False, "news": False, "showtimes": False}
    headers = {"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"}
    
    endpoints = [
        ("POST /api/movies/", "/movies/", {"title": "Test Movie User Auth", "rating": "PG-13"}),
        ("POST /api/cinemas/", "/cinemas/", {"name": "Test Cinema User Auth", "address": "Test"}),
        ("POST /api/news/", "/news/", {"title": "Test News User Auth", "content": "Test"}),
        ("POST /api/showtimes/", "/showtimes/", {"movie_id": 1, "cinema_id": 1, "screen_id": 1, "show_date": "2024-02-15", "show_time": "19:30:00", "price": 100000})
    ]
    
    for endpoint_name, endpoint_path, test_data in endpoints:
        try:
            print(f"\n10a. Testing {endpoint_name} (User token)")
            response = requests.post(f"{API_BASE_URL}{endpoint_path}", 
                                   json=test_data, 
                                   headers=headers,
                                   timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 403:
                print(f"✅ {endpoint_name} correctly rejected with user token (403 Forbidden)")
                key = endpoint_path.split('/')[1]  # Extract key from path
                if key in results:
                    results[key] = True
            else:
                print(f"❌ Expected 403 for user token, got {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Test failed - Exception: {str(e)}")
    
    return results

def test_admin_stats_endpoints():
    """Test admin stats endpoints"""
    print("\n11. Testing Admin Stats Endpoints")
    print("-" * 40)
    
    if not admin_token:
        print("❌ No admin token available for testing")
        return {"users": False, "bookings": False}
    
    results = {"users": False, "bookings": False}
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test GET /api/admin/stats/users
    try:
        print("\n11a. Testing GET /api/admin/stats/users")
        response = requests.get(f"{API_BASE_URL}/admin/stats/users", 
                              headers=headers,
                              timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            stats = response.json()
            print(f"User Stats: {json.dumps(stats, indent=2)}")
            
            # Check required fields
            required_fields = ['total_users', 'active_users', 'total_admins', 'users_this_month']
            if all(field in stats for field in required_fields):
                print("✅ GET /api/admin/stats/users PASSED")
                results["users"] = True
            else:
                print(f"❌ Missing required fields. Expected: {required_fields}")
        else:
            print(f"❌ GET /api/admin/stats/users FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ GET /api/admin/stats/users FAILED - Exception: {str(e)}")
    
    # Test GET /api/admin/stats/bookings
    try:
        print("\n11b. Testing GET /api/admin/stats/bookings")
        response = requests.get(f"{API_BASE_URL}/admin/stats/bookings", 
                              headers=headers,
                              timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            stats = response.json()
            print(f"Booking Stats: {json.dumps(stats, indent=2)}")
            
            # Check required fields
            required_fields = ['total_bookings', 'confirmed_bookings', 'cancelled_bookings', 'bookings_this_month', 'revenue_this_month']
            if all(field in stats for field in required_fields):
                print("✅ GET /api/admin/stats/bookings PASSED")
                results["bookings"] = True
            else:
                print(f"❌ Missing required fields. Expected: {required_fields}")
        else:
            print(f"❌ GET /api/admin/stats/bookings FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ GET /api/admin/stats/bookings FAILED - Exception: {str(e)}")
    
    return results

def test_enhanced_booking_authenticated():
    """Test booking with authenticated user (auto-fill user info)"""
    print("\n12. Testing Enhanced Booking (Authenticated User)")
    print("-" * 40)
    
    if not user_token:
        print("❌ No user token available for testing")
        return False
    
    try:
        # First, get a valid showtime ID
        response = requests.get(f"{API_BASE_URL}/showtimes/", timeout=10)
        if response.status_code != 200 or not response.json():
            print("❌ No showtimes available for testing")
            return False
        
        showtimes = response.json()
        showtime_id = showtimes[0]['id']
        print(f"Using showtime ID: {showtime_id}")
        
        # Create booking with minimal data (should auto-fill from user profile)
        booking_data = {
            "showtime_id": showtime_id,
            "seats": ["C5", "C6"],
            "total_amount": 200000,
            "payment_method": "credit_card"
            # Note: Not providing customer_name, customer_phone, customer_email
            # These should be auto-filled from authenticated user
        }
        
        headers = {"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"}
        response = requests.post(f"{API_BASE_URL}/bookings/", 
                               json=booking_data, 
                               headers=headers,
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            booking = response.json()
            print(f"Created Booking: {json.dumps(booking, indent=2, default=str)}")
            
            # Verify user info was auto-filled
            if booking.get('customer_name') and booking.get('customer_email'):
                print("✅ Enhanced booking with authenticated user PASSED")
                print(f"   Auto-filled name: {booking.get('customer_name')}")
                print(f"   Auto-filled email: {booking.get('customer_email')}")
                return True
            else:
                print("❌ User info was not auto-filled")
                return False
        else:
            print(f"❌ Enhanced booking FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Enhanced booking FAILED - Exception: {str(e)}")
        return False

def test_enhanced_booking_guest():
    """Test booking without authentication (guest booking)"""
    print("\n13. Testing Enhanced Booking (Guest User)")
    print("-" * 40)
    
    try:
        # First, get a valid showtime ID
        response = requests.get(f"{API_BASE_URL}/showtimes/", timeout=10)
        if response.status_code != 200 or not response.json():
            print("❌ No showtimes available for testing")
            return False
        
        showtimes = response.json()
        showtime_id = showtimes[0]['id']
        print(f"Using showtime ID: {showtime_id}")
        
        # Create booking as guest (must provide all customer info)
        booking_data = {
            "showtime_id": showtime_id,
            "customer_name": "Tran Van Guest",
            "customer_phone": "0912345678",
            "customer_email": "guest@example.com",
            "seats": ["D7", "D8"],
            "total_amount": 200000,
            "payment_method": "cash"
        }
        
        response = requests.post(f"{API_BASE_URL}/bookings/", 
                               json=booking_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            booking = response.json()
            print(f"Created Booking: {json.dumps(booking, indent=2, default=str)}")
            
            # Verify booking was created with provided info
            if (booking.get('customer_name') == booking_data['customer_name'] and 
                booking.get('customer_email') == booking_data['customer_email']):
                print("✅ Guest booking PASSED")
                return True
            else:
                print("❌ Guest booking info mismatch")
                return False
        else:
            print(f"❌ Guest booking FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Guest booking FAILED - Exception: {str(e)}")
        return False

def main():
    """Run all authentication tests and provide summary"""
    print("Galaxy Cinema Authentication System Testing")
    print("=" * 80)
    
    # Run authentication tests in order
    auth_login_admin = test_auth_login_super_admin()
    auth_login_invalid = test_auth_login_invalid_credentials()
    auth_register = test_auth_register_new_user()
    auth_register_duplicate = test_auth_register_duplicate_email()
    auth_me_valid = test_auth_me_with_valid_token()
    auth_me_invalid = test_auth_me_with_invalid_token()
    auth_me_no_token = test_auth_me_without_token()
    
    # Test role-based access control
    admin_with_token = test_admin_endpoints_with_admin_token()
    admin_without_token = test_admin_endpoints_without_token()
    admin_with_user_token = test_admin_endpoints_with_user_token()
    
    # Test admin stats endpoints
    admin_stats = test_admin_stats_endpoints()
    
    # Test enhanced booking
    booking_auth = test_enhanced_booking_authenticated()
    booking_guest = test_enhanced_booking_guest()
    
    # Summary
    print("\n" + "=" * 80)
    print("AUTHENTICATION TEST SUMMARY")
    print("=" * 80)
    
    print("\n🔐 AUTHENTICATION ENDPOINTS:")
    print(f"   Super Admin Login: {'✅ PASS' if auth_login_admin else '❌ FAIL'}")
    print(f"   Invalid Credentials: {'✅ PASS' if auth_login_invalid else '❌ FAIL'}")
    print(f"   User Registration: {'✅ PASS' if auth_register else '❌ FAIL'}")
    print(f"   Duplicate Email Rejection: {'✅ PASS' if auth_register_duplicate else '❌ FAIL'}")
    print(f"   Get User Info (Valid Token): {'✅ PASS' if auth_me_valid else '❌ FAIL'}")
    print(f"   Get User Info (Invalid Token): {'✅ PASS' if auth_me_invalid else '❌ FAIL'}")
    print(f"   Get User Info (No Token): {'✅ PASS' if auth_me_no_token else '❌ FAIL'}")
    
    print("\n🛡️ ROLE-BASED ACCESS CONTROL:")
    print(f"   Admin Movies Endpoint: {'✅ PASS' if admin_with_token['movies'] else '❌ FAIL'}")
    print(f"   Admin Cinemas Endpoint: {'✅ PASS' if admin_with_token['cinemas'] else '❌ FAIL'}")
    print(f"   Admin News Endpoint: {'✅ PASS' if admin_with_token['news'] else '❌ FAIL'}")
    print(f"   Admin Showtimes Endpoint: {'✅ PASS' if admin_with_token['showtimes'] else '❌ FAIL'}")
    
    print("\n🚫 UNAUTHORIZED ACCESS PROTECTION:")
    print(f"   Movies (No Token): {'✅ PASS' if admin_without_token['movies'] else '❌ FAIL'}")
    print(f"   Cinemas (No Token): {'✅ PASS' if admin_without_token['cinemas'] else '❌ FAIL'}")
    print(f"   News (No Token): {'✅ PASS' if admin_without_token['news'] else '❌ FAIL'}")
    print(f"   Showtimes (No Token): {'✅ PASS' if admin_without_token['showtimes'] else '❌ FAIL'}")
    
    print("\n👤 USER TOKEN RESTRICTIONS:")
    print(f"   Movies (User Token): {'✅ PASS' if admin_with_user_token['movies'] else '❌ FAIL'}")
    print(f"   Cinemas (User Token): {'✅ PASS' if admin_with_user_token['cinemas'] else '❌ FAIL'}")
    print(f"   News (User Token): {'✅ PASS' if admin_with_user_token['news'] else '❌ FAIL'}")
    print(f"   Showtimes (User Token): {'✅ PASS' if admin_with_user_token['showtimes'] else '❌ FAIL'}")
    
    print("\n📊 ADMIN STATS ENDPOINTS:")
    print(f"   User Statistics: {'✅ PASS' if admin_stats['users'] else '❌ FAIL'}")
    print(f"   Booking Statistics: {'✅ PASS' if admin_stats['bookings'] else '❌ FAIL'}")
    
    print("\n🎫 ENHANCED BOOKING:")
    print(f"   Authenticated Booking: {'✅ PASS' if booking_auth else '❌ FAIL'}")
    print(f"   Guest Booking: {'✅ PASS' if booking_guest else '❌ FAIL'}")
    
    # Calculate overall results
    all_tests = [
        auth_login_admin, auth_login_invalid, auth_register, auth_register_duplicate,
        auth_me_valid, auth_me_invalid, auth_me_no_token,
        admin_with_token['movies'], admin_with_token['cinemas'], admin_with_token['news'], admin_with_token['showtimes'],
        admin_without_token['movies'], admin_without_token['cinemas'], admin_without_token['news'], admin_without_token['showtimes'],
        admin_with_user_token['movies'], admin_with_user_token['cinemas'], admin_with_user_token['news'], admin_with_user_token['showtimes'],
        admin_stats['users'], admin_stats['bookings'],
        booking_auth, booking_guest
    ]
    
    passed_tests = sum(all_tests)
    total_tests = len(all_tests)
    
    print(f"\n🎯 OVERALL RESULT: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL AUTHENTICATION TESTS PASSED!")
        return True
    else:
        print("⚠️  Some authentication tests failed. Check logs above for details.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)