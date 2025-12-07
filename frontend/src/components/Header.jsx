import React, { useState } from 'react';
import { Activity, GitCompare, Info, TrendingUp, Menu, X, Rocket, LogIn } from 'lucide-react';

const Header = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hàm xử lý đăng nhập (hiện tại chỉ là placeholder)
  const handleLogin = () => {
    alert("Chức năng đăng nhập sẽ được xây dựng sau!");
    // Đây là nơi bạn sẽ thêm logic chuyển hướng đến trang đăng nhập thực tế
  };

  const navItems = [
    { id: 'tracker', label: 'Theo dõi', icon: <Activity size={18} /> },
    { id: 'predict', label: 'Dự đoán', icon: <Rocket size={18} /> },
    { id: 'compare', label: 'So sánh', icon: <GitCompare size={18} /> },
    { id: 'about', label: 'Giới thiệu', icon: <Info size={18} /> },
  ];

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('tracker')}>
            <TrendingUp className="text-[#3a7bf7]" />
            <span className="text-xl font-bold text-white">Stock<span className="text-[#3a7bf7]">Tracker</span></span>
        </div>
        
        {/* Desktop Navigation & Login Button Group */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-6 lg:space-x-8">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      currentPage === item.id 
                        ? 'text-[#3a7bf7] border-[#3a7bf7] font-semibold' 
                        : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                    }`}>
                    {item.icon} {item.label}
                  </button>
                ))}
            </div>

            {/* Login Button */}
            <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-[#3a7bf7] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#5a8ff7] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3a7bf7] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
            >
                <LogIn size={18} />
                Đăng nhập
            </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#2a2a2a] pb-2 absolute w-full z-40 shadow-xl">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
              className={`flex items-center w-full gap-3 px-6 py-3 text-left text-base font-medium transition-colors ${
                currentPage === item.id 
                  ? 'bg-[#2a2a2a] text-[#3a7bf7]' 
                  : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
          
          {/* Mobile Login Button (Added) */}
          <button
              onClick={() => { handleLogin(); setIsMenuOpen(false); }}
              className="flex items-center w-full gap-3 px-6 py-3 text-left text-base font-semibold bg-[#3a7bf7] text-white hover:bg-[#5a8ff7] transition-colors mt-2"
          >
              <LogIn size={18} />
              Đăng nhập
          </button>
        </div>
      )}
    </nav>
  );
};
export default Header;