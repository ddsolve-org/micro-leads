import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Lead } from '../../types';
import { useLeads } from '../../context/LeadsContext';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead;
}

export function LeadModal({ isOpen, onClose, lead }: LeadModalProps) {
  const { addLead, updateLead } = useLeads();
  
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    status: lead?.status || 'new' as Lead['status'],
    notes: lead?.notes || '',
    valorConta: lead?.valorConta?.toString() || '',
    cep: lead?.cep || '',
    canal: lead?.canal || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        status: lead.status,
        notes: lead.notes || '',
        valorConta: lead.valorConta?.toString() || '',
        cep: lead.cep || '',
        canal: lead.canal || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'new',
        notes: '',
        valorConta: '',
        cep: '',
        canal: '',
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'updatedBy'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        status: formData.status,
        source: 'website', // Valor padrão, será inferido do canal
        notes: formData.notes.trim() || undefined,
        valorConta: formData.valorConta ? parseFloat(formData.valorConta) : undefined,
        cep: formData.cep.trim() || undefined,
        canal: formData.canal.trim() || undefined,
      };

      if (lead) {
        await updateLead(lead.id, leadData);
      } else {
        await addLead(leadData);
      }

      onClose();
    } catch (error) {
      console.error('Failed to submit lead:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-gray-800">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-out p-1 rounded-lg hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
              Nome *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`glass-input w-full ${
                errors.name ? 'border-red-400/60' : ''
              }`}
              placeholder="Nome completo"
              required
            />
            {errors.name && <p className="text-sm text-red-700 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`glass-input w-full ${
                errors.email ? 'border-red-400/60' : ''
              }`}
              placeholder="email@exemplo.com"
              required
            />
            {errors.email && <p className="text-sm text-red-700 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-2">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="glass-input w-full"
              placeholder="+55 11 99999-9999"
            />
          </div>

          <div>
            <label htmlFor="canal" className="block text-sm font-medium text-gray-800 mb-2">
              Canal
            </label>
            <input
              id="canal"
              type="text"
              value={formData.canal}
              onChange={(e) => setFormData({ ...formData, canal: e.target.value })}
              className="glass-input w-full"
              placeholder="Ex: Franquia ABC - Trafego pago"
            />
            <p className="text-xs text-gray-500 mt-1">
              Canal de origem do lead (preenchido automaticamente pela landing page)
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-800 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
              className="glass-input w-full"
            >
              <option value="new">Novo</option>
              <option value="contacted">Contatado</option>
              <option value="qualified">Qualificado</option>
              <option value="lost">Perdido</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="valorConta" className="block text-sm font-medium text-gray-800 mb-2">
                Valor da Conta (R$)
              </label>
              <input
                id="valorConta"
                type="number"
                step="0.01"
                value={formData.valorConta}
                onChange={(e) => setFormData({ ...formData, valorConta: e.target.value })}
                className="glass-input w-full"
                placeholder="0,00"
              />
            </div>

            <div>
              <label htmlFor="cep" className="block text-sm font-medium text-gray-800 mb-2">
                CEP
              </label>
              <input
                id="cep"
                type="text"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                className="glass-input w-full"
                placeholder="00000-000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-800 mb-2">
              Observações
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="glass-input w-full"
              placeholder="Observações sobre o lead..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="glass-button flex-1 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {lead ? 'Salvar' : 'Criar Lead'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}