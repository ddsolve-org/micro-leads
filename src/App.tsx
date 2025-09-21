import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadsProvider } from './context/LeadsContext';
import { UsersProvider } from './context/UsersContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Navbar } from './components/Layout/Navbar';
import { LeadsPage } from './components/Leads/LeadsPage';
import { AdminPage } from './components/Admin/AdminPage';

function AppContent() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('leads');

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onToggleMode={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onToggleMode={() => setAuthMode('login')} />
    );
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin':
        return user.role === 'admin' ? <AdminPage /> : <LeadsPage />;
      case 'leads':
      default:
        return <LeadsPage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UsersProvider>
        <LeadsProvider>
          <AppContent />
        </LeadsProvider>
      </UsersProvider>
    </AuthProvider>
  );
}

export default App;