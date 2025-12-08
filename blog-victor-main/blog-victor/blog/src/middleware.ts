import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    try {
      const token = req.nextauth.token;
      const isAuth = !!token;
      const pathname = req.nextUrl.pathname;
      
      // Rotas de autenticação
      const isAuthPage = pathname.startsWith("/login") || 
                         pathname.startsWith("/registrar");

      // Rotas protegidas que requerem autenticação
      const protectedRoutes = ["/post", "/perfil"];
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
      );

      // Se estiver logado e tentar acessar página de login/registro, redireciona para home
      if (isAuth && isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Se não estiver autenticado e tentar acessar rota protegida
      if (!isAuth && isProtectedRoute) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.next();
    } catch (error) {
      // Tratamento de erros - em caso de falha, permite acesso mas loga o erro
      console.error("Middleware error:", error);
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        try {
          const pathname = req.nextUrl.pathname;
          const protectedRoutes = ["/post", "/perfil"];
          const isProtectedRoute = protectedRoutes.some(route => 
            pathname.startsWith(route)
          );

          // Se for rota protegida, precisa estar autenticado
          if (isProtectedRoute) {
            return !!token;
          }

          // Para outras rotas (incluindo login/registrar), permite acesso
          return true;
        } catch (error) {
          console.error("Authorization callback error:", error);
          // Em caso de erro, nega acesso por segurança
          return false;
        }
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};