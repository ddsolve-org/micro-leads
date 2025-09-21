import React, { useState, useEffect } from 'react';
import { testSupabaseConnection } from '../../utils/testConnection';

export function SupabaseTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult('Testando conexão...');
    
    try {
      const success = await testSupabaseConnection();
      setTestResult(success ? 'Conexão realizada com sucesso!' : 'Falha na conexão');
    } catch (error) {
      setTestResult(`Erro: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teste de Conexão Supabase</h2>
      <button
        onClick={runTest}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testando...' : 'Testar Conexão'}
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre className="text-sm">{testResult}</pre>
      </div>
    </div>
  );
}
