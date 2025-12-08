'use client';

import { useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';
import Link from "next/link";
import { 
  Plus, 
  ImageIcon, 
  X, 
  Sparkles, 
  Calendar,    
  MessageCircle, 
  Send           
} from 'lucide-react'; 
import { addPost, listPosts, deletePost, addComment } from '@/app/actions'; 
import { useSession } from 'next-auth/react'; 
import { Button } from "@heroui/react";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { UserAvatar } from "@/components/UserAvatar"; 

// --- Tipos Ajustados (Aceitam string, null ou undefined) ---
interface Comment {
  _id?: string;
  id?: string;
  // Ajuste: image?: string | null para evitar conflitos de tipo
  author: { name: string; image?: string | null } | string; 
  content: string;
  createdAt: string;
}

interface Post {
  _id: string; 
  title: string;
  content: string; 
  // Ajuste: image?: string | null
  author: { name: string; email: string; image?: string | null } | string;
  createdAt: string; 
  imageUrl?: string;
  comments?: Comment[]; 
}


// --- Componente: Modal de Visualização do Post com Comentários ---
const ViewPostModal = ({ 
  post, 
  isOpen, 
  onClose 
}: { 
  post: Post | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  // Lógica de autor do post
  const postAuthorName = typeof post.author === 'string' ? post.author : (post.author?.name || 'Anônimo');
  const postAuthorImage = typeof post.author === 'object' ? post.author?.image : null;

  const dateStr = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handleSendComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const formData = new FormData();
    formData.append("content", commentText);
    formData.append("postId", post._id);

    try {
       const result = await addComment(formData);

       if (result?.error) {
         alert(result.error);
         return;
       }

       const newComment: Comment = {
         id: Math.random().toString(36).substr(2, 9),
         // FIX: Garantimos que a imagem seja string ou null (não undefined)
         author: { 
            name: session?.user?.name || "Eu", 
            image: session?.user?.image || null 
         }, 
         content: commentText,
         createdAt: new Date().toISOString()
       };

       setComments([newComment, ...comments]);
       setCommentText("");

    } catch (error) {
       console.error("Erro ao enviar comentário:", error);
       alert("Erro ao salvar comentário");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-950 border border-gray-800 shadow-2xl shadow-blue-900/20 rounded-2xl animate-in fade-in zoom-in duration-200 scrollbar-hide flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 text-gray-400 bg-black/50 backdrop-blur-sm hover:text-white hover:bg-red-500/80 rounded-full transition">
          <X size={20} />
        </button>

        {/* Lado Esquerdo: Conteúdo do Post */}
        <div className="w-full md:w-2/3 overflow-y-auto max-h-[50vh] md:max-h-[90vh] bg-gray-900">
            <div className="relative w-full h-64 sm:h-80">
            <img 
                src={post.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"} 
                alt={post.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            </div>

            <div className="p-8 -mt-10 relative">
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {post.title}
                </h2>

                <div className="flex flex-wrap gap-4 pb-6 mb-6 border-b border-gray-800 text-gray-400 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={postAuthorName} image={postAuthorImage} className="w-6 h-6" fontSize="text-[10px]"/>
                      <span>{postAuthorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-blue-400" />
                      <span>{dateStr}</span>
                    </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>
        </div>

        {/* Lado Direito: Área de Comentários */}
        <div className="w-full md:w-1/3 bg-black/40 border-l border-gray-800 flex flex-col h-[50vh] md:h-[90vh]">
            <div className="p-5 border-b border-gray-800 flex items-center gap-2 bg-gray-900/50">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Comentários ({comments.length})</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p className="text-sm">Seja o primeiro a comentar!</p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        const authorName = typeof comment.author === 'string' ? comment.author : (comment.author?.name || 'Anônimo');
                        const authorImage = typeof comment.author === 'object' ? comment.author?.image : null;
                        const key = comment._id || comment.id;

                        return (
                            <div key={key} className="flex gap-3 group">
                                <UserAvatar name={authorName} image={authorImage} className="w-8 h-8" />
                                
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-sm font-semibold text-gray-200">{authorName}</span>
                                        <span className="text-[10px] text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 leading-snug">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900 z-10">
                {session ? (
                    <form onSubmit={handleSendComment} className="relative">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                        <button 
                            type="submit" 
                            disabled={!commentText.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                ) : (
                    <div className="text-center p-2">
                        <p className="text-sm text-gray-500 mb-2">Faça login para comentar</p>
                        <Link href="/login" className="text-xs font-bold text-blue-400 hover:underline">
                            Ir para Login
                        </Link>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

// --- Componente: Modal de Criação (Mantido igual) ---
const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (formData: FormData) => void; 
}) => {
  const [preview, setPreview] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    onSubmit(formData);
    setPreview("");
    form.reset();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-gray-900 border border-gray-800 shadow-2xl shadow-blue-900/20 rounded-2xl p-6 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full border border-gray-700 shadow-inner">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Criar Publicação</h3>
          <p className="text-gray-400 text-xs">Compartilhe algo incrível com o mundo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Título</label>
            <input name="title" type="text" required placeholder="Sobre o que vamos falar?" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"/>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Conteúdo</label>
            <textarea name="content" rows={4} required placeholder="Escreva os detalhes aqui..." className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition"/>
          </div>

          <div>
             <label className="block mb-2 text-sm font-medium text-gray-300">Capa do Post</label>
             <label className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500/50 transition overflow-hidden group">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-blue-400 transition">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs font-medium">Clique para adicionar imagem</p>
                  </div>
                )}
                <input name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
             </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="w-1/3 py-3 font-semibold text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 transition border border-gray-700">Cancelar</button>
            <button type="submit" className="w-2/3 py-3 font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-600 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition transform">Publicar Agora</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Função auxiliar para deletar post
const handleDeletePost = async (id: string, onDelete: (id: string) => void) => {
  if (confirm("Tem certeza que deseja excluir este post?")) {
    const formData = new FormData();
    formData.append("id", id);
    try {
      await deletePost(formData);
      onDelete(id);
    } catch (error) {
      alert("Erro ao excluir");
    }
  }
};

// --- Página Principal (Feed) ---
export default function FeedPage() {
  const { data: session } = useSession(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await listPosts();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    }
    fetchData();
  }, []);

  const handleCreatePost = async (formData: FormData) => {
    try {
      const result = await addPost(formData);
      if (result?.error) {
        alert(result.error);
        return;
      }
      const updatedPosts = await listPosts();
      setPosts(updatedPosts);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar post", error);
    }
  };

  const handleDeleteFromList = (id: string) => {
      setPosts(currentPosts => currentPosts.filter(post => post._id !== id));
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="h-16"></div>

      <header className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-400 to-green-300">Posts da Comunidade</span>
        </h2>
        
        {isAdmin ? (
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Criar Nova Publicação</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center pt-4 opacity-50">
             <span className="text-sm text-gray-500 border border-gray-800 rounded-full px-4 py-1">Bem-vindo, leitor!</span>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-3xl bg-gray-900/50">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg">Ainda está vazio por aqui.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {posts.map(post => (
               <PostCard 
                 key={post._id} 
                 post={post} 
                 onDelete={(id) => handleDeletePost(id, handleDeleteFromList)}
                 showDelete={isAdmin}
                 variant="compact"
                 onClick={() => openPost(post)} 
               />
             ))}
           </div>
        )}
      </main>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost}
      />

      <ViewPostModal 
        isOpen={isViewModalOpen}
        post={selectedPost}
        onClose={() => setIsViewModalOpen(false)}
      />

    </div>
  );
}