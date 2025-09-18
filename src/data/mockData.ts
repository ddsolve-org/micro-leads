import { User, Lead } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@leads.com',
    role: 'admin',
    name: 'Admin User',
  },
  {
    id: '2',
    email: 'manager@leads.com',
    role: 'manager',
    name: 'Manager User',
  },
  {
    id: '3',
    email: 'viewer@leads.com',
    role: 'viewer',
    name: 'Viewer User',
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 99999-9999',
    status: 'new',
    source: 'website',
    notes: 'Interessado em nossos serviços premium',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    updatedBy: 'admin@leads.com',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '+55 11 88888-8888',
    status: 'contacted',
    source: 'social',
    notes: 'Primeira conversa realizada, aguardando retorno',
    createdAt: '2025-01-01T11:00:00Z',
    updatedAt: '2025-01-01T14:30:00Z',
    updatedBy: 'manager@leads.com',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '+55 11 77777-7777',
    status: 'qualified',
    source: 'referral',
    notes: 'Lead qualificado, pronto para proposta',
    createdAt: '2024-12-30T09:00:00Z',
    updatedAt: '2025-01-01T16:00:00Z',
    updatedBy: 'manager@leads.com',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '+55 11 66666-6666',
    status: 'lost',
    source: 'campaign',
    notes: 'Não teve interesse no momento',
    createdAt: '2024-12-28T15:00:00Z',
    updatedAt: '2024-12-29T10:00:00Z',
    updatedBy: 'admin@leads.com',
  },
  {
    id: '5',
    name: 'Pedro Ferreira',
    email: 'pedro.ferreira@email.com',
    phone: '+55 11 55555-5555',
    status: 'new',
    source: 'website',
    notes: '',
    createdAt: '2025-01-01T17:00:00Z',
    updatedAt: '2025-01-01T17:00:00Z',
    updatedBy: 'admin@leads.com',
  },
];

// Credenciais de teste
export const testCredentials = {
  'admin@leads.com': { password: 'admin123', user: mockUsers[0] },
  'manager@leads.com': { password: 'manager123', user: mockUsers[1] },
  'viewer@leads.com': { password: 'viewer123', user: mockUsers[2] },
};