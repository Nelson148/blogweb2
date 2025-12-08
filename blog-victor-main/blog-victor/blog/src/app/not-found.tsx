"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Home, ArrowLeft, SearchX, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="flex items-center justify-center px-4 pt-12 pb-12 min-h-screen relative z-10">
        {/* Efeitos de fundo sutis */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full animate-pulse" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* Imagem principal - estilo cartoon */}
        <div className={`relative flex items-center justify-center mb-6 transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
          <div className="relative w-full max-w-2xl">
            {/* Imagem da ilustração 404 */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center">
              {!imageError ? (
                <Image
                  src="https://i.postimg.cc/QtGr1qYD/Gemini-Generated-Image-we1vd9we1vd9we1v.png"
                  alt="Error 404 - Ops nada aqui!"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  onError={() => {
                    // Ativa o fallback se a imagem não carregar
                    setImageError(true);
                  }}
                />
              ) : (
                // Fallback caso a imagem não exista ou não carregue
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl border-2 border-green-500/30 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <h1 className="text-8xl md:text-[10rem] font-extrabold text-white drop-shadow-lg">
                      404
                    </h1>
                    <p className="text-2xl md:text-3xl font-bold text-green-100">
                      Ops! Nada aqui!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Texto principal com animação */}
        <div className={`space-y-4 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Página não encontrada
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A página que você está procurando não existe ou foi movida para outro endereço.
            <br />
            <span className="text-green-400">Mas não se preocupe, ainda temos muito conteúdo incrível para você!</span>
          </p>
        </div>

        {/* Botões de ação com animação */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Button 
            as={Link}
            href="/"
            size="lg" 
            className="h-12 px-8 bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-green-500/30 hover:scale-105 transition-all font-semibold"
            startContent={<Home className="h-4 w-4" />}
          >
            Voltar para Home
          </Button>
          
          <Button 
            size="lg" 
            variant="bordered"
            onPress={() => window.history.back()}
            className="h-12 px-8 border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500 hover:scale-105 transition-all bg-transparent font-semibold"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Voltar
          </Button>
        </div>

        {/* Links úteis */}
        <div className={`pt-8 border-t border-gray-800 transition-all duration-1000 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-sm text-gray-500 mb-4">Ou explore:</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link 
              href="/post" 
              className="group text-green-400 hover:text-green-300 transition-all text-sm font-medium flex items-center gap-2 hover:scale-110"
            >
              <SearchX className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Posts
            </Link>
            <Link 
              href="/login" 
              className="group text-green-400 hover:text-green-300 transition-all text-sm font-medium flex items-center gap-2 hover:scale-110"
            >
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Login
            </Link>
            <Link 
              href="/registrar" 
              className="group text-green-400 hover:text-green-300 transition-all text-sm font-medium flex items-center gap-2 hover:scale-110"
            >
              <Home className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              Registrar
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}