import React, { createContext, useState, useEffect, useCallback, type ReactNode, useContext } from 'react';
import api from '../api/axios';
import type { User } from '../types';
import {
  clearStoredSession,
  getTokenExpiresAt,
  isTokenExpired,
} from '../utils/authSession';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  register: (userData: unknown) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('Checking auth...', { storedToken: !!storedToken, storedUser });

      if (!storedToken || isTokenExpired(storedToken)) {
        clearStoredSession();
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // First, try to load user from localStorage
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Loaded user from localStorage:', parsedUser);
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          // If no stored user, try to get from backend
          const response = await api.get('/auth/me');
          console.log('Response from /auth/me:', response.data);

          if (typeof response.data === 'string') {
            setUser({ email: response.data, role: 'client' }); // Default role if string
          } else if (typeof response.data === 'object') {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error verifying token", error);
        logout();
      }
      setLoading(false);
    };
    checkAuth();
  }, [logout]);

  useEffect(() => {
    if (!token) return;

    const expiresAt = getTokenExpiresAt(token);
    const maxDelay = 2147483647;

    const expireSession = () => {
      logout();
      if (window.location.pathname !== '/login') {
        window.location.replace('/login?expired=1');
      }
    };

    let timeoutId = 0;
    const scheduleExpiry = () => {
      const remaining = expiresAt === null ? 0 : expiresAt - Date.now();
      if (remaining <= 0) {
        expireSession();
        return;
      }
      timeoutId = window.setTimeout(
        scheduleExpiry,
        Math.min(remaining, maxDelay),
      );
    };

    timeoutId = window.setTimeout(scheduleExpiry, 0);
    return () => window.clearTimeout(timeoutId);
  }, [token, logout]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (userData: unknown) => {
    await api.post('/auth/register', userData);
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
