import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const cinemaLocations = [
    "Galaxy Nguyễn Du", "Galaxy Tân Bình", "Galaxy Sala", 
    "Galaxy Huế", "Galaxy Hà Nội", "Galaxy Đà Nẵng"
  ];

  const quickLinks = [
    "Lịch chiếu", "Giá vé", "Khuyến mãi", 
    "Thành viên", "Tuyển dụng", "Liên hệ"
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <img 
              src="https://images.unsplash.com/photo-1489599112903-4e6e116119c4?w=120&h=40&fit=crop" 
              alt="Galaxy Cinema" 
              className="h-12 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Galaxy Cinema - Chuỗi rạp chiếu phim hiện đại với công nghệ âm thanh, 
              hình ảnh tiên tiến nhất hiện nay.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Cinema Locations */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-500">Hệ Thống Rạp</h3>
            <ul className="space-y-2">
              {cinemaLocations.map((location, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-500">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-500">Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-orange-500 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Tầng 3, Tòa nhà Bitexco Financial Tower, 
                  2 Hai Trưng, Q1, TP.HCM
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <p className="text-gray-400 text-sm">1900 2224</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <p className="text-gray-400 text-sm">info@galaxycine.vn</p>
              </div>
            </div>

            {/* Mobile App Download */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-orange-500">Tải ứng dụng</h4>
              <div className="flex space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1611262588024-d12430b98920?w=120&h=40&fit=crop" 
                  alt="App Store" 
                  className="h-10 hover:opacity-80 transition-opacity cursor-pointer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1611262588019-db6935269279?w=120&h=40&fit=crop" 
                  alt="Google Play" 
                  className="h-10 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Galaxy Cinema. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;