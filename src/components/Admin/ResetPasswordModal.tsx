import React, { useState } from 'react';
import { X, Key, Copy, CheckCircle } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  newPassword?: string;
  isLoading: boolean;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  newPassword,
  isLoading
}: ResetPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPassword = async () => {
    if (newPassword) {
      try {
        await navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar senha:', error);
      }
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-3xl flex items-center justify-center z-50">
      <div className="glass-modal max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-400/90 rounded-full flex items-center justify-center mr-3 shadow-[0_4px_16px_rgba(255,184,2,0.2)]">
              <Key className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {newPassword ? 'Nova Senha Gerada' : 'Resetar Senha'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!newPassword ? (
            <>
              <p className="text-gray-700">
                Confirma o reset da senha do usuário <strong>{userName}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                Uma nova senha temporária será gerada automaticamente.
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Senha resetada com sucesso!</span>
              </div>
              
              <div className="bg-white/30 backdrop-blur-[8px] rounded-lg p-4 border border-white/20">
                <p className="text-sm text-gray-600 mb-2">Nova senha para <strong>{userName}</strong>:</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-gray-100/80 px-3 py-2 rounded text-sm font-mono text-gray-800 border border-gray-200/50">
                    {newPassword}
                  </code>
                  <button
                    onClick={handleCopyPassword}
                    className={`p-2 rounded-lg transition-colors ${
                      copied 
                        ? 'bg-green-100 text-green-600 border border-green-200' 
                        : 'bg-white/50 text-gray-600 hover:bg-white/70 border border-white/30'
                    }`}
                    title="Copiar senha"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-1">Senha copiada!</p>
                )}
              </div>
              
              <div className="bg-amber-50/80 backdrop-blur-[8px] rounded-lg p-3 border border-amber-200/50">
                <p className="text-sm text-amber-700">
                  ⚠️ Informe esta senha ao usuário e oriente-o a alterá-la no primeiro acesso.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-white/20">
          {!newPassword ? (
            <>
              <button
                onClick={handleClose}
                className="glass-button-secondary"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="glass-button-primary"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Resetando...
                  </div>
                ) : (
                  'Resetar Senha'
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="glass-button-primary"
            >
              Concluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
