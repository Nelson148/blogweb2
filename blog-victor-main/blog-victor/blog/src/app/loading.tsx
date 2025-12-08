"use client";

import { Card, CardBody } from "@heroui/react";
import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans flex items-center justify-center p-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
          
          <h2 className="text-lg font-semibold text-white mb-2">
            Carregando...
          </h2>
          
          <p className="text-sm text-gray-400 text-center">
            Por favor, aguarde enquanto preparamos tudo para você.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
