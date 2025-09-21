import React from 'react';
import { Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LeadsTableProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  qualified: 'bg-green-100 text-green-800 border-green-200',
  lost: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels = {
  new: 'Novo',
  contacted: 'Contatado',
  qualified: 'Qualificado',
  lost: 'Perdido',
};

const sourceLabels = {
  website: 'Website',
  social: 'Social Media',
  referral: 'Indicação',
  campaign: 'Campanha',
};

export function LeadsTable({ leads, onViewLead, onEditLead, onDeleteLead }: LeadsTableProps) {
  const { user } = useAuth();
  const canEdit = user?.role !== 'viewer';
  const canDelete = user?.role === 'admin';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-16">
        <Mail className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-lg font-medium text-gray-800 mb-3">Nenhum lead encontrado</h3>
        <p className="text-gray-600 mb-4">Comece criando seu primeiro lead.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-white/80 backdrop-blur-[8px]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Status
            </th>            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Canal
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Valor da Conta
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              CEP
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Atualizado
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/20">
          {leads.map((lead) => (
            <tr key={lead.id} className="glass-table-row">
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-800">{lead.name}</div>
                  <div className="flex items-center text-sm text-gray-600 space-x-4 mt-1">
                    <span className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {lead.email}
                    </span>
                    {lead.phone && (
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.phone}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`glass-badge status-${lead.status}`}>
                  {statusLabels[lead.status]}
                </span>
              </td>              <td className="px-6 py-4 text-sm text-gray-800">
                {sourceLabels[lead.source]}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {lead.valorConta ? 
                  `R$ ${lead.valorConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                  : '-'
                }
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {lead.cep || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div>{formatDate(lead.updatedAt)}</div>
                <div className="text-xs text-gray-500">por {lead.updatedBy}</div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onViewLead(lead)}
                    className="action-button hover:text-amber-400 transition-all duration-200 ease-out p-2 rounded-lg hover:bg-white/10"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {canEdit && (
                    <button
                      onClick={() => onEditLead(lead)}
                      className="action-button hover:text-amber-400 transition-all duration-200 ease-out p-2 rounded-lg hover:bg-white/10"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  
                  {canDelete && (
                    <button
                      onClick={() => onDeleteLead(lead.id)}
                      className="action-button-trash hover:text-red-600 transition-all duration-200 ease-out p-2 rounded-lg hover:bg-white/20"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}