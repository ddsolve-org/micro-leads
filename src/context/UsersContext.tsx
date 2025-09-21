import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { hashPassword } from '../utils/auth';

interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'viewer';
  created_at: string;
  updated_at: string;
}

interface UsersContextType {
  users: User[];
  loading: boolean;
  createUser: (userData: {
    name: string;
    email: string;
    password: string;
    role: User['role'];
  }) => Promise<{ success: boolean; error?: string; password?: string }>;
  updateUserRole: (userId: string, newRole: User['role']) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

function dbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role
  };
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('🔍 Buscando usuários...');
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar usuários:', error);
        throw error;
      }

      const mappedUsers = (data as any[]).map(dbUserToUser);
      setUsers(mappedUsers);
      
      console.log('✅ Usuários carregados:', mappedUsers);
      
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: User['role'];
  }): Promise<{ success: boolean; error?: string; password?: string }> => {
    try {
      console.log('➕ Criando novo usuário:', { ...userData, password: '[REDACTED]' });
      
      // Verificar se email já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email.toLowerCase())
        .single();

      if (existingUser) {
        return { success: false, error: 'Email já está em uso' };
      }

      // Hash da senha
      const passwordHash = await hashPassword(userData.password);

      // Inserir usuário
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email.toLowerCase(),
          password_hash: passwordHash,
          role: userData.role
        })
        .select('id, name, email, role, created_at, updated_at')
        .single();

      if (error) {
        console.error('❌ Erro ao criar usuário:', error);
        return { success: false, error: error.message };
      }

      const newUser = dbUserToUser(data as any);
      setUsers(prev => [newUser, ...prev]);
      
      console.log('✅ Usuário criado com sucesso:', newUser);
      
      return { 
        success: true, 
        password: userData.password // Retornar senha para mostrar ao admin
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    try {
      console.log('✏️ Atualizando role do usuário:', userId, 'para', newRole);
      
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao atualizar role:', error);
        throw error;
      }

      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: newRole }
            : user
        )
      );
      
      console.log('✅ Role atualizado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao atualizar role:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log('🗑️ Deletando usuário:', userId);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao deletar usuário:', error);
        throw error;
      }

      setUsers(prev => prev.filter(user => user.id !== userId));
      
      console.log('✅ Usuário deletado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      throw error;
    }
  };

  return (
    <UsersContext.Provider value={{
      users,
      loading,
      createUser,
      updateUserRole,
      deleteUser,
      fetchUsers
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers deve ser usado dentro de um UsersProvider');
  }
  return context;
}