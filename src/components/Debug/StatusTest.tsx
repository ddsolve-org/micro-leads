import React from 'react';

export function StatusTest() {
  const statuses = [
    { key: 'new', label: 'Novo' },
    { key: 'contacted', label: 'Contatado' },
    { key: 'qualified', label: 'Qualificado' },
    { key: 'lost', label: 'Perdido' }
  ];

  return (
    <div className="p-6 bg-white/20 backdrop-blur-[16px] border border-white/40 rounded-2xl mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Teste de Cores dos Status
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {statuses.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className={`glass-badge status-${key}`}>
              {label}
            </span>
            <span className="text-xs text-gray-600">{key}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <p>Se as cores não estiverem aparecendo, verifique:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Console do navegador para erros de CSS</li>
          <li>Se o Tailwind está compilando corretamente</li>
          <li>Se não há outros arquivos CSS sobrescrevendo</li>
        </ul>
      </div>
    </div>
  );
}