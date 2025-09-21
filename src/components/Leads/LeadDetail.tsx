import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, User, Tag, FileText, Edit, MapPin } from 'lucide-react';
import { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onEdit: (lead: Lead) => void;
}

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

export function LeadDetail({ lead, onBack, onEdit }: LeadDetailProps) {
  const { user } = useAuth();
  const canEdit = user?.role !== 'viewer';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-150 ease-out mb-6 px-3 py-2 rounded-xl hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para leads
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{lead.name}</h1>
            <div className="flex items-center space-x-4">
              <span className={`glass-badge status-${lead.status}`}>
                {statusLabels[lead.status]}
              </span>
              <span className="text-sm text-gray-500">{sourceLabels[lead.source]}</span>
            </div>
          </div>
          
          {canEdit && (
            <button
              onClick={() => onEdit(lead)}
              className="glass-button-primary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Informações de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{lead.email}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
                {lead.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lead.phone}</p>
                    <p className="text-xs text-gray-500">Telefone</p>
                  </div>
                </div>
              )}
              
              {lead.valorConta && (
                <div className="flex items-center">
                  <Tag className="w-5 h-5 text-gray-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      R$ {lead.valorConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">Valor da Conta</p>
                  </div>
                </div>
              )}
              
              {lead.cep && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lead.cep}</p>
                    <p className="text-xs text-gray-500">CEP</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {lead.notes && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Observações
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar com informações adicionais */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Detalhes</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Tag className="w-5 h-5 text-gray-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{sourceLabels[lead.source]}</p>
                  <p className="text-xs text-gray-500">Fonte</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{formatDate(lead.createdAt)}</p>
                  <p className="text-xs text-gray-500">Criado em</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Histórico</h2>
            <div className="space-y-3">
              <div className="pb-3 border-b border-white/20 last:border-b-0">
                <div className="flex items-start">
                  <User className="w-4 h-4 text-gray-500 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">Última atualização</p>
                    <p className="text-xs text-gray-500">{formatDate(lead.updatedAt)}</p>
                    <p className="text-xs text-gray-500">por {lead.updatedBy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}