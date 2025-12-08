import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// --- Constante para verificar se é Base64 ---
// O Base64 de imagem começa com "data:image/" ou similar.
const IS_BASE64 = (image: string | undefined | null) => { // Ajustado para aceitar null
    return image && image.startsWith('data:');
}
// ---------------------------------------------

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();
                
                // Mantenha o .select("+password") para comparação de senha
                const user = await User.findOne({ email: credentials?.email }).select("+password");
                
                if (!user) throw new Error("Usuário não encontrado");

                const isValid = await bcrypt.compare(credentials!.password, user.password);
                if (!isValid) throw new Error("Senha incorreta");

                // Retorna o objeto User completo (NextAuth pega e passa para o JWT)
                // Usando 'as any' para evitar o erro de tipagem do TypeScript
                return { 
                    id: user._id.toString(), 
                    email: user.email, 
                    name: user.name,
                    role: user.role, 
                    image: user.image
                } as any; 
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            
            // 1. LOGIN INICIAL: Se houver um 'user' vindo do authorize
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                
                // CRUCIAL: Usando 'as any' para acessar user.image sem erro de tipagem.
                const userImage = (user as any).image;

                if (!IS_BASE64(userImage)) {
                    token.picture = userImage; 
                } else {
                    // Se for Base64, deixe token.picture vazio/undefined/null
                    token.picture = null; 
                }
            }

            // 2. ATUALIZAÇÃO: Se for uma chamada update() do frontend
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                
                // CRUCIAL: Usando 'as any' para acessar session.image (que é o Base64 retornado da Server Action)
                const sessionImage = (session as any).image;

                if (sessionImage && !IS_BASE64(sessionImage)) {
                     token.picture = sessionImage;
                } else if (sessionImage === null) {
                    // Limpar a imagem se o usuário deletou
                    token.picture = null;
                }
            }
            
            return token;
        },
        
        // 3. SESSÃO: Transfere dados do token para o objeto de sessão
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                
                // A imagem da sessão agora vem do token.picture (que é a URL pequena)
                session.user.image = token.picture; 
            }
            return session;
        }
    }
};