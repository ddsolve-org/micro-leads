import React, { useMemo } from 'react';
import { Search, Filter } from 'lucide-react';

interface LeadsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  canalFilter: string;
  onCanalFilterChange: (value: string) => void;
  leads: any[]; // Para extrair canais únicos
}

export function LeadsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  canalFilter,
  onCanalFilterChange,
  leads,
}: LeadsFiltersProps) {
  // Extrair canais únicos dos leads para o filtro
  const uniqueCanals = useMemo(() => {
    const canals = leads
      .map(lead => lead.canal)
      .filter(canal => canal && canal.trim() !== '')
      .filter((canal, index, arr) => arr.indexOf(canal) === index)
      .sort();
    return canals;
  }, [leads]);

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
            onCanalFilterChange('');
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
            placeholder="Buscar por nome, email ou telefone..."
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
          value={canalFilter}
          onChange={(e) => onCanalFilterChange(e.target.value)}
          className="glass-input"
        >
          <option value="">Todos os canais</option>
          {uniqueCanals.map((canal) => (
            <option key={canal} value={canal}>
              {canal}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}