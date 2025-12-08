'use client';



import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

import Link from "next/link";

import { useSession, signOut } from 'next-auth/react';

import {

  User, Mail, Lock, Save, Home, LayoutGrid, LogOut, Sparkles, ShieldCheck, Loader2, Camera

} from 'lucide-react';

import { updateUserProfile } from '@/app/actions';

import { Button } from "@heroui/react";



export default function ProfilePage() {

  const { data: session, update } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [dbImage, setDbImage] = useState<string | null>(null);
  const [userImageNav, setUserImageNav] = useState<string | null | undefined>(session?.user?.image);

  

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (file) {

      const url = URL.createObjectURL(file);

      setPreview(url);

    }

  };



  useEffect(() => {
    // Busca a imagem real do Mongo quando a sessão não traz a imagem (token não guarda base64)
    const fetchImage = async () => {
      if (preview || session?.user?.image) return;
      try {
        const res = await fetch("/api/users/image");
        const data = await res.json();
        if (data?.image) setDbImage(data.image as string);
      } catch (error) {
        console.error("Erro ao buscar imagem do usuário:", error);
      }
    };
    fetchImage();
  }, [preview, session?.user?.image]);

  // Mantém a imagem para navbar (cobre casos em que o token não traz a foto)
  useEffect(() => {
    setUserImageNav(session?.user?.image || dbImage);

    const fetchImageForNav = async () => {
      if (session?.user?.image || dbImage) return;
      try {
        const res = await fetch("/api/users/image");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.image) setUserImageNav(data.image as string);
      } catch (error) {
        console.error("Erro ao buscar imagem do usuário (navbar perfil):", error);
      }
    };

    fetchImageForNav();
  }, [session?.user?.image, dbImage]);


  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    setIsLoading(true);

    setMessage(null);



    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);

    // Garante que o arquivo de imagem seja incluído no FormData se foi selecionado
    const imageInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    if (imageInput && imageInput.files && imageInput.files[0]) {
      // Se já não estiver no FormData, adiciona manualmente
      if (!formData.has("image")) {
        formData.append("image", imageInput.files[0]);
      }
    }

    try {

      const result = await updateUserProfile(formData);

      if (result?.error) {

        setMessage({ type: 'error', text: result.error });

      } else {

        setMessage({ type: 'success', text: "Perfil atualizado! Recarregando..." });

       

        // 1. Atualiza a sessão interna do NextAuth
        // Se a imagem foi atualizada, passa a nova imagem Base64
        // Caso contrário, passa null para manter a imagem atual da sessão
        if (session) {
          await update({

              name: formData.get("name") as string,

              image: result.newImage || session.user?.image || null

          });
        }

       

        // 2. Pequeno delay e recarrega a página para atualizar a Navbar globalmente

        setTimeout(() => {

            window.location.reload();

        }, 500);

      }

    } catch (error) {

      console.error("Erro ao atualizar perfil:", error);
      setMessage({ type: 'error', text: "Erro inesperado ao atualizar." });

    } finally {

      setIsLoading(false);

    }

  };



  if (!session) {

    return (

        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500">

            <Loader2 className="animate-spin mr-2" /> Carregando perfil...

        </div>

    );

  }



  const userInitial = session.user?.name?.charAt(0).toUpperCase() || "U";

  const userRole = (session.user as any)?.role === 'admin' ? 'Administrador' : 'Membro da Comunidade';

  const displayImage = preview || session.user?.image || dbImage;



  return (

    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">

     

      {/* Navbar Fixa */}

      <nav className="fixed w-full z-40 top-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">

        <div className="container mx-auto px-6 h-16 flex justify-between items-center">

          <div className="flex items-center gap-2">

            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">

                <div className="w-8 h-8 bg-gradient-to-br from-green-600 via-green-500 to-green-300 rounded-lg flex items-center justify-center shadow-lg shadow-green-800/40">
                  <span className="font-bold text-black">F1</span>
                </div>

                <span className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Blog</span>

            </Link>

          </div>

         

          <nav className="flex items-center gap-2 md:gap-4">

            <Button variant="ghost" size="sm" as={Link} href="/" className="text-gray-300 hover:text-white hover:bg-white/10 hidden md:flex rounded-xl border-0">

              <Home className="h-4 w-4 mr-2" /> Início

            </Button>

            <Button variant="ghost" size="sm" as={Link} href="/post" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl border-0">

              <LayoutGrid className="h-4 w-4 mr-2" /> Posts

            </Button>



            <div className="flex items-center gap-4 border-l border-white/10 pl-4">

                {/* Imagem na Navbar */}

                <div className="flex items-center gap-2">

                    {userImageNav ? (

                        <img src={userImageNav} alt="User" className="w-8 h-8 rounded-full border border-gray-600 object-cover" />

                    ) : (

                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-gray-600">

                            {userInitial}

                        </div>

                    )}

                    <span className="text-sm font-medium hidden md:block">{session.user?.name}</span>

                </div>



                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-red-400 hover:bg-red-500/10 rounded-xl border-0">

                  <LogOut className="h-4 w-4" />

                </Button>

            </div>

          </nav>

        </div>

      </nav>



      <div className="h-16"></div>



      <main className="container mx-auto px-6 py-12 max-w-4xl">

        <form onSubmit={handleSubmit}>

            {/* Header com Avatar */}

            <div className="relative mb-12 p-8 rounded-3xl bg-gray-900/50 border border-gray-800 overflow-hidden text-center md:text-left">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

                    <div className="relative group cursor-pointer">

                        <label htmlFor="imageUpload" className="cursor-pointer block">

                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-blue-900/30 border-4 border-gray-900 overflow-hidden relative">

                                {displayImage ? (

                                    <img src={displayImage} alt="Avatar" className="w-full h-full object-cover" />

                                ) : (

                                    userInitial

                                )}

                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                                    <Camera className="text-white w-8 h-8" />

                                </div>

                            </div>

                        </label>

                        <input id="imageUpload" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                    </div>



                    <div className="space-y-2">

                        <h1 className="text-3xl md:text-4xl font-bold text-white">{session.user?.name}</h1>

                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">

                            <Mail size={16} /> <span>{session.user?.email}</span>

                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">

                            <ShieldCheck size={12} /> {userRole}

                        </div>

                    </div>

                </div>

            </div>



            {/* Inputs */}

            <div className="grid gap-8 md:grid-cols-3">

                <div className="md:col-span-1 space-y-4">

                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="text-blue-500" size={20}/> Editar Perfil</h3>

                    <p className="text-gray-400 text-sm leading-relaxed">Clique na foto para alterar seu avatar.</p>

                </div>



                <div className="md:col-span-2">

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">

                        {message && (

                            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>

                                {message.text}

                            </div>

                        )}



                        <div className="space-y-4">

                            <div className="space-y-2">

                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><User size={16} className="text-blue-500"/> Nome Completo</label>

                                <input type="text" name="name" defaultValue={session.user?.name || ''} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition" />

                            </div>

                            <div className="space-y-2">

                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Mail size={16} className="text-blue-500"/> Email</label>

                                <input type="email" name="email" defaultValue={session.user?.email || ''} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition" />

                            </div>

                            <div className="pt-4 border-t border-gray-800">

                                <div className="space-y-2">

                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Lock size={16} className="text-blue-500"/> Nova Senha</label>

                                    <input type="password" name="password" placeholder="Deixe em branco para manter a atual" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition" />

                                </div>

                            </div>

                        </div>



                        <div className="pt-4 flex justify-end">

                            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-700 to-indigo-600 hover:scale-[1.02] text-white font-bold py-6 px-8 rounded-xl transition-all">

                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Salvando...</> : <><Save className="mr-2 h-4 w-4"/> Salvar Alterações</>}

                            </Button>

                        </div>

                    </div>

                </div>

            </div>

        </form>

      </main>

    </div>

  );

}