import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-10 text-center">
      <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
        <ShoppingBag className="h-5 w-5 text-gray-400" />
        <span className="font-bold text-gray-300">F1 BLOG</span>
      </div>
      <p className="text-gray-600 text-sm">© 2024 F1 BLOG. Todos os direitos reservados.</p>
    </footer>
  );
}

