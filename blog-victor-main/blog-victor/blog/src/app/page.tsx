  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import { useSession } from "next-auth/react";
  import { Button } from "@heroui/react";
  import { 
    Sparkles, 
    Loader2,
    User,
    MessageCircle,
    LayoutGrid,
    ArrowRight,
  } from "lucide-react";

  import { listPosts, getSiteStats } from "@/app/actions";
  import { Navbar } from "@/components/Navbar";
  import { Footer } from "@/components/Footer";
  import { PostCard } from "@/components/PostCard";
  import { StatsCard } from "@/components/StatsCard"; 

  interface Post {
    _id: string;
    title: string;
    content: string;
    // A interface agora aceita um objeto User ou o ID (string) caso não seja populado
    author: {
      name: string;
      email: string;
    } | string | null; // Adicionado 'null' para refletir que pode vir nulo do backend
    createdAt: string;
    comments?: any[];
    imageUrl?: string;
  }

  export default function HomePage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [stats, setStats] = useState({
      totalPosts: 0,
      totalUsers: 0,
      totalComments: 0,
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [postsData, statsData] = await Promise.all([
            listPosts(),
            getSiteStats()
          ]);
          
          if (postsData) {
            const recentPosts = postsData.slice(0, 3); 
            setPosts(recentPosts);
          }

          if (statsData) {
            setStats({
              totalPosts: statsData.totalPosts,
              totalUsers: statsData.totalUsers,
              totalComments: statsData.totalComments,
            });
          }

        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">
        <Navbar />

          {/* Hero Section */}
          <section className="relative overflow-hidden pt-32 pb-20 px-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="container mx-auto relative z-10">

              {/* --- INÍCIO DO BANNER (Agora dentro do container correto) --- */}
          <div className="w-full max-w-5xl mx-auto mb-12 group">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-green-900/20">
              <img 
                src="https://i.postimg.cc/13hzP3Xh/banner-green-1.png" 
                alt="Carpedien Banner" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          {/* --- FIM DO BANNER --- */}

              <div className="max-w-4xl mx-auto text-center space-y-8"> 

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-900/20 border border-green-500/30 text-green-400 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                <span className="text-xs font-bold tracking-wide uppercase">Bem-vindo à comunidade</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Descubra e Compartilhe <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-400 to-green-300">
                  Conteúdo Incrível
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Uma plataforma moderna para criar, compartilhar e descobrir posts interessantes.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button 
                  as={Link}
                  href="/post"
                  size="lg" 
                  className="h-12 px-8 bg-white text-black font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all"
                  endContent={<ArrowRight className="h-4 w-4" />}
                >
                  Ver todos os posts recentes
                </Button>
                
                {!session && (
                    <Button 
                      as={Link}
                      href="/registrar"
                      size="lg" 
                      variant="bordered" 
                      className="h-12 px-8 rounded-full border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500 bg-transparent"
                    >
                      Criar Conta
                    </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 border-y border-white/5 bg-black/20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Posts"
                value={stats.totalPosts}
                icon={<LayoutGrid className="h-6 w-6" />}
                loading={loading}
                iconBgColor="bg-blue-500/10"
                iconTextColor="text-blue-400"
              />
              <StatsCard
                title="Usuários"
                value={stats.totalUsers}
                icon={<User className="h-6 w-6" />}
                loading={loading}
                iconBgColor="bg-indigo-500/10"
                iconTextColor="text-indigo-400"
              />
              <StatsCard
                title="Comentários"
                value={stats.totalComments}
                icon={<MessageCircle className="h-6 w-6" />}
                loading={loading}
                iconBgColor="bg-cyan-500/10"
                iconTextColor="text-cyan-400"
              />
            </div>
          </div>
        </section>

        {/* Posts Section (Preview) */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                  Destaques
                </h2>
                <p className="text-gray-400">
                  Veja o que está acontecendo agora.
                </p>
              </div>
              
              <Button 
                as={Link}
                href="/post"
                variant="light" 
                className="hidden md:flex text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                endContent={<ArrowRight className="h-4 w-4" />}
              >
                Ver todos os posts
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post}
                    variant="default"
                  />
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && (
                <div className="text-center py-16 bg-gray-900/30 border border-gray-800 border-dashed rounded-2xl">
                  <Sparkles className="h-10 w-10 text-gray-600 mx-auto mb-3 opacity-50"/>
                  <p className="text-gray-500">Nenhum destaque no momento.</p>
                </div>
            )}

            <div className="mt-12 text-center md:hidden">
              <Button 
                as={Link}
                href="/post"
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold"
              >
                Ver todos os posts
              </Button>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    );
  }