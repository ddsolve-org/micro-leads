import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { LeadsProvider } from './context/LeadsContext';
import { Layout } from './components/Layout/Layout';
import { LoginPage } from './components/Auth/LoginPage';
import { LeadsPage } from './components/Leads/LeadsPage';
import { AdminPage } from './components/Admin/AdminPage';
import { useAuth } from './context/AuthContext';

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
  
  if (!user) {
    return <LoginPage />;
  }
  
  return (
    <UsersProvider>
      <LeadsProvider>
        <Layout>
          <Routes>
            <Route path="/leads" element={<LeadsPage />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminPage />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/leads" replace />} />
            <Route path="*" element={<Navigate to="/leads" replace />} />
          </Routes>
        </Layout>
      </LeadsProvider>
    </UsersProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;