import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  fullname: string;
  email: string;
  language: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string, language: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/user/login', { email, password });
      const { token: authToken, message } = response.data;
      
      // Store token
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      
      // For now, we'll create a user object from the email
      // In a real app, you'd want the backend to return user info
      const userData = { id: '1', fullname: email.split('@')[0], email, language: 'english' };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (fullname: string, email: string, password: string, language: string) => {
    try {
      const response = await api.post('/user/register', {
        fullname,
        email,
        password,
        language
      });
      
      const { token: authToken, message } = response.data;
      
      // Store token
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      
      // Create user object
      const userData = { id: '1', fullname, email, language };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
