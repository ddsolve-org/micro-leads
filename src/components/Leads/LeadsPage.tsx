import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadsContext';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import { LeadModal } from './LeadModal';
import { LeadDetail } from './LeadDetail';

interface LeadsPageProps {
  onNavigate: (page: string, leadId?: string) => void;
}

export function LeadsPage({ onNavigate }: LeadsPageProps) {
  const { user } = useAuth();
  const { leads, deleteLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [viewingLead, setViewingLead] = useState<Lead | undefined>();

  const canCreate = user?.role !== 'viewer';

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const handleViewLead = (lead: Lead) => {
    setViewingLead(lead);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      deleteLead(leadId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(undefined);
  };

  const handleBackToList = () => {
    setViewingLead(undefined);
  };

  if (viewingLead) {
    return (
      <LeadDetail
        lead={viewingLead}
        onBack={handleBackToList}
        onEdit={handleEditLead}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Leads</h1>
          <p className="text-gray-600">
            {filteredLeads.length} {filteredLeads.length === 1 ? 'lead encontrado' : 'leads encontrados'}
          </p>
        </div>
        
        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="glass-button-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </button>
        )}
      </div>

      <LeadsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
      />

      <div className="glass-table">
        <LeadsTable
          leads={filteredLeads}
          onViewLead={handleViewLead}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
        />
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lead={editingLead}
      />
    </div>
  );
}