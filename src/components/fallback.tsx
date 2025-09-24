import React from 'react';
import { AlertCircle, Settings } from 'lucide-react';
import { getSupabaseConfigError } from '../lib/supabaseClient';

export function SupabaseConfigError() {
  const error = getSupabaseConfigError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 text-center">
          <div className="w-20 h-20 bg-red-400/90 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro de Configuração</h1>
          
          <p className="text-gray-600 mb-6">
            {error || 'Erro na configuração do Supabase'}
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Settings className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 text-left">
                <p className="font-medium mb-2">Para resolver este problema:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Acesse o painel do Vercel</li>
                  <li>Vá em Settings → Environment Variables</li>
                  <li>Adicione as seguintes variáveis:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li><code>VITE_SUPABASE_URL</code></li>
                      <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                      <li><code>VITE_SUPABASE_LEADS_TABLE</code></li>
                    </ul>
                  </li>
                  <li>Faça um novo deploy</li>
                </ol>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="glass-button-primary w-full"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}