import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuração robusta do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuração do Supabase:', {
  url: supabaseUrl ? 'Configurado' : 'NÃO CONFIGURADO',
  key: supabaseAnonKey ? 'Configurado' : 'NÃO CONFIGURADO',
  env: import.meta.env.MODE || 'unknown',
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseAnonKey?.length || 0
});

// Função para criar cliente com validação
function createSupabaseClient(): SupabaseClient | null {
  try {
    // Verificação detalhada das variáveis
    if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
      console.error('❌ VITE_SUPABASE_URL inválido:', supabaseUrl);
      return null;
    }

    if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
      console.error('❌ VITE_SUPABASE_ANON_KEY inválido:', supabaseAnonKey);
      return null;
    }

    // Validar formato da URL
    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('❌ URL do Supabase com formato inválido:', supabaseUrl);
      return null;
    }

    console.log('✅ Criando cliente Supabase...');
    
    const client = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // Importante para produção
      },
      global: {
        headers: {
          'X-Client-Info': 'micro-leads-v1.0'
        }
      }
    });

    console.log('✅ Cliente Supabase criado com sucesso');
    return client;

  } catch (error) {
    console.error('❌ Erro ao criar cliente Supabase:', error);
    return null;
  }
}

// Criar cliente do Supabase
export const supabase = createSupabaseClient();

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  const hasValidUrl = Boolean(supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.trim() !== '');
  const hasValidKey = Boolean(supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.trim() !== '');
  const hasClient = Boolean(supabase);
  
  console.log('🔍 Verificação de configuração:', {
    hasValidUrl,
    hasValidKey,
    hasClient,
    urlValid: hasValidUrl ? 'OK' : 'INVALID',
    keyValid: hasValidKey ? 'OK' : 'INVALID'
  });
  
  return hasValidUrl && hasValidKey && hasClient;
}

// Função para mostrar erro de configuração
export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    return 'URL do Supabase não configurada ou inválida';
  }
  if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
    return 'Chave anônima do Supabase não configurada ou inválida';
  }
  if (!supabase) {
    return 'Cliente Supabase não foi criado corretamente';
  }
  return null;
}

// Teste de conexão seguro
export async function testConnection(): Promise<boolean> {
  try {
    if (!supabase) {
      console.error('❌ Cliente Supabase não disponível');
      return false;
    }

    console.log('🌐 Testando conexão com Supabase...');
    
    // Teste simples de ping
    const { data, error } = await supabase
      .from('leads-duque')
      .select('count', { count: 'exact', head: true })
      .limit(0);

    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
      
      // Se for erro de permissão, ainda considera conectado
      if (error.message.includes('permission') || error.message.includes('policies')) {
        console.log('⚠️ Conectado mas sem permissão na tabela');
        return true;
      }
      
      return false;
    }

    console.log('✅ Conexão com Supabase estabelecida:', data);
    return true;
    
  } catch (err) {
    console.error('❌ Erro inesperado na conexão:', err);
    return false;
  }
}