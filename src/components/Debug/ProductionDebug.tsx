import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface DebugInfo {
  environment: string;
  hasSupabaseUrl: boolean;
  hasSupabaseKey: boolean;
  urlValue: string;
  keyValue: string;
  buildTime: string;
  userAgent: string;
}

export function ProductionDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const info: DebugInfo = {
      environment: import.meta.env.MODE || 'unknown',
      hasSupabaseUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
      hasSupabaseKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
      urlValue: import.meta.env.VITE_SUPABASE_URL || 'undefined',
      keyValue: import.meta.env.VITE_SUPABASE_ANON_KEY ? 
        `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'undefined',
      buildTime: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    setDebugInfo(info);
    
    // Log detalhado para debug
    console.log('🔍 DEBUG INFO:', {
      ...info,
      urlLength: import.meta.env.VITE_SUPABASE_URL?.length || 0,
      keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
      allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
    });
  }, []);

  if (!debugInfo) return null;

  const isConfigured = debugInfo.hasSupabaseUrl && debugInfo.hasSupabaseKey;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isConfigured ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-800">
              Debug: {debugInfo.environment}
            </span>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-white/20"
          >
            {showDetails ? 'Ocultar' : 'Detalhes'}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Ambiente:</div>
              <div className="font-medium text-gray-800">{debugInfo.environment}</div>
              
              <div className="text-gray-600">Supabase URL:</div>
              <div className="flex items-center">
                {debugInfo.hasSupabaseUrl ? (
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className="font-mono text-xs">
                  {debugInfo.hasSupabaseUrl ? 'OK' : 'MISSING'}
                </span>
              </div>
              
              <div className="text-gray-600">Supabase Key:</div>
              <div className="flex items-center">
                {debugInfo.hasSupabaseKey ? (
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className="font-mono text-xs">
                  {debugInfo.hasSupabaseKey ? 'OK' : 'MISSING'}
                </span>
              </div>
            </div>

            {!isConfigured && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-amber-800 text-xs">
                    <p className="font-medium">Variáveis de ambiente ausentes!</p>
                    <p className="mt-1">
                      Verifique no Vercel se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/20">
              <details>
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  Informações técnicas
                </summary>
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  <div>URL: {debugInfo.urlValue.substring(0, 50)}...</div>
                  <div>Key: {debugInfo.keyValue}</div>
                  <div>Build: {debugInfo.buildTime}</div>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
