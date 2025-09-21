import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export function DatabaseInfo() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    setConnectionStatus('checking');
    
    try {
      // Testar conexão básica
      const { data: healthCheck, error: healthError } = await supabase
        .from('leads-duque')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        throw new Error(`Erro na tabela: ${healthError.message}`);
      }

      // Buscar alguns registros para verificar estrutura
      const { data: sampleData, error: sampleError } = await supabase
        .from('leads-duque')
        .select('*')
        .limit(3);

      if (sampleError) {
        throw new Error(`Erro ao buscar dados: ${sampleError.message}`);
      }

      setTableInfo({
        totalRecords: healthCheck?.length || 0,
        sampleData: sampleData || [],
        columns: sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : []
      });

      setConnectionStatus('connected');
      setError('');
    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message);
      setTableInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Status da Conexão - Supabase
        </h3>
        <button
          onClick={checkConnection}
          disabled={loading}
          className="glass-button flex items-center text-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="space-y-4">
        {/* Status da Conexão */}
        <div className="flex items-center space-x-2">
          {connectionStatus === 'checking' && (
            <>
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-blue-700">Verificando conexão...</span>
            </>
          )}
          {connectionStatus === 'connected' && (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">Conectado com sucesso à tabela 'leads-duque'</span>
            </>
          )}
          {connectionStatus === 'error' && (
            <>
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">Erro na conexão</span>
            </>
          )}
        </div>

        {/* Informações da Tabela */}
        {tableInfo && (
          <div className="bg-white/20 rounded-xl p-4 border border-white/30">
            <h4 className="font-medium text-gray-800 mb-3">Informações da Tabela</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total de registros:</span>
                <span className="ml-2 font-medium text-gray-800">{tableInfo.totalRecords}</span>
              </div>
              <div>
                <span className="text-gray-600">Colunas encontradas:</span>
                <span className="ml-2 font-medium text-gray-800">{tableInfo.columns.length}</span>
              </div>
            </div>
            
            {tableInfo.columns.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Estrutura da tabela:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {tableInfo.columns.map((col: string) => (
                    <span
                      key={col}
                      className="px-2 py-1 bg-amber-400/20 text-amber-800 rounded text-xs font-medium"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tableInfo.sampleData.length > 0 && (
              <div className="mt-4">
                <span className="text-gray-600 text-sm">Amostra dos dados:</span>
                <div className="mt-2 text-xs">
                  <pre className="bg-gray-800 text-green-400 p-3 rounded-lg overflow-auto max-h-48">
                    {JSON.stringify(tableInfo.sampleData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4">
            <h4 className="font-medium text-red-800 mb-2">Erro encontrado:</h4>
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-3 text-xs text-red-600">
              <p>Possíveis soluções:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Verifique se a tabela 'leads-duque' existe no Supabase</li>
                <li>Confirme as credenciais VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY</li>
                <li>Verifique as políticas RLS (Row Level Security) da tabela</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
