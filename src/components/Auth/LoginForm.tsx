import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Email ou senha incorretos');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="glass-card p-8 relative">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Bem-vindo</h1>
            <p className="text-gray-600">Faça login para acessar o sistema</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-xl backdrop-blur-[8px]">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-8 p-5 bg-amber-400/10 border border-amber-400/30 rounded-xl backdrop-blur-[8px]">
            <p className="text-sm text-amber-800 font-medium mb-3">Contas de teste:</p>
            <div className="space-y-2 text-xs text-amber-700">
              <p><strong>Admin:</strong> admin@leads.com / admin123</p>
              <p><strong>Manager:</strong> manager@leads.com / manager123</p>
              <p><strong>Viewer:</strong> viewer@leads.com / viewer123</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="glass-input w-full pr-12"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-150 ease-out"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {/* tirar comentarios se a logica for para o proprio usuario criar conta */}
            {/* <button
              onClick={onToggleMode}
              className="text-sm text-amber-600 hover:text-amber-700 transition-colors duration-150 ease-out"
            >
              Não tem conta? Criar conta
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}