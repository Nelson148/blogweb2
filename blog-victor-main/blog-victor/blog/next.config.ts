// next.config.ts

import { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Sua configuração existente para Server Actions
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // Limite aumentado para 10MB
        },
    },
    
    // Sua configuração existente para Imagens
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    
    // (A seção webpack customizada não estava aqui)
};

export default nextConfig;