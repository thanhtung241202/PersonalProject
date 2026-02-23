import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3000/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Lỗi đăng nhập không xác định.");
            }

            setUser(data.user);
            
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`http://localhost:3000/api/auth/logout`, { method: 'POST', credentials: 'include' });
            setUser(null); 

        } catch (err) {
            console.error("Logout Error:", err.message);
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);