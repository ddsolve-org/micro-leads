import { createClient } from '@supabase/supabase-js';

// Configuração robusta do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuração do Supabase:', {
  url: supabaseUrl ? 'Configurado' : 'NÃO CONFIGURADO',
  key: supabaseAnonKey ? 'Configurado' : 'NÃO CONFIGURADO',
  env: import.meta.env.MODE || 'unknown'
});

// Verificar se as variáveis estão definidas
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL não está definido');
  throw new Error('VITE_SUPABASE_URL é obrigatório');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY não está definido');
  throw new Error('VITE_SUPABASE_ANON_KEY é obrigatório');
}

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Função para mostrar erro de configuração
export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl) return 'URL do Supabase não configurada';
  if (!supabaseAnonKey) return 'Chave anônima do Supabase não configurada';
  return null;
}

// Teste de conexão
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('leads-duque')
      .select('count', { count: 'exact' })
      .limit(0);

    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error);
      return false;
    }

    console.log('✅ Conexão com Supabase estabelecida');
    return true;
  } catch (err) {
    console.error('❌ Erro inesperado na conexão:', err);
    return false;
  }
}