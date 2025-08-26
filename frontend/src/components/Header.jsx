import React, { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Mua Vé', href: '#', active: true },
    { name: 'Phim', href: '#' },
    { name: 'Sân Phẩm', href: '#' },
    { name: 'Góc Điện Ảnh', href: '#' },
    { name: 'Sự Kiện', href: '#' },
    { name: 'Rạp/Giá Vé', href: '#' }
  ];

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://www.galaxycine.vn/website/images/galaxy-logo.png" 
              alt="Galaxy Cinema" 
              className="h-10 w-auto"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1489599112903-4e6e116119c4?w=120&h=40&fit=crop";
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-orange-500 text-white rounded-md' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Login/Member */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Đăng Nhập</span>
              <div className="flex items-center space-x-1 bg-yellow-400 px-2 py-1 rounded text-xs font-semibold">
                <span>THAM GIA</span>
                <span className="text-orange-600">G STAR</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${
                    item.active 
                      ? 'bg-orange-500 text-white rounded-md' 
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2 border-t">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <span className="text-gray-600">Đăng Nhập</span>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-400 px-2 py-1 rounded text-xs font-semibold w-fit">
                  <span>THAM GIA</span>
                  <span className="text-orange-600">G STAR</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;