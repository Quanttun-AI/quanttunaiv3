
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  routes: any[];
  notes: any[];
  points: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('quanttun_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await supabaseClient.signIn({ email, password });
      const userData = await supabaseClient.getUser(email);
      if (userData) {
        setUser(userData);
        localStorage.setItem('quanttun_user', JSON.stringify(userData));
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await supabaseClient.signUp({ email, password, name });
      const userData = await supabaseClient.getUser(email);
      if (userData) {
        setUser(userData);
        localStorage.setItem('quanttun_user', JSON.stringify(userData));
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quanttun_user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await supabaseClient.updateUser(user.email, updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('quanttun_user', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
