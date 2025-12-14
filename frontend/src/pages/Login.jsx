// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State lỗi cục bộ
  
  const { login, loading } = useAuth(); // Lấy hàm login và loading từ Context
  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      // Gọi hàm login từ Context và truyền email/password
      await login(email, password);             
    } catch (err) {
      // Bắt lỗi từ Context và hiển thị
      setError(err.message); 
    }
  }; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Sign In to Stock<span className="text-blue-600">Tracker</span>
        </h2>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Hiển thị lỗi */}
          {error && (
            <div className="p-3 text-sm font-medium text-white bg-red-500 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                autoComplete="email"
                value={email}
                onChange = {(e) => {setEmail(e.target.value)}}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out text-gray-800"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                value={password}
                onChange = {(e) => {setPassword(e.target.value)}}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out text-gray-800"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-500 underline transition duration-150 ease-in-out"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage