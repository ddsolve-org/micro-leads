import { supabase } from '../lib/supabaseClient';

// Script para testar a conexão com o Supabase e verificar a estrutura da tabela
export async function testSupabaseConnection() {
  console.log('=== TESTE DE CONEXÃO SUPABASE ===');
  
  const tableName = 'leads-duque';
  
  try {
    // 1. Teste básico de conexão
    console.log(`1. Testando conexão com a tabela '${tableName}'...`);
    
    const { data: testData, error: testError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('❌ Erro na conexão:', testError.message);
      return false;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // 2. Verificar estrutura da tabela
    console.log('\n2. Verificando estrutura da tabela...');
    
    const { data: sampleData, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(3);
      
    if (sampleError) {
      console.error('❌ Erro ao buscar dados:', sampleError.message);
      return false;
    }
    
    if (sampleData && sampleData.length > 0) {
      const columns = Object.keys(sampleData[0]);
      console.log('✅ Colunas encontradas:', columns);
      
      // Verificar se as colunas esperadas existem
      const expectedColumns = ['id', 'nome', 'numero', 'valorConta', 'cep', 'canal'];
      const missingColumns = expectedColumns.filter(col => !columns.includes(col));
      const extraColumns = columns.filter(col => !expectedColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.warn('⚠️  Colunas faltando:', missingColumns);
      }
      
      if (extraColumns.length > 0) {
        console.log('ℹ️  Colunas extras encontradas:', extraColumns);
      }
      
      console.log('\n3. Dados de exemplo:');
      sampleData.forEach((row, index) => {
        console.log(`   Registro ${index + 1}:`, {
          id: row.id,
          nome: row.nome,
          numero: row.numero,
          valorConta: row.valorConta,
          cep: row.cep,
          canal: row.canal
        });
      });
    } else {
      console.log('ℹ️  Tabela existe mas está vazia');
    }
    
    // 3. Teste de contagem total
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    if (!countError) {
      console.log(`\n4. Total de registros na tabela: ${count}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return false;
  }
}

// Executar teste automaticamente se o módulo for importado
if (typeof window !== 'undefined') {
  testSupabaseConnection();
}
