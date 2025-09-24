import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UsersProvider } from "./context/UsersContext";
import { LeadsProvider } from "./context/LeadsContext";
import { Layout } from "./components/Layout/Layout";
import { LoginPage } from "./components/Auth/LoginPage";
import { LeadsPage } from "./components/Leads/LeadsPage";
import { AdminPage } from "./components/Admin/AdminPage";
import { SupabaseConfigError } from "./components/fallback";
import { useAuth } from "./context/AuthContext";
import { isSupabaseConfigured } from "./lib/supabaseClient";

function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
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

  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigError />;
  }

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
          <PrivateRoute allowedRoles={["admin"]}>
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
      <Route
        path="/"
        element={<Navigate to={user ? "/leads" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/leads" : "/login"} replace />}
      />
    </Routes>
  );
}

function App() {
  // Log de debug para verificar ambiente
  React.useEffect(() => {
    console.log("🚀 Iniciando aplicação...");
    console.log("🌍 Ambiente:", import.meta.env.MODE);
    console.log("🔧 Variáveis de ambiente:", {
      SUPABASE_URL: Boolean(import.meta.env.VITE_SUPABASE_URL),
      SUPABASE_KEY: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
      LEADS_TABLE: import.meta.env.VITE_SUPABASE_LEADS_TABLE || "tabelas",
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
