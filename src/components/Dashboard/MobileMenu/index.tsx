import { BarChart3, Home, Menu, Settings,Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  currentPath?: string;
  userRole?: "admin" | "user";
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
}

export function MobileMenu({
  currentPath,
  userRole = "user",
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const adminMenuItems: MenuItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Alunos", href: "/admin/students", icon: Users },
    { label: "Relatórios", href: "/admin/reports", icon: BarChart3 },
    { label: "Configurações", href: "/admin/settings", icon: Settings },
  ];

  const userMenuItems: MenuItem[] = [
    { label: "Dashboard", href: "/user/dashboard", icon: Home },
    { label: "Check-ins", href: "/user/check-ins", icon: BarChart3 },
    { label: "Saúde", href: "/user/health", icon: Users },
    { label: "Configurações", href: "/user/settings", icon: Settings },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Botão do menu mobile */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="group border-[#C2A537]/50 bg-black/80 text-[#C2A537] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#C2A537] hover:bg-[#C2A537]/10"
        >
          <Menu
            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu lateral */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-black/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C2A537]/10 via-transparent to-[#D4B547]/5" />

        {/* Header do menu */}
        <div className="relative border-b border-[#C2A537]/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-[#C2A537] to-[#D4B547] p-2">
                <Home className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="font-semibold text-[#C2A537]">JM Fitness</h2>
                <p className="text-xs text-slate-400 capitalize">{userRole}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-[#C2A537]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista de navegação */}
        <nav className="relative p-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "bg-[#C2A537]/20 text-[#C2A537] shadow-lg shadow-[#C2A537]/20"
                      : "text-slate-300 hover:bg-[#C2A537]/10 hover:text-[#C2A537]"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-[#C2A537]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Ícone */}
                  <div
                    className={`relative rounded-lg p-2 transition-all duration-300 ${
                      isActive
                        ? "bg-[#C2A537]/30"
                        : "bg-slate-800/50 group-hover:bg-[#C2A537]/20"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-12 ${
                        isActive ? "text-[#C2A537]" : ""
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="relative font-medium">{item.label}</span>

                  {/* Indicador ativo */}
                  {isActive && (
                    <div className="absolute right-2 h-2 w-2 animate-pulse rounded-full bg-[#C2A537]" />
                  )}

                  {/* Linha de destaque */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#C2A537] to-[#D4B547] transition-all duration-300 ${
                      isActive ? "w-full" : "group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer do menu */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="rounded-lg border border-[#C2A537]/30 bg-[#C2A537]/10 p-3">
            <p className="text-xs font-medium text-[#C2A537]">Versão 1.0.0</p>
            <p className="text-xs text-slate-400">© 2025 JM Fitness Studio</p>
          </div>
        </div>
      </div>
    </>
  );
}
