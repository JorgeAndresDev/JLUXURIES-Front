import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import api from '../api/axios';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('Checking auth...', { storedToken: !!storedToken, storedUser });

      if (storedToken) {
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
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (userData: any) => {
    try {
      await api.post('/auth/register', userData);
      // Optionally auto-login or redirect to login
    } catch (error) {
      throw error;
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

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
