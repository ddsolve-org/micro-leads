import React, { useState } from 'react';
import { X, Save, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { User } from '../../types';
import { useUsers } from '../../context/UsersContext';
import { generateTemporaryPassword, isValidEmail, validatePasswordStrength } from '../../utils/auth';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const { createUser } = useUsers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as User['role'],
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
    });
    setErrors({});
    setSuccessMessage(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generatePassword = () => {
    const newPassword = generateTemporaryPassword();
    setFormData({ ...formData, password: newPassword });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const passwordValidation = validatePasswordStrength(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccessMessage(null);
    
    try {
      const result = await createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        setSuccessMessage(
          `Usuário criado com sucesso!\n\nEmail: ${formData.email}\nSenha: ${result.password}\n\nAnote essas informações e repasse ao usuário.`
        );
        
        // Limpar formulário após sucesso
        setTimeout(() => {
          resetForm();
        }, 5000);
      } else {
        setErrors({ submit: result.error || 'Erro ao criar usuário' });
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setErrors({ submit: 'Erro inesperado ao criar usuário' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-gray-800">
            Criar Novo Usuário
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-out p-1 rounded-lg hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage && (
          <div className="m-6 p-4 bg-green-400/10 border border-green-400/30 rounded-xl backdrop-blur-[8px]">
            <div className="text-sm text-green-700 whitespace-pre-line font-medium">
              {successMessage}
            </div>
            <button
              onClick={handleClose}
              className="mt-3 glass-button-primary text-sm"
            >
              Fechar
            </button>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errors.submit && (
              <div className="p-3 bg-red-400/10 border border-red-400/30 rounded-xl backdrop-blur-[8px]">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                Nome Completo *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`glass-input w-full ${
                  errors.name ? 'border-red-400/60' : ''
                }`}
                placeholder="Nome do usuário"
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Senha *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`glass-input w-full pr-20 ${
                    errors.password ? 'border-red-400/60' : ''
                  }`}
                  placeholder="Senha do usuário"
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-gray-500 hover:text-amber-600 p-1"
                    title="Gerar senha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="text-sm text-red-700 mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres, deve conter letras e números
              </p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-800 mb-2">
                Perfil de Acesso *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="glass-input w-full"
                required
              >
                <option value="viewer">Visualizador - Apenas visualizar leads</option>
                <option value="manager">Gerente - Criar e editar leads</option>
                <option value="admin">Administrador - Acesso total</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
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
                    Criar Usuário
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}