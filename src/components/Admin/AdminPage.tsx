import React from 'react';
import { Shield, Users, Database } from 'lucide-react';
import { UsersTable } from './UsersTable';

export function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-amber-500 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Administração</h1>
            <p className="text-gray-600">Gerencie usuários, permissões e configurações do sistema</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Administradores</p>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Leads no Sistema</p>
              <p className="text-2xl font-bold text-gray-800">5</p>
            </div>
            <Database className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Users Management */}
      <UsersTable />

      {/* Role Permissions Info */}
      <div className="mt-8 glass-card p-6 bg-amber-400/5">
        <h3 className="text-lg font-semibold text-amber-800 mb-5">Permissões por Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-amber-800 mb-3">Visualizador</h4>
            <ul className="space-y-1 text-amber-700">
              <li>• Ver lista de leads</li>
              <li>• Ver detalhes de leads</li>
              <li>• Usar filtros e busca</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-amber-800 mb-3">Gerente</h4>
            <ul className="space-y-1 text-amber-700">
              <li>• Todas as permissões de Visualizador</li>
              <li>• Criar novos leads</li>
              <li>• Editar leads existentes</li>
              <li>• Alterar status e notas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-amber-800 mb-3">Administrador</h4>
            <ul className="space-y-1 text-amber-700">
              <li>• Todas as permissões de Gerente</li>
              <li>• Excluir leads</li>
              <li>• Acessar área administrativa</li>
              <li>• Gerenciar usuários e roles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}