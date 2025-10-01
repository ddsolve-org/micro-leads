import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { LeadsProvider } from './context/LeadsContext';
import { Layout } from './components/Layout/Layout';
import { LoginPage } from './components/Auth/LoginPage';
import { LeadsPage } from './components/Leads/LeadsPage';
import { AdminPage } from './components/Admin/AdminPage';
import { SupabaseConfigError } from './components/Error/SupabaseConfigError';
import { ProductionDebug } from './components/Debug/ProductionDebug';
import { useAuth } from './context/AuthContext';
import { isSupabaseConfigured, getSupabaseConfigError, testConnection } from './lib/supabaseClient';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/leads" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/leads" replace />} 
      />
      <Route
        path="/leads"
        element={
          <PrivateRoute>
            <UsersProvider>
              <LeadsProvider>
                <Layout>
                  <LeadsPage />
                </Layout>
              </LeadsProvider>
            </UsersProvider>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <UsersProvider>
              <LeadsProvider>
                <Layout>
                  <AdminPage />
                </Layout>
              </LeadsProvider>
            </UsersProvider>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? "/leads" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={user ? "/leads" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        console.log('🔍 Verificando configuração do Supabase...');
        
        // Adicionar um delay para garantir que o ambiente está carregado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Primeiro, verificar se as variáveis estão definidas
        if (!isSupabaseConfigured()) {
          const error = getSupabaseConfigError();
          console.error('❌ Configuração inválida:', error);
          setConfigError(error);
          setIsConfigured(false);
          return;
        }

        // Testar conexão real
        console.log('🌐 Testando conexão com Supabase...');
        try {
          const connected = await testConnection();
          if (connected) {
            console.log('✅ Supabase configurado e conectado');
            setIsConfigured(true);
          } else {
            console.error('❌ Falha na conexão com Supabase');
            setConfigError('Não foi possível conectar ao Supabase - verifique as configurações');
            setIsConfigured(false);
          }
        } catch (connectionError) {
          console.error('❌ Erro ao testar conexão:', connectionError);
          setConfigError(`Erro de conexão: ${connectionError instanceof Error ? connectionError.message : 'Erro desconhecido'}`);
          setIsConfigured(false);
        }
        
      } catch (generalError) {
        console.error('❌ Erro geral na verificação:', generalError);
        setConfigError(`Erro na inicialização: ${generalError instanceof Error ? generalError.message : 'Erro desconhecido'}`);
        setIsConfigured(false);
      }
    };

    checkSupabase();
  }, []);

  // Tela de loading enquanto verifica
  if (isConfigured === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando conexão com Supabase...</p>
          <p className="text-xs text-gray-500 mt-2">Ambiente: {import.meta.env.MODE}</p>
        </div>
      </div>
    );
  }

  // Se não está configurado, mostrar erro
  if (!isConfigured) {
    return <SupabaseConfigError error={configError || undefined} />;
  }
  // Se está configurado, mostrar app
  return (
    <>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
      
      {/* Debug component para produção */}
      <ProductionDebug />
    </>
  );
}

export default App;
