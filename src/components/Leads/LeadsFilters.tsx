import React from 'react';
import { Search, Filter } from 'lucide-react';

interface LeadsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (source: string) => void;
}

export function LeadsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
}: LeadsFiltersProps) {
  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </h3>
        <button
          onClick={() => {
            onSearchChange('');
            onStatusFilterChange('');
            onSourceFilterChange('');
          }}
          className="text-sm text-amber-600 hover:text-amber-700 transition-colors duration-150 ease-out"
        >
          Limpar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="glass-input w-full pl-11"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="glass-input"
        >
          <option value="">Todos os status</option>
          <option value="new">Novo</option>
          <option value="contacted">Contatado</option>
          <option value="qualified">Qualificado</option>
          <option value="lost">Perdido</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => onSourceFilterChange(e.target.value)}
          className="glass-input"
        >
          <option value="">Todas as fontes</option>
          <option value="website">Website</option>
          <option value="social">Social Media</option>
          <option value="referral">Indicação</option>
          <option value="campaign">Campanha</option>
        </select>
      </div>
    </div>
  );
}