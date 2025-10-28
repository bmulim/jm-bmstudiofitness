import {
  ClipboardCheck,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminMenuProps {
  className?: string;
}

export function AdminMenu({ className = "" }: AdminMenuProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Visão geral e dados dos alunos",
    },
    {
      href: "/admin/checkins",
      label: "Check-ins",
      icon: ClipboardCheck,
      description: "Relatórios de presença",
    },
    {
      href: "/admin/pagamentos",
      label: "Pagamentos",
      icon: DollarSign,
      description: "Controle financeiro",
    },
    {
      href: "/cadastro",
      label: "Novo Aluno",
      icon: Users,
      description: "Cadastrar novo aluno",
    },
  ];

  return (
    <nav className={`h-max-screen space-y-2 ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#C2A537]">
          🏋️ Painel Administrativo
        </h2>
        <p className="text-sm text-slate-400">Área restrita - Acesso total</p>
      </div>

      {menuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
              isActive
                ? "bg-[#C2A537] text-black"
                : "text-slate-300 hover:bg-[#C2A537]/20 hover:text-[#C2A537]"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <div className="flex-1">
              <p className="font-medium">{item.label}</p>
              <p
                className={`text-xs ${
                  isActive ? "text-black/70" : "text-slate-500"
                }`}
              >
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}

      <div className="mt-8 space-y-2 border-t border-slate-700 pt-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-lg p-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-medium">Configurações</p>
            <p className="text-xs text-slate-500">Configurações do sistema</p>
          </div>
        </Link>

        <button
          onClick={() => {
            // Implementar logout aqui
            console.log("Logout");
          }}
          className="flex w-full items-center gap-3 rounded-lg p-3 text-slate-300 transition-colors hover:bg-red-900/20 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          <div className="flex-1 text-left">
            <p className="font-medium">Sair</p>
            <p className="text-xs text-slate-500">Encerrar sessão</p>
          </div>
        </button>
      </div>
    </nav>
  );
}
