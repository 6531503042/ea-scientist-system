'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: any;
    role: 'admin' | 'architect' | 'executive' | 'user';
    login: (token: string, user: any) => void; // Token arg kept for signature compatibility but unused
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/v1/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setUser(data.data);
                    }
                }
            } catch (error) {
                console.error("Session check failed:", error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = (token: string, newUser: any) => {
        // Token is now handled by httpOnly cookies, so we just set the user state
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await fetch('/api/v1/auth/logout', { method: 'POST' });
            setUser(null);
            // Optional: Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const role = user?.role || 'user';

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
