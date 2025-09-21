import React from 'react';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-md">
        <LoginForm onToggleMode={() => {}} />
      </div>
    </div>
  );
}