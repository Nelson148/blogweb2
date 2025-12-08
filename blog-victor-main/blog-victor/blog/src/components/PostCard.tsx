import Link from "next/link";
import { Calendar, User, MessageCircle, ArrowRight, Trash2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Button } from "@heroui/react";
import { UserAvatar } from "./UserAvatar";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
    image?: string | null;
  } | string | null;
  createdAt: string;
  comments?: any[];
  imageUrl?: string;
}

interface PostCardProps {
  post: Post;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  variant?: "default" | "compact";
  onClick?: () => void;
}

export function PostCard({ 
  post, 
  showDelete = false, 
  onDelete, 
  variant = "default",
  onClick 
}: PostCardProps) {
  const authorName = typeof post.author === 'string' 
    ? post.author 
    : (post.author?.name || 'Autor Desconhecido');
  
  const authorImage = typeof post.author === 'object' 
    ? post.author?.image 
    : null;

  const dateStr = new Date(post.createdAt).toLocaleDateString("pt-BR");
  const commentsCount = post.comments?.length || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm("Tem certeza que deseja excluir este post?")) {
      onDelete(post._id);
    }
  };

  if (variant === "compact") {
    return (
      <article 
        onClick={onClick}
        className="group relative flex flex-col overflow-hidden bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 cursor-pointer"
      >
        {showDelete && onDelete && (
          <button 
            onClick={handleDeleteClick}
            className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-sm text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-200 transition-all"
            title="Excluir Post"
          >
            <Trash2 size={16} />
          </button>
        )}

        <div className="relative w-full h-52 overflow-hidden bg-gray-800">
          <img 
            src={post.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"} 
            alt={post.title} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        </div>

        <div className="flex flex-col flex-1 p-6">
          <h3 className="mb-3 text-xl font-bold text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-400 transition-all">
            {post.title}
          </h3>
          <p className="mb-6 text-sm text-gray-400 line-clamp-3 leading-relaxed">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-800">
            <div className="flex items-center gap-2">
              <UserAvatar name={authorName} image={authorImage} />
              <span className="text-xs font-medium text-gray-400">{authorName}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle size={14} />
                <span className="text-xs">{commentsCount}</span>
              </div>
              <span className="text-xs text-gray-500">{dateStr}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variante default (usada na homepage)
  return (
    <Card 
      className="group overflow-hidden bg-gray-900 border-gray-800 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col"
      onClick={onClick}
    >
      {showDelete && onDelete && (
        <button 
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-sm text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-200 transition-all"
          title="Excluir Post"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="relative w-full h-48 overflow-hidden bg-gray-800">
        <img 
          src={post.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"} 
          alt={post.title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
      </div>

      <CardHeader className="flex flex-col items-start gap-2">
        <h3 className="line-clamp-2 text-xl text-white group-hover:text-blue-400 transition-colors font-semibold">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User className="h-3 w-3" />
          <span>{authorName}</span>
          <span>•</span>
          <Calendar className="h-3 w-3" />
          <span>{dateStr}</span>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{post.content}</p>
        <div className="mt-4">
          <Button 
            as={Link}
            href="/post"
            variant="light"
            size="sm"
            className="text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-transform p-0 h-auto"
          >
            Ler mais <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

