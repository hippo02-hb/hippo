// Mock data for Galaxy Cinema clone
export const mockMovies = [
  {
    id: 1,
    title: "Kimetsu no Yaiba: Thành Cuốn Diệt Quỷ - Nát Hai Thành",
    poster: "https://images.unsplash.com/photo-1598441792997-12d77ce6f1ae?w=300&h=450&fit=crop",
    rating: "T16",
    genre: "Hoạt Hình, Hành Động",
    duration: "117 phút",
    status: "showing",
    trailer: "https://www.youtube.com/watch?v=ATJYac_dORw",
    description: "Câu chuyện tiếp theo của Demon Slayer với những trận chiến mãn nhãn."
  },
  {
    id: 2,
    title: "Avatar: The Way of Water",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: "T13",
    genre: "Hành Động, Phiêu Lưu, Khoa Học Viễn Tưởng",
    duration: "192 phút",
    status: "showing",
    trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    description: "Jake Sully sống cùng gia đình mình trên hành tinh Pandora."
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=450&fit=crop",
    rating: "T13",
    genre: "Hành Động, Phiêu Lưu, Drama",
    duration: "161 phút",
    status: "showing",
    trailer: "https://www.youtube.com/watch?v=_Z3QKkl1WyM",
    description: "Nữ hoàng Ramonda, Shuri, M'Baku, Okoye và Dora Milaje chiến đấu để bảo vệ đất nước."
  },
  {
    id: 4,
    title: "Spider-Man: Across the Spider-Verse",
    poster: "https://images.unsplash.com/photo-1635863138275-d9864d29c6ed?w=300&h=450&fit=crop",
    rating: "T13",
    genre: "Hoạt Hình, Hành Động, Phiêu Lưu",
    duration: "140 phút",
    status: "coming",
    trailer: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    description: "Miles Morales trải nghiệm cuộc phiêu lưu qua đa vũ trụ."
  },
  {
    id: 5,
    title: "Transformers: Rise of the Beasts",
    poster: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&h=450&fit=crop",
    rating: "T13",
    genre: "Hành Động, Khoa Học Viễn Tưởng, Phiêu Lưu",
    duration: "127 phút",
    status: "coming",
    trailer: "https://www.youtube.com/watch?v=WWWDskI46Js",
    description: "Cuộc chiến tiếp tục với sự xuất hiện của Maximals, Predacons và Terrorcons."
  },
  {
    id: 6,
    title: "Fast X",
    poster: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=450&fit=crop",
    rating: "T16",
    genre: "Hành Động, Hình Sự, Thriller",
    duration: "141 phút",
    status: "showing",
    trailer: "https://www.youtube.com/watch?v=32RAq6JzY-w",
    description: "Dom Toretto và gia đình đối mặt với kẻ thù nguy hiểm nhất từ trước đến nay."
  }
];

export const mockCinemas = [
  {
    id: 1,
    name: "Galaxy Nguyễn Du",
    address: "116 Nguyễn Du, Q1, TP.HCM",
    province: "TP.HCM"
  },
  {
    id: 2,
    name: "Galaxy Tân Bình",
    address: "246 Nguyễn Hồng Đào, Q.Tân Bình, TP.HCM",
    province: "TP.HCM"
  },
  {
    id: 3,
    name: "Galaxy Sala",
    address: "Đường số 8, KDC Him Lam, Q7, TP.HCM",
    province: "TP.HCM"
  },
  {
    id: 4,
    name: "Galaxy Huế",
    address: "25 Hai Bà Trưng, TP.Huế",
    province: "Thừa Thiên Huế"
  },
  {
    id: 5,
    name: "Galaxy Hà Nội",
    address: "87 Láng Hạ, Q.Đống Đa, Hà Nội",
    province: "Hà Nội"
  }
];

export const mockShowtimes = [
  {
    movieId: 1,
    cinemaId: 1,
    date: "2025-01-26",
    times: ["10:00", "13:30", "16:45", "19:15", "22:00"]
  },
  {
    movieId: 1,
    cinemaId: 2,
    date: "2025-01-26", 
    times: ["11:15", "14:20", "17:30", "20:45"]
  },
  {
    movieId: 2,
    cinemaId: 1,
    date: "2025-01-26",
    times: ["09:30", "13:00", "16:30", "20:00"]
  },
  {
    movieId: 3,
    cinemaId: 1,
    date: "2025-01-26",
    times: ["12:00", "15:15", "18:45", "21:30"]
  }
];

export const mockNews = [
  {
    id: 1,
    title: "Khuyến Mãi Lớn - Giảm 50% Vé Xem Phim Thứ 2",
    image: "https://images.unsplash.com/photo-1489599112903-4e6e116119c4?w=400&h=250&fit=crop",
    summary: "Chương trình khuyến mãi đặc biệt dành cho thành viên G-Star",
    date: "2025-01-25"
  },
  {
    id: 2,
    title: "Ra Mắt Rạp Galaxy Sala với Công Nghệ IMAX Mới Nhất",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=250&fit=crop",
    summary: "Trải nghiệm điện ảnh đẳng cấp tại cụm rạp mới",
    date: "2025-01-20"
  }
];

export const mockHeroSlides = [
  {
    id: 1,
    title: "KIMETSU NO YAIBA",
    subtitle: "THÀNH CUỐN DIỆT QUỶ",
    description: "ĐANG CHIẾU TẠI RẠP",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=800&fit=crop",
    ctaText: "ĐẶT VÉ NGAY"
  },
  {
    id: 2,
    title: "AVATAR",
    subtitle: "THE WAY OF WATER", 
    description: "ĐANG CHIẾU TẠI RẠP",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=800&fit=crop",
    ctaText: "ĐẶT VÉ NGAY"
  }
];

export const mockProvinces = [
  "TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Thừa Thiên Huế", "Bình Dương", "Đồng Nai"
];