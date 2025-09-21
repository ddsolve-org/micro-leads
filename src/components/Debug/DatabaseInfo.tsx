import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export function DatabaseInfo() {
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Verificando conexão com Supabase...');
      
      // Verificar conexão básica
      const { data: healthCheck, error: healthError } = await supabase
        .from('leads-duque')
        .select('count', { count: 'exact' })
        .limit(0);

      if (healthError) {
        throw new Error(`Erro de conexão: ${healthError.message}`);
      }

      // Buscar estrutura da tabela
      const { data: tableData, error: tableError } = await supabase
        .from('leads-duque')
        .select('*')
        .limit(5);

      console.log('📊 Dados da tabela:', tableData);
      console.log('❌ Erro da tabela:', tableError);

      const info = {
        connected: !healthError,
        tableName: 'leads-duque',
        recordCount: healthCheck?.length || 0,
        sampleData: tableData?.slice(0, 3) || [],
        columns: tableData?.length > 0 ? Object.keys(tableData[0]) : [],
        error: tableError?.message || null,
        // Verificar se tem a nova coluna status
        hasStatusColumn: tableData?.length > 0 ? 'status' in tableData[0] : false
      };

      setDbInfo(info);
      console.log('ℹ️ Informações do banco:', info);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao verificar banco:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  if (!dbInfo && !loading && !error) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Database className="w-4 h-4 mr-2" />
          Debug: Informações do Banco de Dados
        </h3>
        <button
          onClick={checkDatabase}
          disabled={loading}
          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Recarregar'}
        </button>
      </div>

      {error && (
        <div className="flex items-center text-red-600 text-sm mb-2">
          <XCircle className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {dbInfo && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            {dbInfo.connected ? (
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500 mr-1" />
            )}
            <span className="text-gray-600">
              Conexão: {dbInfo.connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          <div className="text-gray-600">
            <strong>Tabela:</strong> {dbInfo.tableName}
          </div>

          <div className="text-gray-600">
            <strong>Registros encontrados:</strong> {dbInfo.recordCount}
          </div>

          <div className="flex items-center">
            {dbInfo.hasStatusColumn ? (
              <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500 mr-1" />
            )}
            <span className="text-gray-600">
              Coluna 'status': {dbInfo.hasStatusColumn ? 'Encontrada' : 'Não encontrada'}
            </span>
          </div>

          {dbInfo.columns?.length > 0 && (
            <div className="text-gray-600">
              <strong>Colunas:</strong> {dbInfo.columns.join(', ')}
            </div>
          )}

          {dbInfo.sampleData?.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                <strong>Dados de exemplo ({dbInfo.sampleData.length} registros)</strong>
              </summary>
              <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(dbInfo.sampleData, null, 2)}
              </pre>
            </details>
          )}

          {dbInfo.error && (
            <div className="flex items-start text-amber-600 text-xs mt-2">
              <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>{dbInfo.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
