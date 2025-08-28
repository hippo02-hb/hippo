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

def test_health_endpoint():
    """Test GET /api/health"""
    print("\n1. Testing Health Endpoint")
    print("-" * 30)
    
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get('status') == 'healthy':
                print("✅ Health check PASSED")
                return True
            else:
                print("❌ Health check FAILED - status not 'healthy'")
                return False
        else:
            print(f"❌ Health check FAILED - Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Health check FAILED - Exception: {str(e)}")
        return False

def test_movies_endpoints():
    """Test Movies endpoints: GET /api/movies/, POST /api/movies/, GET /api/movies/{id}"""
    print("\n2. Testing Movies Endpoints")
    print("-" * 30)
    
    results = {"list": False, "create": False, "get_by_id": False}
    
    # Test GET /api/movies/
    try:
        print("\n2a. Testing GET /api/movies/")
        response = requests.get(f"{API_BASE_URL}/movies/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            movies = response.json()
            print(f"Response: {json.dumps(movies[:2] if len(movies) > 2 else movies, indent=2)}...")
            print(f"Total movies found: {len(movies)}")
            results["list"] = True
            print("✅ GET /api/movies/ PASSED")
        else:
            print(f"❌ GET /api/movies/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ GET /api/movies/ FAILED - Exception: {str(e)}")
    
    # Test POST /api/movies/
    try:
        print("\n2b. Testing POST /api/movies/")
        movie_data = {
            "title": "Avengers: Endgame",
            "poster": "https://example.com/avengers-endgame.jpg",
            "rating": "PG-13",
            "genre": "Action, Adventure, Drama",
            "duration": 181,
            "status": "showing",
            "trailer": "https://youtube.com/watch?v=example",
            "description": "After the devastating events of Avengers: Infinity War, the universe is in ruins.",
            "director": "Anthony Russo, Joe Russo",
            "cast": ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
            "release_date": "2019-04-26"
        }
        
        response = requests.post(f"{API_BASE_URL}/movies/", 
                               json=movie_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_movie = response.json()
            print(f"Created Movie: {json.dumps(created_movie, indent=2, default=str)}")
            movie_id = created_movie.get('id')
            results["create"] = True
            print("✅ POST /api/movies/ PASSED")
            
            # Test GET /api/movies/{id}
            if movie_id:
                print(f"\n2c. Testing GET /api/movies/{movie_id}")
                response = requests.get(f"{API_BASE_URL}/movies/{movie_id}", timeout=10)
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    movie = response.json()
                    print(f"Retrieved Movie: {json.dumps(movie, indent=2, default=str)}")
                    results["get_by_id"] = True
                    print("✅ GET /api/movies/{id} PASSED")
                else:
                    print(f"❌ GET /api/movies/{movie_id} FAILED - Status: {response.status_code}")
                    print(f"Response: {response.text}")
        else:
            print(f"❌ POST /api/movies/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Movies endpoints FAILED - Exception: {str(e)}")
    
    return results

def test_cinemas_endpoints():
    """Test Cinemas endpoints: GET /api/cinemas/, POST /api/cinemas/, GET /api/cinemas/{id}"""
    print("\n3. Testing Cinemas Endpoints")
    print("-" * 30)
    
    results = {"list": False, "create": False, "get_by_id": False}
    
    # Test GET /api/cinemas/
    try:
        print("\n3a. Testing GET /api/cinemas/")
        response = requests.get(f"{API_BASE_URL}/cinemas/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            cinemas = response.json()
            print(f"Response: {json.dumps(cinemas[:2] if len(cinemas) > 2 else cinemas, indent=2)}...")
            print(f"Total cinemas found: {len(cinemas)}")
            results["list"] = True
            print("✅ GET /api/cinemas/ PASSED")
        else:
            print(f"❌ GET /api/cinemas/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ GET /api/cinemas/ FAILED - Exception: {str(e)}")
    
    # Test POST /api/cinemas/
    try:
        print("\n3b. Testing POST /api/cinemas/")
        cinema_data = {
            "name": "Galaxy Cinema Nguyen Trai",
            "address": "123 Nguyen Trai Street, District 1, Ho Chi Minh City",
            "province": "Ho Chi Minh"
        }
        
        response = requests.post(f"{API_BASE_URL}/cinemas/", 
                               json=cinema_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_cinema = response.json()
            print(f"Created Cinema: {json.dumps(created_cinema, indent=2, default=str)}")
            cinema_id = created_cinema.get('id')
            results["create"] = True
            print("✅ POST /api/cinemas/ PASSED")
            
            # Test GET /api/cinemas/{id}
            if cinema_id:
                print(f"\n3c. Testing GET /api/cinemas/{cinema_id}")
                response = requests.get(f"{API_BASE_URL}/cinemas/{cinema_id}", timeout=10)
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    cinema = response.json()
                    print(f"Retrieved Cinema: {json.dumps(cinema, indent=2, default=str)}")
                    results["get_by_id"] = True
                    print("✅ GET /api/cinemas/{id} PASSED")
                else:
                    print(f"❌ GET /api/cinemas/{cinema_id} FAILED - Status: {response.status_code}")
                    print(f"Response: {response.text}")
        else:
            print(f"❌ POST /api/cinemas/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Cinemas endpoints FAILED - Exception: {str(e)}")
    
    return results

def test_news_endpoints():
    """Test News endpoints: GET /api/news/, POST /api/news/, GET /api/news/{id}"""
    print("\n4. Testing News Endpoints")
    print("-" * 30)
    
    results = {"list": False, "create": False, "get_by_id": False}
    
    # Test GET /api/news/
    try:
        print("\n4a. Testing GET /api/news/")
        response = requests.get(f"{API_BASE_URL}/news/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            news = response.json()
            print(f"Response: {json.dumps(news[:2] if len(news) > 2 else news, indent=2)}...")
            print(f"Total news found: {len(news)}")
            results["list"] = True
            print("✅ GET /api/news/ PASSED")
        else:
            print(f"❌ GET /api/news/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ GET /api/news/ FAILED - Exception: {str(e)}")
    
    # Test POST /api/news/
    try:
        print("\n4b. Testing POST /api/news/")
        news_data = {
            "title": "Galaxy Cinema Grand Opening Sale",
            "summary": "Special discount for all movies this weekend",
            "content": "Join us for our grand opening celebration with 50% off all movie tickets this weekend. Don't miss out on the latest blockbusters at unbeatable prices!",
            "image": "https://example.com/grand-opening.jpg",
            "category": "promotion",
            "publish_date": "2024-01-15",
            "is_active": True
        }
        
        response = requests.post(f"{API_BASE_URL}/news/", 
                               json=news_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_news = response.json()
            print(f"Created News: {json.dumps(created_news, indent=2, default=str)}")
            news_id = created_news.get('id')
            results["create"] = True
            print("✅ POST /api/news/ PASSED")
            
            # Test GET /api/news/{id}
            if news_id:
                print(f"\n4c. Testing GET /api/news/{news_id}")
                response = requests.get(f"{API_BASE_URL}/news/{news_id}", timeout=10)
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    news_item = response.json()
                    print(f"Retrieved News: {json.dumps(news_item, indent=2, default=str)}")
                    results["get_by_id"] = True
                    print("✅ GET /api/news/{id} PASSED")
                else:
                    print(f"❌ GET /api/news/{news_id} FAILED - Status: {response.status_code}")
                    print(f"Response: {response.text}")
        else:
            print(f"❌ POST /api/news/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ News endpoints FAILED - Exception: {str(e)}")
    
    return results

def test_booking_endpoints():
    """Test Booking endpoints: POST /api/bookings/, GET /api/bookings/code/{code}, GET /api/bookings/{id}/details, PATCH /api/bookings/{id}/cancel"""
    print("\n5. Testing Booking Endpoints")
    print("-" * 30)
    
    results = {"create": False, "get_by_code": False, "get_details": False, "cancel": False}
    booking_id = None
    booking_code = None
    
    # First, get a valid showtime ID
    try:
        print("\n5a. Getting available showtimes...")
        response = requests.get(f"{API_BASE_URL}/showtimes/", timeout=10)
        if response.status_code == 200:
            showtimes = response.json()
            if showtimes:
                showtime_id = showtimes[0]['id']
                print(f"Using showtime ID: {showtime_id}")
            else:
                print("❌ No showtimes available for testing")
                return results
        else:
            print(f"❌ Failed to get showtimes - Status: {response.status_code}")
            return results
    except Exception as e:
        print(f"❌ Failed to get showtimes - Exception: {str(e)}")
        return results
    
    # Test POST /api/bookings/
    try:
        print("\n5b. Testing POST /api/bookings/")
        booking_data = {
            "showtime_id": showtime_id,
            "customer_name": "Nguyen Van Minh",
            "customer_phone": "0901234567",
            "customer_email": "minh.nguyen@email.com",
            "seats": ["B3", "B4"],
            "total_amount": 200000,
            "payment_method": "credit_card"
        }
        
        response = requests.post(f"{API_BASE_URL}/bookings/", 
                               json=booking_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_booking = response.json()
            print(f"Created Booking: {json.dumps(created_booking, indent=2, default=str)}")
            booking_id = created_booking.get('id')
            booking_code = created_booking.get('booking_code')
            
            # Verify booking code format (GCxxxxxxxx)
            if booking_code and booking_code.startswith('GC') and len(booking_code) == 10:
                print(f"✅ Booking code format correct: {booking_code}")
                results["create"] = True
                print("✅ POST /api/bookings/ PASSED")
            else:
                print(f"❌ Invalid booking code format: {booking_code}")
        else:
            print(f"❌ POST /api/bookings/ FAILED - Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ POST /api/bookings/ FAILED - Exception: {str(e)}")
    
    # Test GET /api/bookings/code/{code}
    if booking_code:
        try:
            print(f"\n5c. Testing GET /api/bookings/code/{booking_code}")
            response = requests.get(f"{API_BASE_URL}/bookings/code/{booking_code}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                booking_by_code = response.json()
                print(f"Retrieved Booking by Code: {json.dumps(booking_by_code, indent=2, default=str)}")
                
                # Verify it's the same booking
                if booking_by_code.get('id') == booking_id:
                    results["get_by_code"] = True
                    print("✅ GET /api/bookings/code/{code} PASSED")
                else:
                    print("❌ Retrieved booking ID doesn't match created booking")
            else:
                print(f"❌ GET /api/bookings/code/{booking_code} FAILED - Status: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ GET /api/bookings/code/{booking_code} FAILED - Exception: {str(e)}")
    
    # Test GET /api/bookings/{id}/details
    if booking_id:
        try:
            print(f"\n5d. Testing GET /api/bookings/{booking_id}/details")
            response = requests.get(f"{API_BASE_URL}/bookings/{booking_id}/details", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                booking_details = response.json()
                print(f"Booking Details: {json.dumps(booking_details, indent=2, default=str)}")
                
                # Verify structure contains booking, movie, cinema, showtime
                required_keys = ['booking', 'movie', 'cinema', 'showtime']
                if all(key in booking_details for key in required_keys):
                    results["get_details"] = True
                    print("✅ GET /api/bookings/{id}/details PASSED")
                else:
                    print(f"❌ Missing required keys in response. Expected: {required_keys}")
            else:
                print(f"❌ GET /api/bookings/{booking_id}/details FAILED - Status: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ GET /api/bookings/{booking_id}/details FAILED - Exception: {str(e)}")
    
    # Test PATCH /api/bookings/{id}/cancel
    if booking_id:
        try:
            print(f"\n5e. Testing PATCH /api/bookings/{booking_id}/cancel")
            response = requests.patch(f"{API_BASE_URL}/bookings/{booking_id}/cancel", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                cancelled_booking = response.json()
                print(f"Cancelled Booking: {json.dumps(cancelled_booking, indent=2, default=str)}")
                
                # Verify status changed to 'cancelled'
                if cancelled_booking.get('status') == 'cancelled':
                    results["cancel"] = True
                    print("✅ PATCH /api/bookings/{id}/cancel PASSED")
                else:
                    print(f"❌ Booking status not 'cancelled': {cancelled_booking.get('status')}")
            else:
                print(f"❌ PATCH /api/bookings/{booking_id}/cancel FAILED - Status: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ PATCH /api/bookings/{booking_id}/cancel FAILED - Exception: {str(e)}")
    
    # Test edge cases
    print("\n5f. Testing edge cases...")
    
    # Test invalid booking code
    try:
        print("Testing invalid booking code...")
        response = requests.get(f"{API_BASE_URL}/bookings/code/INVALID123", timeout=10)
        if response.status_code == 404:
            print("✅ Invalid booking code returns 404 as expected")
        else:
            print(f"⚠️ Invalid booking code returned {response.status_code}, expected 404")
    except Exception as e:
        print(f"⚠️ Error testing invalid booking code: {str(e)}")
    
    # Test non-existent booking ID
    try:
        print("Testing non-existent booking ID...")
        response = requests.get(f"{API_BASE_URL}/bookings/99999/details", timeout=10)
        if response.status_code == 404:
            print("✅ Non-existent booking ID returns 404 as expected")
        else:
            print(f"⚠️ Non-existent booking ID returned {response.status_code}, expected 404")
    except Exception as e:
        print(f"⚠️ Error testing non-existent booking ID: {str(e)}")
    
    return results

def main():
    """Run all tests and provide summary"""
    print("Galaxy Cinema Backend API Testing")
    print("=" * 60)
    
    # Run all tests
    health_result = test_health_endpoint()
    movies_results = test_movies_endpoints()
    cinemas_results = test_cinemas_endpoints()
    news_results = test_news_endpoints()
    booking_results = test_booking_endpoints()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    print(f"Health Endpoint: {'✅ PASS' if health_result else '❌ FAIL'}")
    print(f"Movies List: {'✅ PASS' if movies_results['list'] else '❌ FAIL'}")
    print(f"Movies Create: {'✅ PASS' if movies_results['create'] else '❌ FAIL'}")
    print(f"Movies Get by ID: {'✅ PASS' if movies_results['get_by_id'] else '❌ FAIL'}")
    print(f"Cinemas List: {'✅ PASS' if cinemas_results['list'] else '❌ FAIL'}")
    print(f"Cinemas Create: {'✅ PASS' if cinemas_results['create'] else '❌ FAIL'}")
    print(f"Cinemas Get by ID: {'✅ PASS' if cinemas_results['get_by_id'] else '❌ FAIL'}")
    print(f"News List: {'✅ PASS' if news_results['list'] else '❌ FAIL'}")
    print(f"News Create: {'✅ PASS' if news_results['create'] else '❌ FAIL'}")
    print(f"News Get by ID: {'✅ PASS' if news_results['get_by_id'] else '❌ FAIL'}")
    print(f"Booking Create: {'✅ PASS' if booking_results['create'] else '❌ FAIL'}")
    print(f"Booking Get by Code: {'✅ PASS' if booking_results['get_by_code'] else '❌ FAIL'}")
    print(f"Booking Get Details: {'✅ PASS' if booking_results['get_details'] else '❌ FAIL'}")
    print(f"Booking Cancel: {'✅ PASS' if booking_results['cancel'] else '❌ FAIL'}")
    
    # Overall result
    all_tests = [
        health_result,
        movies_results['list'], movies_results['create'], movies_results['get_by_id'],
        cinemas_results['list'], cinemas_results['create'], cinemas_results['get_by_id'],
        news_results['list'], news_results['create'], news_results['get_by_id'],
        booking_results['create'], booking_results['get_by_code'], 
        booking_results['get_details'], booking_results['cancel']
    ]
    
    passed_tests = sum(all_tests)
    total_tests = len(all_tests)
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED!")
        return True
    else:
        print("⚠️  Some tests failed. Check logs above for details.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)