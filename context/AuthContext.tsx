'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: any;
    role: 'admin' | 'architect' | 'executive' | 'user';
    login: (token: string, user: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only access localStorage on client-side
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: any) => {
        // Only access browser APIs on client-side
        if (typeof window !== 'undefined') {
            // Persist to localStorage for client-side state
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            // Set a simple auth cookie so Next.js middleware can see it.
            // (In real production code thisควรทำผ่าน secure HttpOnly cookie จาก API route)
            document.cookie = `token=${encodeURIComponent(newToken)}; path=/; max-age=${60 * 60 * 24}`;
        }
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        // Only access browser APIs on client-side
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Clear auth cookie used by middleware
            document.cookie = 'token=; path=/; max-age=0';
        }
        setToken(null);
        setUser(null);
    };

    const role = user?.role || 'user';

    return (
        <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
