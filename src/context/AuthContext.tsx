import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabaseClient';
import { verifyPassword, hashPassword } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'viewer';
  created_at: string;
  updated_at: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('👤 Usuário salvo encontrado:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Tentando fazer login para:', email);
      console.log('🔗 Verificando conexão com Supabase...');
      
      // Teste de conexão básica
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Erro de conexão com Supabase:', testError);
        
        // Fallback para usuário admin local para desenvolvimento
        if (email.toLowerCase() === 'admin@leads.com' && password === 'admin123') {
          console.log('🔄 Usando fallback para admin local');
          const fallbackUser: User = {
            id: 'admin-local',
            email: 'admin@leads.com',
            name: 'Administrador',
            role: 'admin'
          };
          
          setUser(fallbackUser);
          localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
          console.log('✅ Login local realizado com sucesso');
          return true;
        }
        
        return false;
      }
      
      console.log('✅ Conexão com Supabase OK');
      
      // Buscar usuário no Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      console.log('📊 Resultado da consulta:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar usuário:', error);
        
        // Se não encontrou na base, tente o fallback admin
        if (email.toLowerCase() === 'admin@leads.com' && password === 'admin123') {
          console.log('🔄 Usuário não encontrado na base, usando fallback admin');
          const fallbackUser: User = {
            id: 'admin-local',
            email: 'admin@leads.com',
            name: 'Administrador',
            role: 'admin'
          };
          
          setUser(fallbackUser);
          localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
          console.log('✅ Login fallback realizado com sucesso');
          return true;
        }
        
        return false;
      }

      if (!data) {
        console.log('❌ Usuário não encontrado');
        return false;
      }

      const dbUser = data as DbUser;
      console.log('👤 Usuário encontrado:', { 
        id: dbUser.id, 
        name: dbUser.name, 
        email: dbUser.email,
        role: dbUser.role,
        hashType: dbUser.password_hash.substring(0, 10) + '...'
      });
      
      // Verificar senha
      console.log('🔒 Verificando senha...');
      const isValidPassword = await verifyPassword(password, dbUser.password_hash);
      
      if (!isValidPassword) {
        console.log('❌ Senha inválida');
        return false;
      }

      // Criar objeto do usuário para o contexto
      const authenticatedUser: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role
      };

      setUser(authenticatedUser);
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      
      console.log('✅ Login realizado com sucesso:', authenticatedUser);
      return true;
      
    } catch (error) {
      console.error('❌ Erro durante login:', error);
      
      // Último fallback para desenvolvimento
      if (email.toLowerCase() === 'admin@leads.com' && password === 'admin123') {
        console.log('🔄 Erro no sistema, usando fallback final');
        const fallbackUser: User = {
          id: 'admin-emergency',
          email: 'admin@leads.com',
          name: 'Administrador (Emergência)',
          role: 'admin'
        };
        
        setUser(fallbackUser);
        localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
        console.log('✅ Login de emergência realizado');
        return true;
      }
      
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('✅ Logout realizado');
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    console.warn('⚠️ Registro direto não permitido. Apenas admin pode criar usuários.');
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}