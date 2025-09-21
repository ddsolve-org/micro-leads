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
  id: string | number;
  nome: string;
  numero: string | null;
  valorConta: number | null;
  cep: string | null;
  canal: string | null;
  status: string | null; // Nova coluna status
  // Campos opcionais que podem existir na tabela
  created_at?: string;
  updated_at?: string;
  [key: string]: string | number | null | undefined; // Para campos extras não mapeados
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

function mapCanalToSource(canal: string | null | undefined): Lead['source'] {
  if (!canal) return 'website';
  const normalizedCanal = canal.toLowerCase();
  if (normalizedCanal.includes('social') || normalizedCanal.includes('facebook') || normalizedCanal.includes('instagram')) return 'social';
  if (normalizedCanal.includes('indica') || normalizedCanal.includes('referral')) return 'referral';
  if (normalizedCanal.includes('campanha') || normalizedCanal.includes('campaign')) return 'campaign';
  return 'website';
}

function mapSourceToCanal(source: Lead['source']): string {
  switch (source) {
    case 'social': return 'Social Media';
    case 'referral': return 'Indicação';
    case 'campaign': return 'Campanha';
    default: return 'Website';
  }
}

// Mapear status do banco para o front-end
function mapDbStatusToLeadStatus(dbStatus: string | null | undefined): Lead['status'] {
  if (!dbStatus) return 'new';
  const normalizedStatus = dbStatus.toLowerCase();
  switch (normalizedStatus) {
    case 'new':
    case 'novo':
      return 'new';
    case 'contacted':
    case 'contatado':
      return 'contacted';
    case 'qualified':
    case 'qualificado':
      return 'qualified';
    case 'lost':
    case 'perdido':
      return 'lost';
    default:
      return 'new';
  }
}

// Mapear status do front-end para o banco
function mapLeadStatusToDbStatus(status: Lead['status']): string {
  switch (status) {
    case 'new': return 'new';
    case 'contacted': return 'contacted';
    case 'qualified': return 'qualified';
    case 'lost': return 'lost';
    default: return 'new';
  }
}

function dbRowToLead(row: DbLeadRow, updatedByFallback: string, tableName: string): Lead {
  console.log('🔄 Mapeando dados da linha do banco:', row);
  
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

  const lead: Lead = {
    id: `${tableName}:${String(row.id)}`,
    name: row.nome,
    email: row.numero ? `${row.nome.toLowerCase().replace(/\s+/g, '.')}@email.com` : '', // Email simulado se não tiver
    phone: row.numero || undefined,
    status: mapDbStatusToLeadStatus(row.status), // Usar status real do banco
    source: mapCanalToSource(row.canal),
    notes: noteParts.length > 0 ? noteParts.join(' | ') : undefined,
    // Campos específicos da tabela leads-duque
    valorConta: row.valorConta || undefined,
    cep: row.cep || undefined,
    createdAt,
    updatedAt,
    updatedBy: updatedByFallback,
  };

  console.log('✅ Lead mapeado:', lead);
  return lead;
}

function parseCompositeId(id: string): { table: string; dbId: string } {
  const [table, dbId] = id.split(':');
  return { table: table || DEFAULT_TABLE, dbId: dbId || id };
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchFromTable = useCallback(
    async (table: string): Promise<Lead[]> => {
      console.log(`🔍 Buscando dados da tabela: ${table}`);
      
      try {
        // Primeiro, vamos verificar se a tabela existe e tem dados
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' });
        
        console.log(`📊 Resultado da consulta na tabela ${table}:`, {
          data,
          error,
          count,
          dataLength: data?.length
        });

        if (error) {
          console.error(`❌ Erro na consulta da tabela ${table}:`, error);
          throw new Error(`[${table}] ${error.message}`);
        }

        if (!data || data.length === 0) {
          console.warn(`⚠️ Nenhum dado encontrado na tabela ${table}`);
          return [];
        }

        const mapped = data.map((row) => {
          console.log(`🔄 Processando linha:`, row);
          return dbRowToLead(row as DbLeadRow, user?.email || 'system', table);
        });
        
        console.log(`✅ ${mapped.length} leads mapeados da tabela ${table}:`, mapped);
        return mapped;
      } catch (err) {
        console.error(`❌ Erro ao buscar dados da tabela ${table}:`, err);
        return [];
      }
    },
    [user?.email]
  );

  const fetchLeads = useCallback(async () => {
    console.log('🚀 Iniciando busca de leads...');
    console.log('📋 Tabelas configuradas:', LEADS_TABLES);
    
    setLoading(true);
    try {
      const results = await Promise.all(
        LEADS_TABLES.map((table) => fetchFromTable(table))
      );
      const merged = results.flat();
      
      console.log('🎯 Resultado final - leads encontrados:', merged.length);
      console.log('📄 Dados dos leads:', merged);
      
      setLeads(merged);
    } catch (err) {
      console.error('❌ Erro geral ao carregar leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFromTable]);

  useEffect(() => {
    console.log('🔄 useEffect - carregando leads...');
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'>) => {
    console.log('➕ Adicionando novo lead:', leadData);
    setLoading(true);
    try {
      const payload: Partial<DbLeadRow> = {
        nome: leadData.name,
        numero: leadData.phone ?? null,
        canal: mapSourceToCanal(leadData.source),
        status: mapLeadStatusToDbStatus(leadData.status), // Salvar status no banco
        valorConta: leadData.valorConta ?? null,
        cep: leadData.cep ?? null,
      };

      console.log('📤 Payload para inserção:', payload);

      const targetTable = DEFAULT_TABLE;

      const { data, error } = await supabase
        .from(targetTable)
        .insert(payload)
        .select('*')
        .single();

      console.log('📥 Resposta da inserção:', { data, error });

      if (error) throw error;

      if (data) {
        const mapped = dbRowToLead(data as DbLeadRow, user?.email || 'system', targetTable);
        setLeads((prev) => [mapped, ...prev]);
        console.log('✅ Lead adicionado com sucesso:', mapped);
      }
    } catch (err) {
      console.error('❌ Erro ao criar lead no Supabase:', err);
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
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    console.log('✏️ Atualizando lead:', id, updates);
    setLoading(true);
    try {
      const { table, dbId } = parseCompositeId(id);
      
      // Preparar payload apenas com campos que existem na tabela
      const payload: Partial<DbLeadRow> = {};
      
      if (updates.name !== undefined) payload.nome = updates.name;
      if (updates.phone !== undefined) payload.numero = updates.phone || null;
      if (updates.source !== undefined) payload.canal = mapSourceToCanal(updates.source);
      if (updates.status !== undefined) payload.status = mapLeadStatusToDbStatus(updates.status); // Atualizar status
      if (updates.valorConta !== undefined) payload.valorConta = updates.valorConta || null;
      if (updates.cep !== undefined) payload.cep = updates.cep || null;

      console.log('📤 Payload para atualização:', payload);

      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', dbId)
        .select('*')
        .single();

      console.log('📥 Resposta da atualização:', { data, error });

      if (error) throw error;

      if (data) {
        const mapped = dbRowToLead(data as DbLeadRow, user?.email || 'system', table);
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...mapped } : l)));
        console.log('✅ Lead atualizado com sucesso:', mapped);
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar lead no Supabase:', err);
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
    console.log('🗑️ Deletando lead:', id);
    setLoading(true);
    try {
      const { table, dbId } = parseCompositeId(id);
      const { error } = await supabase.from(table).delete().eq('id', dbId);
      
      console.log('📥 Resposta da exclusão:', { error });
      
      if (error) throw error;

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      console.log('✅ Lead deletado com sucesso');
    } catch (err) {
      console.error('❌ Erro ao excluir lead no Supabase:', err);
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
  if (!context) {
    throw new Error('useLeads deve ser usado dentro de um LeadsProvider');
  }
  return context;
}