import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Lead } from '../../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lead: Lead | null;
  loading?: boolean;
}

export function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  lead, 
  loading = false 
}: ConfirmDeleteModalProps) {
  if (!isOpen || !lead) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
      <div className="glass-modal max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500/20 backdrop-blur-[8px] border border-red-500/30 rounded-xl flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Confirmar Exclusão
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-out p-1 rounded-lg hover:bg-white/20 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
            </p>
            
            {/* Lead Info */}
            <div className="bg-white/30 backdrop-blur-[8px] border border-white/40 rounded-xl p-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-amber-400/20 backdrop-blur-[8px] border border-amber-400/30 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-amber-700 font-medium text-sm">
                    {lead.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">{lead.name}</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    {lead.phone && (
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                    )}
                    {lead.valorConta && (
                      <p className="text-sm text-gray-600">
                        Valor: R$ {lead.valorConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="glass-button flex-1 text-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="glass-button-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Lead
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}