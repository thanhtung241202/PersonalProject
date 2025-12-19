import React, { useState } from 'react';
import { Mail, Lock, User, TrendingUp } from 'lucide-react';

const RegisterPage = ({ onNavigate, onRegistrationSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            return setError('Mật khẩu xác nhận không khớp.');
        }

        if (password.length < 6) {
            return setError('Mật khẩu phải có ít nhất 6 ký tự.');
        }

        setLoading(true);
        try {
            const response = await fetch('https://gateway-production-6658.up.railway.app/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role: 'user' }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
                setTimeout(() => {
                    onNavigate('login');
                }, 1500);

            } else {
                setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error('Registration API Error:', e);
            setError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
            <div className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-xl shadow-2xl border border-[#2a2a2a] animate-[slideUp_0.5s_ease-out]">
                
                <div className="text-center mb-8">
                    <TrendingUp className="text-[#3a7bf7] mx-auto w-10 h-10 mb-2" />
                    <h2 className="text-3xl font-extrabold text-white">
                        Đăng ký tài khoản
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Bắt đầu theo dõi thị trường ngay hôm nay!
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="email"
                            placeholder="Địa chỉ Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#2a2a2a] border border-[#333] text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#3a7bf7] transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="password"
                            placeholder="Mật khẩu (ít nhất 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#2a2a2a] border border-[#333] text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#3a7bf7] transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="password"
                            placeholder="Xác nhận Mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-[#2a2a2a] border border-[#333] text-white pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#3a7bf7] transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-sm transition-opacity duration-300">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-900/50 border border-green-700 text-green-300 p-3 rounded-lg text-sm transition-opacity duration-300">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white transition-colors duration-200 ${
                            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#3a7bf7] hover:bg-[#5a8ff7]'
                        }`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-400">
                        Đã có tài khoản?{' '}
                        <button 
                            onClick={() => onNavigate('login')}
                            className="text-[#3a7bf7] hover:text-white font-medium transition-colors focus:outline-none"
                            disabled={loading}
                        >
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;