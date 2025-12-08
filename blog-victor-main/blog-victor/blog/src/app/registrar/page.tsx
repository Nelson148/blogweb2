"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions";
import { UserPlus, User, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const result = await registerUser(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 relative font-sans selection:bg-blue-500/30 overflow-hidden">
        {/* Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-gray-900 border border-gray-800 shadow-2xl shadow-green-900/10 rounded-2xl backdrop-blur-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <div className="rounded-full bg-green-500/10 p-4 ring-1 ring-green-500/30">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Conta criada com sucesso!
                </h2>
                <p className="text-gray-400">
                  Redirecionando para o login...
                </p>
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Fundo Preto Profundo (Igual ao Login)
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4 relative font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* Background Effect (Blob Azul) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card Customizado */}
        <div className="bg-gray-900 border border-gray-800 shadow-2xl shadow-blue-900/10 rounded-2xl backdrop-blur-xl p-8">
          
          {/* Header */}
          <div className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                 <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Criar conta
            </h1>
            <p className="text-gray-400">
              Preencha os dados abaixo para começar
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                Nome completo
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-gray-800 text-white placeholder-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-gray-800 text-white placeholder-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-gray-800 text-white placeholder-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Criar conta
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex flex-col space-y-6 pt-8 mt-2">
            <div className="w-full border-t border-gray-800"></div>
            
            <div className="flex flex-col items-center gap-3">
               <div className="text-sm text-gray-500">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
                    Fazer login
                  </Link>
               </div>

                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-white transition-colors mt-2"
                >
                ← Voltar para a página inicial
                </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}