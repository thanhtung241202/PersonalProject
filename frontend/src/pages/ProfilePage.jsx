import React from 'react';
import { Mail, Shield, Award, User, LogOut, IdCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const ProfilePage = ({ user }) => {
    const { logout } = useAuth(); 

    const handleLogout = () => {
        logout(); 
        alert("Đăng xuất thành công!");
    };
    
    if (!user) { 
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-red-600">Lỗi: Không tìm thấy thông tin người dùng.</div>
            </div>
        );
    }
    
    const displayName = user.email ? user.email.split('@')[0] : 'Người dùng'; 
    const planDisplay = user.plan ? (user.plan.charAt(0).toUpperCase() + user.plan.slice(1)) : 'N/A';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
                <div className="text-center mb-10">
                    <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-4 border-blue-600 shadow-md">
                        <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        {displayName} 
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        <IdCard className="inline-block w-4 h-4 mr-1"/> ID: {user._id} 
                    </p>
                </div>
                
                <div className="space-y-4">
                    <ProfileItem 
                        icon={Mail} 
                        label="Email" 
                        value={user.email} 
                    />
                    <ProfileItem 
                        icon={Shield} 
                        label="Vai trò (Role)" 
                        value={user.role} 
                    />
                    <ProfileItem 
                        icon={Award} 
                        label="Gói đăng ký (Plan)" 
                        value={planDisplay}
                        isHighlight={user.plan === 'premium'}
                    />
                </div>
                <div className="mt-8">
                    <button
                        onClick={handleLogout} 
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                        <LogOut className="w-5 h-5 mr-2" /> Đăng Xuất
                    </button>
                </div>
            </div>
        </div>
    );
}

const ProfileItem = ({ icon: Icon, label, value, isHighlight = false }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition duration-150 hover:bg-gray-100">
        <Icon className={`w-5 h-5 ${isHighlight ? 'text-yellow-600' : 'text-blue-600'} mr-4 flex-shrink-0`} />
        <div>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className={`text-sm font-semibold ${isHighlight ? 'text-yellow-800' : 'text-gray-800'}`}>
                {value}
            </p>
        </div>
    </div>
);

export default ProfilePage;