import React, { useState } from 'react';
import { User, Shield, AlertTriangle } from 'lucide-react';
import { User as UserType } from '../../types';
import { useUsers } from '../../context/UsersContext';
import { useAuth } from '../../context/AuthContext';

export function UsersTable() {
  const { users, updateUserRole, loading } = useUsers();
  const { user: currentUser } = useAuth();
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const roleLabels = {
    viewer: 'Visualizador',
    manager: 'Gerente',
    admin: 'Administrador',
  };

  const roleColors = {
    viewer: 'bg-gray-100 text-gray-800',
    manager: 'bg-blue-100 text-blue-800',
    admin: 'bg-red-100 text-red-800',
  };

  const handleRoleChange = async (userId: string, newRole: UserType['role']) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'admin' && newRole !== 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        alert('Deve existir pelo menos um administrador no sistema.');
        return;
      }
    }

    if (window.confirm(`Confirma a alteração do role de ${user.name} para ${roleLabels[newRole]}?`)) {
      setChangingRole(userId);
      try {
        await updateUserRole(userId, newRole);
        // In a real app, show success toast
      } catch (error) {
        // In a real app, show error toast
        console.error('Erro ao alterar role:', error);
      } finally {
        setChangingRole(null);
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/30 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/30 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-white/30 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-8 bg-white/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-table overflow-hidden">
      <div className="px-6 py-5 border-b border-white/20 bg-white/10 backdrop-blur-[8px]">
        <h2 className="text-lg font-semibold text-gray-800">Usuários do Sistema</h2>
        <p className="text-sm text-gray-600 mt-1">Gerencie roles e permissões dos usuários</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-white/10 backdrop-blur-[8px]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Role Atual
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Alterar Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {users.map((user) => (
              <tr key={user.id} className="glass-table-row">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-400/90 rounded-full flex items-center justify-center mr-4 shadow-[0_4px_16px_rgba(255,184,2,0.2)]">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {user.id === currentUser?.id && (
                        <span className="text-xs text-amber-600 font-medium">(Você)</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`glass-badge role-${user.role}`}>
                    {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.id === currentUser?.id ? (
                    <span className="text-sm text-gray-600">Não é possível alterar seu próprio role</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserType['role'])}
                        disabled={changingRole === user.id}
                        className="glass-input text-sm px-3 py-2"
                      >
                        <option value="viewer">Visualizador</option>
                        <option value="manager">Gerente</option>
                        <option value="admin">Administrador</option>
                      </select>
                      {changingRole === user.id && (
                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1 && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" title="Último administrador" />
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}