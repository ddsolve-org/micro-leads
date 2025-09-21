import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Users, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const canAccessAdmin = user.role === 'admin';
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-800">Micro-Leads</h1>
          
          <div className="flex space-x-2">
            {/* Leads Tab */}
            <button
              onClick={() => navigate('/leads')}
              className={`group flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                currentPath === '/leads'
                  ? 'glass-button-primary ring-1 ring-amber-400/40 shadow-[0_8px_24px_rgba(255,184,2,0.25)]'
                  : 'glass-button text-gray-700 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Leads
            </button>

            {/* Admin Tab */}
            {canAccessAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className={`group flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                  currentPath === '/admin'
                    ? 'glass-button-primary ring-1 ring-amber-400/40 shadow-[0_8px_24px_rgba(255,184,2,0.25)]'
                    : 'glass-button text-gray-700 hover:text-gray-800'
                }`}
              >
                <Users className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="glass-button flex items-center space-x-3 text-left hover:bg-white/20 rounded-xl px-3 py-2 transition-all duration-200 ease-out"
          >
            <div className="w-8 h-8 bg-amber-400/90 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-800">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 glass-card rounded-xl shadow-[0_16px_40px_rgba(31,38,135,0.2)] border border-white/20 py-2 z-50">
              <div className="px-4 py-3 border-b border-white/20">
                <p className="text-xs text-gray-600">Logado como</p>
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
                <p className="text-xs text-amber-600 capitalize font-medium">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-400/10 transition-all duration-150 ease-out"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}