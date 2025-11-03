import { LogOut } from "lucide-react";
import { ReactNode } from "react";

import { logoutAction } from "@/actions/auth/logout-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardHeaderProps {
  title: string;
  description: string;
  showLogout?: boolean;
  children?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  showLogout = true,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="relative mb-6 overflow-hidden lg:mb-8">
      {/* Background gradient animado */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#C2A537]/20 via-black/95 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4B547]/10 via-transparent to-transparent" />

      <Card className="relative border-[#C2A537]/40 bg-black/90 shadow-lg shadow-[#C2A537]/10 backdrop-blur-sm transition-all duration-500 hover:border-[#C2A537]/60 hover:shadow-xl hover:shadow-[#C2A537]/20">
        <CardHeader className="relative">
          {/* Efeito de brilho sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2A537]/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />

          <div className="relative flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="text-center lg:text-left">
              <CardTitle className="group bg-gradient-to-r from-[#C2A537] via-[#D4B547] to-[#C2A537] bg-clip-text text-2xl font-bold text-transparent transition-all duration-500 hover:scale-105 lg:text-3xl xl:text-4xl">
                <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">
                  {title}
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-slate-300 transition-all duration-300 hover:text-slate-200 lg:text-base xl:text-lg">
                {description}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              {children}

              {showLogout && (
                <form
                  action={logoutAction}
                  className="transition-transform duration-300 hover:scale-105"
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="group relative overflow-hidden border-[#C2A537]/50 bg-black/80 text-[#C2A537] backdrop-blur-sm transition-all duration-300 hover:border-[#C2A537] hover:bg-[#C2A537]/10 hover:text-[#D4B547] hover:shadow-lg hover:shadow-[#C2A537]/30"
                  >
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2A537]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <LogOut className="relative mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    <span className="relative">Sair</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
