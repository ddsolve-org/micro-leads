import React, { useState } from 'react';
import { User, LogOut, Users, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const canAccessAdmin = user.role === 'admin';

  return (
    // Tornar a navbar sticky: fica no fluxo até encostar no topo, depois fixa
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-800">LeadSystem</h1>
          
          <div className="flex space-x-2">
            {/* Leads Tab */}
            <button
              onClick={() => onPageChange('leads')}
              className={`group flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                currentPage === 'leads' || currentPage === 'lead-detail'
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
                onClick={() => onPageChange('admin')}
                className={`group flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                  currentPage === 'admin'
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

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="glass-button flex items-center space-x-3 px-4 py-2"
          >
            <div className="w-9 h-9 bg-amber-400/90 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(255,184,2,0.2)] transition-all duration-200 ease-out group-hover:shadow-[0_6px_20px_rgba(255,184,2,0.3)]">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-800">{user.name}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-52 glass-modal py-2 z-10">
              <div className="px-4 py-3 border-b border-white/20">
                <p className="text-xs text-gray-600">Logado como</p>
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
                <p className="text-xs text-amber-600 capitalize font-medium">{user.role}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
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