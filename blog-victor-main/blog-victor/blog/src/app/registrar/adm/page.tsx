'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerAdmin } from '@/app/actions'; // Importe a nova ação
import { Shield, Lock, User, Mail, Key, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminRegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await registerAdmin(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Sucesso: Redireciona para o login
        router.push('/login');
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans selection:bg-red-900/30">
      
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card */}
        <div className="bg-gray-900/80 border border-blue-900/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-black rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-800/50 shadow-lg shadow-blue-900/20">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Acesso Restrito</h1>
            <p className="text-gray-400 text-sm mt-2">Criação de conta Administrativa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase ml-1">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  name="name" 
                  type="text" 
                  required
                  placeholder="Seu nome"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase ml-1">Email Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  name="email" 
                  type="email" 
                  required
                  placeholder="admin@exemplo.com"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  name="password" 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
                <div className="space-y-2">
                <label className="text-xs font-bold text-blue-400 uppercase ml-1 flex items-center gap-1">
                    <Key className="w-3 h-3" /> Chave Mestra
                </label>
                <input 
                    name="secretKey" 
                    type="password" 
                    required
                    placeholder="Chave de segurança do sistema"
                    className="w-full bg-blue-900/10 border border-blue-900/30 rounded-xl py-3 px-4 text-blue-100 placeholder-blue-900/50 focus:outline-none focus:border-blue-500 transition-all text-center tracking-widest"
                />
                </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Registrar Admin <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/registrar" className="text-sm text-gray-500 hover:text-white transition-colors">
              Voltar para registro comum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}