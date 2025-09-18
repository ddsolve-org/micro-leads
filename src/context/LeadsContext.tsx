import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, LeadsContextType } from '../types';
import { mockLeads } from '../data/mockData';
import { useAuth } from './AuthContext';

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email || '',
    };
    
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === id 
          ? { 
              ...lead, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              updatedBy: user?.email || ''
            }
          : lead
      )
    );
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead, loading }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}