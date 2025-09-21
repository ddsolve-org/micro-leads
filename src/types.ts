export interface User {
  id: string;
  email: string;
  role: 'viewer' | 'manager' | 'admin';
  name: string;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'social' | 'referral' | 'campaign';
  notes?: string;
  // Campos específicos da tabela leads-duque
  valorConta?: number;
  cep?: string;
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
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  loading: boolean;
}

export interface UsersContextType {
  users: User[];
  updateUserRole: (userId: string, role: User['role']) => Promise<void>;
  loading: boolean;
}