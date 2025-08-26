from sqlalchemy.orm import Session
from database import SessionLocal, create_tables
from models import Movie, Cinema, Screen, Showtime, News, Booking
from datetime import date, time, datetime, timedelta
import random

def seed_database():
    """Seed database with sample data"""
    
    # Create tables first
    create_tables()
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Booking).delete()
        db.query(Showtime).delete()
        db.query(Screen).delete()
        db.query(Movie).delete()
        db.query(Cinema).delete()
        db.query(News).delete()
        db.commit()
        
        # Seed Movies
        movies_data = [
            {
                "title": "Kimetsu no Yaiba: Thành Cuốn Diệt Quỷ - Nát Hai Thành",
                "poster": "https://images.unsplash.com/photo-1598441792997-12d77ce6f1ae?w=300&h=450&fit=crop",
                "rating": "T16",
                "genre": "Hoạt Hình, Hành Động",
                "duration": 117,
                "status": "showing",
                "trailer": "https://www.youtube.com/watch?v=ATJYac_dORw",
                "description": "Câu chuyện tiếp theo của Demon Slayer với những trận chiến mãn nhãn.",
                "director": "Haruo Sotozaki",
                "cast": ["Natsuki Hanae", "Satomi Sato", "Hiro Shimono"],
                "release_date": date(2024, 2, 23)
            },
            {
                "title": "Avatar: The Way of Water",
                "poster": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
                "rating": "T13",
                "genre": "Hành Động, Phiêu Lưu, Khoa Học Viễn Tưởng",
                "duration": 192,
                "status": "showing",
                "trailer": "https://www.youtube.com/watch?v=d9MyW72ELq0",
                "description": "Jake Sully sống cùng gia đình mình trên hành tinh Pandora.",
                "director": "James Cameron",
                "cast": ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
                "release_date": date(2022, 12, 16)
            },
            {
                "title": "Black Panther: Wakanda Forever",
                "poster": "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
                "rating": "T13", 
                "genre": "Hành Động, Phiêu Lưu, Drama",
                "duration": 161,
                "status": "showing",
                "trailer": "https://www.youtube.com/watch?v=_Z3QKkl1WyM",
                "description": "Nữ hoàng Ramonda, Shuri, M'Baku, Okoye và Dora Milaje chiến đấu để bảo vệ đất nước.",
                "director": "Ryan Coogler",
                "cast": ["Letitia Wright", "Angela Bassett", "Tenoch Huerta"],
                "release_date": date(2022, 11, 11)
            },
            {
                "title": "Spider-Man: Across the Spider-Verse", 
                "poster": "https://images.unsplash.com/photo-1635863138275-d9864d29c6ed?w=300&h=450&fit=crop",
                "rating": "T13",
                "genre": "Hoạt Hình, Hành Động, Phiêu Lưu",
                "duration": 140,
                "status": "coming",
                "trailer": "https://www.youtube.com/watch?v=cqGjhVJWtEg",
                "description": "Miles Morales trải nghiệm cuộc phiêu lưu qua đa vũ trụ.",
                "director": "Joaquim Dos Santos",
                "cast": ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry"],
                "release_date": date(2025, 3, 15)
            },
            {
                "title": "Fast X",
                "poster": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=450&fit=crop",
                "rating": "T16",
                "genre": "Hành Động, Hình Sự, Thriller", 
                "duration": 141,
                "status": "showing",
                "trailer": "https://www.youtube.com/watch?v=32RAq6JzY-w",
                "description": "Dom Toretto và gia đình đối mặt với kẻ thù nguy hiểm nhất từ trước đến nay.",
                "director": "Louis Leterrier",
                "cast": ["Vin Diesel", "Michelle Rodriguez", "Tyrese Gibson"],
                "release_date": date(2023, 5, 19)
            }
        ]
        
        movies = []
        for movie_data in movies_data:
            movie = Movie(**movie_data)
            db.add(movie)
            movies.append(movie)
        
        # Seed Cinemas
        cinemas_data = [
            {
                "name": "Galaxy Nguyễn Du",
                "address": "116 Nguyễn Du, Q1, TP.HCM",
                "province": "TP.HCM"
            },
            {
                "name": "Galaxy Tân Bình", 
                "address": "246 Nguyễn Hồng Đào, Q.Tân Bình, TP.HCM",
                "province": "TP.HCM"
            },
            {
                "name": "Galaxy Sala",
                "address": "Đường số 8, KDC Him Lam, Q7, TP.HCM", 
                "province": "TP.HCM"
            },
            {
                "name": "Galaxy Huế",
                "address": "25 Hai Bà Trưng, TP.Huế",
                "province": "Thừa Thiên Huế"
            }
        ]
        
        cinemas = []
        for cinema_data in cinemas_data:
            cinema = Cinema(**cinema_data)
            db.add(cinema)
            cinemas.append(cinema)
            
        db.commit()
        db.refresh(movies[0])  # Refresh to get IDs
        
        # Seed Screens
        for cinema in cinemas:
            for screen_num in range(1, 6):  # 5 screens per cinema
                screen_type = random.choice(["2D", "3D", "IMAX"])
                total_seats = 150 if screen_type == "IMAX" else 120
                
                screen = Screen(
                    cinema_id=cinema.id,
                    screen_number=screen_num,
                    screen_type=screen_type,
                    total_seats=total_seats
                )
                db.add(screen)
        
        # Seed News
        news_data = [
            {
                "title": "Khuyến Mãi Lớn - Giảm 50% Vé Xem Phim Thứ 2",
                "summary": "Chương trình khuyến mãi đặc biệt dành cho thành viên G-Star",
                "content": "Đến Galaxy Cinema vào thứ 2 hằng tuần để nhận ưu đãi giảm giá 50% cho tất cả các suất chiếu.",
                "image": "https://images.unsplash.com/photo-1489599112903-4e6e116119c4?w=400&h=250&fit=crop",
                "category": "promotion",
                "publish_date": date.today() - timedelta(days=1)
            },
            {
                "title": "Ra Mắt Rạp Galaxy Sala với Công Nghệ IMAX Mới Nhất", 
                "summary": "Trải nghiệm điện ảnh đẳng cấp tại cụm rạp mới",
                "content": "Galaxy Sala chính thức khai trương với hệ thống âm thanh IMAX hiện đại nhất.",
                "image": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=250&fit=crop",
                "category": "news", 
                "publish_date": date.today() - timedelta(days=5)
            }
        ]
        
        for news_item in news_data:
            news = News(**news_item)
            db.add(news)
            
        db.commit()
        
        # Get all screens for showtime creation
        screens = db.query(Screen).all()
        
        # Seed Showtimes (for next 7 days)
        for day_offset in range(7):
            show_date = date.today() + timedelta(days=day_offset)
            
            for movie in movies:
                if movie.status == "showing":
                    # Create 3-4 showtimes per day for each showing movie
                    times = ["10:00", "13:30", "16:45", "19:15", "22:00"]
                    selected_times = random.sample(times, random.randint(3, 4))
                    
                    for show_time_str in selected_times:
                        # Random cinema and screen
                        screen = random.choice(screens)
                        
                        # Price based on time and screen type
                        base_price = 80000  # 80k VND
                        if screen.screen_type == "3D":
                            base_price += 20000
                        elif screen.screen_type == "IMAX":
                            base_price += 40000
                            
                        if show_time_str in ["19:15", "22:00"]:  # Evening shows
                            base_price += 15000
                            
                        showtime = Showtime(
                            movie_id=movie.id,
                            cinema_id=screen.cinema_id,
                            screen_id=screen.id,
                            show_date=show_date,
                            show_time=time.fromisoformat(show_time_str),
                            price=base_price,
                            available_seats=screen.total_seats,
                            booked_seats=[]
                        )
                        db.add(showtime)
        
        db.commit()
        print("✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()