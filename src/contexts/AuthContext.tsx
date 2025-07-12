
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('quanttun_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Iniciando processo de login...');
      
      const userData = await supabaseClient.signIn({ email, password });
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('quanttun_user', JSON.stringify(userData));
        console.log('Login realizado com sucesso');
      } else {
        throw new Error('Dados do usuário não encontrados');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      console.log('Iniciando processo de registro...');
      
      // Validar dados antes de enviar
      if (!name.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (!email.trim()) {
        throw new Error('Email é obrigatório');
      }
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      const userData = await supabaseClient.signUp({ email, password, name });
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('quanttun_user', JSON.stringify(userData));
        console.log('Registro realizado com sucesso');
      } else {
        throw new Error('Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Fazendo logout...');
    setUser(null);
    localStorage.removeItem('quanttun_user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Atualizando dados do usuário...');
      
      await supabaseClient.updateUser(user.email, updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('quanttun_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
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
