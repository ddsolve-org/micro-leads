// Configuração robusta do Supabase com fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuração do Supabase:', {
  url: supabaseUrl ? 'Configurado' : 'NÃO CONFIGURADO',
  key: supabaseAnonKey ? 'Configurado' : 'NÃO CONFIGURADO',
  env: import.meta.env.MODE || 'unknown'
});

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL não está definido');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY não está definido');
}

// Criar cliente apenas se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase);
}

// Função para mostrar erro de configuração
export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl) return 'URL do Supabase não configurada';
  if (!supabaseAnonKey) return 'Chave anônima do Supabase não configurada';
  return null;
}