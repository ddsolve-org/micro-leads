// Script para debug das variáveis de ambiente
console.log('=== DEBUG ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Mode:', import.meta.env.MODE);

console.log('\n=== SUPABASE VARIABLES ===');
console.log('VITE_SUPABASE_URL exists:', Boolean(import.meta.env.VITE_SUPABASE_URL));
console.log('VITE_SUPABASE_URL value:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_URL length:', import.meta.env.VITE_SUPABASE_URL?.length || 0);

console.log('VITE_SUPABASE_ANON_KEY exists:', Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY));
console.log('VITE_SUPABASE_ANON_KEY value:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 50) + '...');
console.log('VITE_SUPABASE_ANON_KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0);

console.log('VITE_SUPABASE_LEADS_TABLE:', import.meta.env.VITE_SUPABASE_LEADS_TABLE);

console.log('\n=== ALL VITE VARIABLES ===');
Object.keys(import.meta.env).forEach(key => {
  if (key.startsWith('VITE_')) {
    console.log(`${key}:`, import.meta.env[key]);
  }
});
