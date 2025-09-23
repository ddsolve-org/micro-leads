export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'social' | 'referral' | 'campaign';
  notes?: string;
  valorConta?: number; // Novo campo
  cep?: string; // Novo campo
  canal?: string; // Campo para o canal real do Supabase
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

export interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  loading: boolean;
}

export interface UsersContextType {
  users: User[];
  updateUserRole: (userId: string, role: User['role']) => Promise<void>;
  resetUserPassword: (userId: string) => Promise<{ success: boolean; password?: string; error?: string }>;
  loading: boolean;
}