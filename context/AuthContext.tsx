'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthContextType {
    user: any;
    role: 'admin' | 'architect' | 'executive' | 'user' | 'viewer';
    login: (token: string, user: any) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const checkSession = useCallback(async () => {
        try {
            const response = await fetch('/api/v1/auth/me', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUser(data.data);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
                // Don't redirect if we're already on login page (prevents infinite reload loop)
                if (typeof window !== 'undefined' && response.status === 401 && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        } catch (error) {
            console.error("Session check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // Refetch session when tab becomes visible (fixes sidebar not loading after switching browsers/tabs)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [checkSession]);

    const login = (token: string, newUser: any) => {
        // Token is now handled by httpOnly cookies, so we just set the user state
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
            setUser(null);
            // Optional: Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Extract role string from user data (API returns role as object { roleName: "admin" })
    const role = (typeof user?.role === 'object' ? user?.role?.roleName : user?.role) || 'user';

    return (
        <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user, loading }}>
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
