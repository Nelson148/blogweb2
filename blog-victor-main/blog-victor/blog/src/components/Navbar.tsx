"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Home, LayoutGrid, LogOut } from "lucide-react";
import { UserAvatar } from "./UserAvatar";

export function Navbar() {
  const { data: session } = useSession();
  const [userImage, setUserImage] = useState<string | null | undefined>(session?.user?.image);

  // Busca a imagem no backend quando a sessão não traz a foto (token não guarda base64)
  useEffect(() => {
    setUserImage(session?.user?.image);

    const fetchImage = async () => {
      if (session?.user?.image) return;
      try {
        const res = await fetch("/api/users/image");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.image) setUserImage(data.image as string);
      } catch (error) {
        console.error("Erro ao buscar imagem do usuário (navbar):", error);
      }
    };

    fetchImage();
  }, [session?.user?.image]);

  return (
    <nav className="fixed w-full z-40 top-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 via-green-500 to-green-300 rounded-lg flex items-center justify-center shadow-lg shadow-green-800/40">
              <span className="font-bold text-black">F1</span>
            </div>
            <span className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Blog
            </span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 md:gap-4">
          <Button 
            as={Link}
            href="/"
            variant="light" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-white/10 hidden md:flex rounded-xl border-0"
          >
            <Home className="h-4 w-4 " />
            <span className="font-semibold ">Início</span>
          </Button>

          <Button 
            as={Link}
            href="/post"
            variant="light" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl border-0"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="font-semibold">Posts</span>
          </Button>

          {session ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              {userImage ? (
                <Link href="/perfil" title="Ir para o Perfil">
                  <img 
                    src={userImage} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-gray-600 object-cover hover:ring-2 ring-blue-500 transition-shadow" 
                  />
                </Link>
              ) : (
                <Link href="/perfil" title="Ir para o Perfil">
                  <UserAvatar 
                    name={session.user?.name || "U"} 
                    image={session.user?.image}
                    className="w-8 h-8"
                  />
                </Link>
              )}

              <span className="text-sm text-gray-400 hidden lg:block">
                Olá, <span className="text-white font-medium">{session.user?.name}</span>
              </span>
              
              <Button 
                variant="light" 
                size="sm" 
                onPress={() => signOut()}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-xl border-0"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          ) : (
          <div className="hidden md:flex gap-2">
            {/* Botão de Login (Secundário em Verde) */}
             <Button
                  as={Link}
                  href="/login"
                  variant="light"
                  size="sm"
                  // Estilos de Login: Texto e Borda Verdes, fundo transparente.
                  className="text-green-300 hover:text-white hover:bg-green-600/20 rounded-full border border-green-600 transition duration-300"
                >
                  Login
              </Button>

              {/* Botão de Registrar (Principal em Gradiente Verde) */}
             <Button
                  as={Link}
                  href="/registrar"
                  size="sm"
                  // Estilos de Registrar: Gradiente Verde Principal.
                  className="bg-gradient-to-br from-green-600 via-green-500 to-green-300 text-white font-semibold hover:shadow-xl hover:shadow-green-800/40 rounded-full border-0 transition duration-300"
                >
                  Registrar
            </Button>
          </div>
          )}
        </nav>
      </div>
    </nav>
  );
}

