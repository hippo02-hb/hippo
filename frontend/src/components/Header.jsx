import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: 'Mua Vé', to: '/' },
    { name: 'Phim', to: '/search' },
    { name: 'Tra Cứu Vé', to: '/lookup' },
    { name: 'Sản Phẩm', to: '/products' },
    { name: 'Góc Điện Ảnh', to: '/cinema-corner' },
    { name: 'Sự Kiện', to: '/events' },
    { name: 'Rạp/Giá Vé', to: '/cinemas-pricing' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const linkBase = 'relative group px-3 py-2 text-sm font-medium transition-colors';
  const linkActive = 'text-orange-600';
  const linkInactive = 'text-gray-600 hover:text-orange-600';
  const linkUnderline = 'after:absolute after:left-3 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all group-hover:after:w-[calc(100%-24px)]';

  return (
    <header className={`sticky top-0 z-50 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur'} `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" aria-label="Galaxy Cinema">
              <img
                src="https://www.galaxycine.vn/website/images/galaxy-logo.png"
                alt="Galaxy Cinema"
                className="h-9 w-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1611262588019-db6935269279?w=120&h=36&fit=crop';
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 ml-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `${linkBase} ${linkUnderline} ${isActive ? linkActive : linkInactive}`}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm phim, thể loại, đạo diễn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 w-80 text-sm rounded-full border-gray-200 focus:ring-orange-500"
              />
            </div>
          </form>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Button variant="outline" className="rounded-full h-8 px-3 text-sm">
              <LogIn className="h-4 w-4 mr-1" /> Đăng nhập
            </Button>
            <Button className="rounded-full h-8 px-3 text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              G STAR
            </Button>
          </div>

          {/* Mobile search icon */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => navigate('/search')}
            aria-label="Tìm kiếm"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <div className="font-semibold">Menu</div>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} aria-label="Đóng menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Search (Mobile) */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm phim..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm rounded-full"
                  />
                </div>
              </form>

              {/* Nav links */}
              <div className="pt-2 border-t">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `block px-3 py-2 rounded-md ${isActive ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t flex items-center gap-2">
                <Button variant="outline" className="rounded-full h-9 px-4 text-sm flex-1">Đăng nhập</Button>
                <Button className="rounded-full h-9 px-4 text-sm flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">G STAR</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;