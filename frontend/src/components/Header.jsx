import React, { useState } from 'react';
import { Activity, GitCompare, Info, TrendingUp, Menu, X, Rocket, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const Header = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'tracker', label: 'Theo dõi', icon: <Activity size={18} /> },
    { id: 'predict', label: 'Dự đoán', icon: <Rocket size={18} /> },
    { id: 'compare', label: 'So sánh', icon: <GitCompare size={18} /> },
    { id: 'about', label: 'Giới thiệu', icon: <Info size={18} /> },
  ];

  const handleProfileClick = () => {
      onNavigate('profile');
      setIsMenuOpen(false);
  }

  const handleLogout = () => {
      logout(); 
      onNavigate('home'); 
      setIsMenuOpen(false);
  }

  const AuthButton = () => {
      if (isAuthenticated) {
          if (!user || !user.email) {
              return (
                   <button 
                       onClick={handleLogout} 
                       className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-lg"
                   >
                       Lỗi User - Đăng Xuất
                   </button>
               );
          }

          return (
              <>
                <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200"
                >
                    <User size={18} />
                    {user.email.split('@')[0]} 
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                >
                    <LogOut size={18} />
                </button>
              </>
          );
      }
      
      return (
          <button
              onClick={() => onNavigate('profile')} 
              className="flex items-center gap-2 px-4 py-2 bg-[#3a7bf7] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#5a8ff7] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3a7bf7] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
          >
              <LogIn size={18} />
              Đăng nhập
          </button>
      );
  };


  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('tracker')}>
            <TrendingUp className="text-[#3a7bf7]" />
            <span className="text-xl font-bold text-white">Stock<span className="text-[#3a7bf7]">Tracker</span></span>
        </div>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-4">
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
            <AuthButton /> 
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
          
          <div className="px-6 pt-2 pb-3 mt-2 flex justify-between items-center border-t border-[#2a2a2a]">
              <div className="flex-1">
                  {isAuthenticated && user && user.email ? ( 
                      <span className="text-white text-base font-semibold">{user.email.split('@')[0]}</span>
                  ) : (
                      <span className="text-gray-400 text-base">Bạn chưa đăng nhập</span>
                  )}
              </div>
              <button
                  onClick={isAuthenticated ? handleLogout : () => onNavigate('profile')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isAuthenticated ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#3a7bf7] hover:bg-[#5a8ff7] text-white'
                  }`}
              >
                  {isAuthenticated ? <LogOut size={18} /> : <LogIn size={18} />}
                  {isAuthenticated ? 'Đăng Xuất' : 'Đăng nhập'}
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Header;