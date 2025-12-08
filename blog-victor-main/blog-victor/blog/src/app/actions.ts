'use server'

import dbConnect from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import Comment from "@/models/Comment"; 
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- AÇÃO DE REGISTRO COMUM ---
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "Preencha tudo!" };

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) return { error: "Email já cadastrado" };

  const hashedPassword = await bcrypt.hash(password, 10);

  // Lógica de Superusuário por Email Específico
  const userRole = email === "admin@admin.com" ? "admin" : "user";

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole 
  });
  
  return { success: true };
}

// --- AÇÃO DE REGISTRO DE ADMIN (COM CHAVE MESTRA) ---
export async function registerAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const secretKey = formData.get("secretKey") as string;

  if (!name || !email || !password || !secretKey) {
    return { error: "Preencha todos os campos!" };
  }

  // Verifica se a chave bate com a do arquivo .env
  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return { error: "Chave Mestra inválida! Acesso negado." };
  }

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) return { error: "Email já cadastrado" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin" 
  });
  
  return { success: true };
}

// --- AÇÃO DE CRIAR POST ---
export async function addPost(formData: FormData) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
      return { error: "Você precisa estar logado." };
  }

  const userRole = (session.user as any).role;
  if (userRole !== "admin") {
      return { error: "Acesso negado: Apenas administradores podem criar posts." };
  }

  const title = formData.get("title");
  const content = formData.get("content");
  const imageFile = formData.get("image") as File;

  let base64Image = "";

  if (imageFile && imageFile.size > 0) {
    // Limite de 10MB (puxado do next.config.ts)
    if (imageFile.size > 10 * 1024 * 1024) { 
        return { error: "A imagem do post deve ter no máximo 10MB." };
    }
    
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      return { error: "Erro ao processar a imagem." };
    }
  }
  
  try {
    await Post.create({
      title,
      content,
      imageUrl: base64Image || null, 
      author: (session.user as any).id, 
    });

    revalidatePath("/post");
    revalidatePath("/");    
    return { success: true };

  } catch (error: any) {
    console.error("Erro ao salvar post:", error);
    return { error: "Erro ao salvar no banco de dados." };
  }
}

// --- AÇÃO DE DELETAR POST ---
export async function deletePost(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== "admin") {
      return { error: "Não autorizado" };
  }

  const id = formData.get("id");
  await dbConnect();
  await Post.findByIdAndDelete(id);
  
  revalidatePath("/post");
  revalidatePath("/");
}

// --- AÇÃO DE ATUALIZAR POST ---
export async function updatePost(formData: FormData) {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.role !== "admin") {
      return { error: "Não autorizado" };
  }

  const id = formData.get("id");
  const title = formData.get("title");
  const content = formData.get("content");
  const imageFile = formData.get("image") as File;

  const updateData: any = { title, content };

  if (imageFile && imageFile.size > 0) {
      // Limite de 10MB
      if (imageFile.size > 10 * 1024 * 1024) { 
          return { error: "A imagem do post deve ter no máximo 10MB." };
      }
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      updateData.imageUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
  }

  await dbConnect();
  await Post.findByIdAndUpdate(id, updateData);

  revalidatePath("/post");
  revalidatePath("/");
  return { success: true };
}

// --- AÇÃO DE CRIAR COMMENT ---
export async function addComment(formData: FormData) {
  await dbConnect(); 

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
      return { error: "Precisa estar logado para comentar" };
  }

  const content = formData.get("content");
  const postId = formData.get("postId");

  if (!content || !postId) {
      return { error: "Dados inválidos" };
  }

  try {
      await Comment.create({
        content,
        author: (session.user as any).id,
        post: postId,
      });

      revalidatePath("/post"); 
      revalidatePath("/"); 
      
      return { success: true };
  } catch (error) {
      console.error("Erro ao salvar comentário:", error);
      return { error: "Erro interno ao salvar." };
  }
}

// --- AÇÃO DE DELETAR COMMENT ---
export async function deleteComment(formData: FormData) {
  const id = formData.get("id");
  const postId = formData.get("postId");

  await dbConnect();
  await Comment.findByIdAndDelete(id);
  
  if (postId) revalidatePath("/post");
}

// --- LISTAR POSTS (CORRIGIDO PARA TRAZER IMAGEM) ---
export async function listPosts() {
  await dbConnect();
  
  const posts = await Post.find()
    // Adicionamos "image" na lista de campos do autor (necessário para a foto de perfil na Home)
    .populate("author", "name email role image") 
    .sort({ createdAt: -1 })
    .lean(); 

  const postsWithComments = await Promise.all(posts.map(async (post: any) => {
    const comments = await Comment.find({ post: post._id })
        // Também buscamos a imagem do autor do comentário
        .populate("author", "name image") 
        .sort({ createdAt: -1 })      
        .lean();
    
    return { ...post, comments };
  }));

  return JSON.parse(JSON.stringify(postsWithComments));
}

// --- LISTAR COMENTÁRIOS ---
export async function listComments(postId: string) {
  await dbConnect();
  const comments = await Comment.find({ post: postId })
    .populate("author", "name image") // Imagem aqui também
    .sort({ createdAt: -1 })
    .lean();
    
  return JSON.parse(JSON.stringify(comments));
}

// --- ESTATÍSTICAS ---
export async function getSiteStats() {
  await dbConnect();
  const totalPosts = await Post.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalComments = await Comment.countDocuments();
  return { totalPosts, totalUsers, totalComments };
}

// --- NOVO: AÇÃO PARA BUSCAR APENAS A IMAGEM DE PERFIL ---
/**
 * Busca a string Base64 da imagem de perfil de um usuário específico
 * para que não seja necessário armazená-la no cookie de sessão.
 */
export async function getUserImage(userId: string) {
    await dbConnect();
    
    // Busca apenas o campo 'image'
    const user = await User.findById(userId).select('image').lean();
    
    // Retorna a string Base64 ou null/undefined
    // O frontend usará isso diretamente no atributo 'src' da tag <img>
    return user ? user.image : null;
}
// -------------------------------------------------------------

// --- ATUALIZAR PERFIL (MODIFICADO) ---
export async function updateUserProfile(formData: FormData) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
      return { error: "Você precisa estar logado." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const imageFile = formData.get("image") as File | null;
  const userId = (session.user as any).id;

  // Objeto que será enviado ao Mongo
  const updateData: any = {};
  let imageUpdated = false; // Flag para saber se a imagem foi alterada

  // Debug: Verifica se o arquivo foi recebido
  console.log("LOG IMAGE DEBUG: imageFile recebido:", imageFile ? {
    name: imageFile.name,
    size: imageFile.size,
    type: imageFile.type
  } : "Nenhum arquivo recebido");

  // 1. Validação do Nome
  if (name && name.trim().length > 0) {
      updateData.name = name;
  }

  // 2. Processamento da Imagem (Base64)
  // Verifica se é um File object válido e se tem tamanho maior que 0
  if (imageFile instanceof File && imageFile.size > 0) {
    
    // Limite de 2MB para não estourar o banco (ajustável)
    if (imageFile.size > 2 * 1024 * 1024) {
        console.error("ERRO UPLOAD: Arquivo maior que 2MB."); 
        return { error: "A imagem deve ter no máximo 2MB." };
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // Salva como string Base64 completa
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      updateData.image = base64Image;
      imageUpdated = true; // Imagem foi salva
    } catch (error) {
      console.error("Erro ao processar imagem para Base64:", error);
      return { error: "Erro ao processar o arquivo de imagem." };
    }
  }

  // 3. Processamento de Senha
  if (password && password.trim().length > 0) {
      if (password.length < 6) return { error: "A senha deve ter no mínimo 6 caracteres." };
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
  }
  
  // 4. Processamento de Email
  if (email && email !== session.user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
          return { error: "Este email já está em uso por outro usuário." };
      }
      updateData.email = email;
  }

  // Se não houver nada para atualizar
  if (Object.keys(updateData).length === 0) {
      return { error: "Nenhuma alteração detectada." };
  }

  try {
      // LOG 9: Dados prontos para DB: [name, image, password, etc.]
      console.log("LOG 9: Dados prontos para DB:", Object.keys(updateData)); 
      
      // O 'new: true' retorna o documento atualizado
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      
      if (!updatedUser) return { error: "Usuário não encontrado." };
      
      // LOG 10: Usuário atualizado com sucesso no DB.
      console.log("LOG 10: Usuário atualizado com sucesso no DB.");

      // Força a atualização do cache do Next.js
      // O 'layout' revalida a navbar para que ela possa chamar o novo getUserImage
      revalidatePath("/", "layout"); 
      revalidatePath("/perfil");
      revalidatePath("/post");
      
      // Retorna a nova imagem Base64 se foi atualizada, ou null
      // Isso permite que o frontend atualize a sessão com a nova imagem
      return { 
        success: true, 
        imageUpdated: imageUpdated,
        newImage: imageUpdated ? updatedUser.image : null
      }; 
  } catch (error) {
      console.error("Erro crítico no banco (updateUserProfile):", error);
      return { error: "Falha ao salvar no banco de dados." };
  }
}