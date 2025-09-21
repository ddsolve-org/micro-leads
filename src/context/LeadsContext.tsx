import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Lead, LeadsContextType } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

// Nome(s) da(s) tabela(s). Aceita uma lista separada por vírgula via .env -> VITE_SUPABASE_LEADS_TABLE
// Exemplo: "leads-duque,leads-sede". O padrão permanece 'tabelas'.
const LEADS_TABLES: string[] = (
  (import.meta.env.VITE_SUPABASE_LEADS_TABLE as string) || 'tabelas'
)
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);

const DEFAULT_TABLE = LEADS_TABLES[0] || 'tabelas';

type DbLeadRow = {
  id: string;
  nome: string;
  numero: string | null;
  valorConta: number | null;
  cep: string | null;
  canal: string | null;
  // Campos opcionais que podem existir na tabela
  created_at?: string;
  updated_at?: string;
  [key: string]: string | number | null | undefined; // Para campos extras não mapeados
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

function mapCanalToSource(canal: string | null | undefined): Lead['source'] {
  const value = (canal || '').toLowerCase();
  if (value.includes('site') || value === 'website') return 'website';
  if (value.includes('social') || value === 'instagram' || value === 'facebook' || value === 'tiktok') return 'social';
  if (value.includes('indic') || value === 'referral') return 'referral';
  if (value.includes('camp') || value === 'campaign' || value === 'ads') return 'campaign';
  return 'website';
}

function mapSourceToCanal(source: Lead['source']): string {
  const map: Record<Lead['source'], string> = {
    website: 'website',
    social: 'social',
    referral: 'referral',
    campaign: 'campaign',
  };
  return map[source] || 'website';
}

function dbRowToLead(row: DbLeadRow, updatedByFallback: string, tableName: string): Lead {
  // Construir as notas com as informações disponíveis
  const noteParts: string[] = [];
  if (row.valorConta != null) {
    noteParts.push(`Valor da Conta: R$ ${row.valorConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  }
  if (row.cep) {
    noteParts.push(`CEP: ${row.cep}`);
  }

  // Usar datas da tabela se disponíveis, senão usar data atual
  const createdAt = row.created_at || new Date().toISOString();
  const updatedAt = row.updated_at || new Date().toISOString();

  return {
    id: `${tableName}:${String(row.id)}`,
    name: row.nome,
    email: row.numero ? `${row.nome.toLowerCase().replace(/\s+/g, '.')}@email.com` : '', // Email simulado se não tiver
    phone: row.numero || undefined,
    status: 'new',
    source: mapCanalToSource(row.canal),
    notes: noteParts.length > 0 ? noteParts.join(' | ') : undefined,
    // Campos específicos da tabela leads-duque
    valorConta: row.valorConta || undefined,
    cep: row.cep || undefined,
    createdAt,
    updatedAt,
    updatedBy: updatedByFallback,
  };
}

function parseCompositeId(id: string): { table: string; dbId: string } {
  if (id.includes(':')) {
    const [table, ...rest] = id.split(':');
    return { table, dbId: rest.join(':') };
  }
  // fallback para ids antigos sem prefixo
  return { table: DEFAULT_TABLE, dbId: id };
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchFromTable = useCallback(
    async (table: string): Promise<Lead[]> => {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw new Error(`[${table}] ${error.message}`);
      const mapped = (data as DbLeadRow[] | null)?.map((row) => dbRowToLead(row, user?.email || 'system', table)) || [];
      return mapped;
    },
    [user?.email]
  );

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        LEADS_TABLES.map((table) => fetchFromTable(table))
      );
      const merged = results.flat();
      setLeads(merged);
    } catch (err) {
      console.error('Erro ao carregar leads do Supabase:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFromTable]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
    setLoading(true);
    try {
      const payload: Partial<DbLeadRow> = {
        nome: leadData.name,
        numero: leadData.phone ?? null,
        canal: mapSourceToCanal(leadData.source),
        valorConta: leadData.valorConta ?? null,
        cep: leadData.cep ?? null,
      };

      const targetTable = DEFAULT_TABLE;

      const { data, error } = await supabase
        .from(targetTable)
        .insert(payload)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const mapped = dbRowToLead(data as DbLeadRow, user?.email || 'system', targetTable);
        setLeads((prev) => [mapped, ...prev]);
      }
    } catch (err) {
      console.error('Erro ao criar lead no Supabase:', err);
      // Fallback local em caso de erro
      const newLead: Lead = {
        ...leadData,
        id: `${DEFAULT_TABLE}:${Date.now().toString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || '',
      };
      setLeads((prev) => [newLead, ...prev]);
    } finally {
      setLoading(false);
    }
  };  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setLoading(true);
    try {
      const { table, dbId } = parseCompositeId(id);
      
      // Preparar payload apenas com campos que existem na tabela
      const payload: Partial<DbLeadRow> = {};
      
      if (updates.name !== undefined) payload.nome = updates.name;
      if (updates.phone !== undefined) payload.numero = updates.phone || null;
      if (updates.source !== undefined) payload.canal = mapSourceToCanal(updates.source);
      if (updates.valorConta !== undefined) payload.valorConta = updates.valorConta || null;
      if (updates.cep !== undefined) payload.cep = updates.cep || null;

      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', dbId)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const mapped = dbRowToLead(data as DbLeadRow, user?.email || 'system', table);
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...mapped } : l)));
      }
    } catch (err) {
      console.error('Erro ao atualizar lead no Supabase:', err);
      // Fallback local em caso de erro
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                ...updates,
                updatedAt: new Date().toISOString(),
                updatedBy: user?.email || '',
              }
            : lead
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    setLoading(true);
    try {
      const { table, dbId } = parseCompositeId(id);
      const { error } = await supabase.from(table).delete().eq('id', dbId);
      if (error) throw error;
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (err) {
      console.error('Erro ao excluir lead no Supabase:', err);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead, loading }}>
      {children}
    </LeadsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
}