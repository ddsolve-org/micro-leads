import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadsContext';
import { LeadsFilters } from './LeadsFilters';
import { LeadsTable } from './LeadsTable';
import { LeadModal } from './LeadModal';
import { LeadDetail } from './LeadDetail';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { DatabaseInfo } from '../Debug/DatabaseInfo';
import { StatusTest } from '../Debug/StatusTest';

export function LeadsPage() {
  const { user } = useAuth();
  const { leads, deleteLead, loading } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [canalFilter, setCanalFilter] = useState(''); // Mudança: canal em vez de source
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [viewingLead, setViewingLead] = useState<Lead | undefined>();
  
  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canCreate = user?.role !== 'viewer';

  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(term) ||
        (lead.email || '').toLowerCase().includes(term) ||
        (lead.phone || '').toLowerCase().includes(term) ||
        (lead.canal || '').toLowerCase().includes(term);

      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesCanal = !canalFilter || lead.canal === canalFilter;

      return matchesSearch && matchesStatus && matchesCanal;
    });
  }, [leads, searchTerm, statusFilter, canalFilter]);

  const handleViewLead = (lead: Lead) => {
    setViewingLead(lead);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteLead(leadToDelete.id);
      setShowDeleteModal(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
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
      {/* Debug: Informações do banco de dados */}
      {/* <DatabaseInfo /> */}
      
      {/* Debug: Teste de cores dos status */}
      {/* <StatusTest /> */}

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
        canalFilter={canalFilter}
        onCanalFilterChange={setCanalFilter}
        leads={leads}
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

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        lead={leadToDelete}
        loading={isDeleting}
      />
    </div>
  );
}