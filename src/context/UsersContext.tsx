import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UsersContextType } from '../types';
import { mockUsers } from '../data/mockData';

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  const updateUserRole = async (userId: string, role: User['role']) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, role }
          : user
      )
    );
    
    setLoading(false);
  };

  return (
    <UsersContext.Provider value={{ users, updateUserRole, loading }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}