import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  resultsCount?: number;
  children?: React.ReactNode;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "🔍 Buscar alunos...",
  resultsCount,
  children,
}: SearchBarProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C2A537]/10 via-[#D4B547]/5 to-[#C2A537]/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/20" />

      <Card className="relative border-[#C2A537]/40 bg-black/60 shadow-lg shadow-[#C2A537]/10 backdrop-blur-sm transition-all duration-500 hover:border-[#C2A537]/60 hover:shadow-xl hover:shadow-[#C2A537]/20">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Header da busca */}
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#C2A537]/20 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C2A537]/30">
                <Search className="h-4 w-4 text-[#C2A537] transition-transform duration-300 group-hover:rotate-12 lg:h-5 lg:w-5" />
              </div>
              <h3 className="bg-gradient-to-r from-[#C2A537] to-[#D4B547] bg-clip-text text-sm font-semibold text-transparent lg:text-base">
                Buscar Alunos
              </h3>
              {searchTerm && resultsCount !== undefined && (
                <div className="animate-pulse rounded-full bg-[#C2A537]/20 px-3 py-1 transition-all duration-300 hover:bg-[#C2A537]/30">
                  <span className="text-xs font-medium text-[#C2A537] lg:text-sm">
                    {resultsCount}{" "}
                    {resultsCount === 1 ? "resultado" : "resultados"}
                  </span>
                </div>
              )}
            </div>

            {/* Campo de busca */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-[#C2A537]" />
              </div>

              <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10 border-[#C2A537]/30 bg-black/60 pr-10 pl-10 text-white transition-all duration-300 placeholder:text-slate-400 focus:border-[#C2A537] focus:bg-black/80 focus:ring-2 focus:ring-[#C2A537]/20 lg:h-12 lg:text-base"
              />

              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-all duration-300 hover:scale-110 hover:text-[#C2A537]"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {/* Efeito de brilho no focus */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-[#C2A537]/10 to-transparent opacity-0 transition-opacity duration-300 focus-within:opacity-100" />
            </div>
          </div>

          {children && (
            <div className="mt-4 transition-all duration-300">{children}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
