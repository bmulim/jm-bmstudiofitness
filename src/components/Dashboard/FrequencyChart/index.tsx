import { BarChart3, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ShiftData {
  shift: string;
  count: number;
  color: string;
}

interface FrequencyChartProps {
  title: string;
  subtitle: string;
  data: ShiftData[];
  total: number;
}

export function FrequencyChart({
  title,
  subtitle,
  data,
  total,
}: FrequencyChartProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C2A537]/20 via-black/90 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#D4B547]/10 via-transparent to-[#C2A537]/5" />

      {/* Efeito de brilho */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2A537]/8 to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100" />

      <Card className="relative border-[#C2A537]/40 bg-black/70 shadow-xl shadow-[#C2A537]/20 backdrop-blur-md transition-all duration-500 hover:border-[#C2A537]/60 hover:shadow-2xl hover:shadow-[#C2A537]/30">
        <CardContent className="p-6 lg:p-8">
          {/* Header do gráfico */}
          <div className="mb-6 flex items-center gap-4 lg:mb-8">
            {/* Ícone animado */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#C2A537]/30 blur-md transition-all duration-500 group-hover:scale-110 group-hover:blur-lg" />
              <div className="relative rounded-full bg-gradient-to-br from-[#C2A537] to-[#D4B547] p-3 transition-all duration-300 hover:scale-110 hover:rotate-12 lg:p-4">
                <BarChart3 className="h-6 w-6 text-black transition-transform duration-300 group-hover:rotate-180 lg:h-8 lg:w-8" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="bg-gradient-to-r from-[#C2A537] to-[#D4B547] bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:scale-105 lg:text-2xl xl:text-3xl">
                  {title}
                </p>
                <TrendingUp className="h-5 w-5 text-[#C2A537] transition-all duration-300 group-hover:scale-110 group-hover:text-[#D4B547]" />
              </div>
              <p className="text-sm text-[#C2A537]/80 transition-colors duration-300 group-hover:text-[#C2A537] lg:text-base">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Gráfico de barras melhorado */}
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {data.map((shift, index) => (
              <div
                key={shift.shift}
                className="group/bar space-y-3 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header da barra */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white transition-all duration-300 group-hover/bar:text-[#C2A537] lg:text-lg">
                    {shift.shift}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white transition-all duration-300 group-hover/bar:scale-110 lg:text-3xl">
                      {shift.count}
                    </span>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#C2A537] opacity-0 transition-opacity duration-300 group-hover/bar:opacity-100" />
                  </div>
                </div>

                {/* Barra de progresso 3D */}
                <div className="relative">
                  {/* Background da barra */}
                  <div className="h-6 rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-inner lg:h-8">
                    {/* Barra de progresso */}
                    <div
                      className={`group-hover/bar:animate-pulse ${shift.color} relative h-full rounded-full shadow-lg transition-all duration-1000 ease-out hover:shadow-xl`}
                      style={{
                        width: `${total > 0 ? (shift.count / total) * 100 : 0}%`,
                      }}
                    >
                      {/* Efeito de brilho na barra */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover/bar:opacity-100" />

                      {/* Indicador no final da barra */}
                      <div className="absolute top-1/2 right-0 h-4 w-4 translate-x-2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition-all duration-300 group-hover/bar:opacity-100" />
                    </div>
                  </div>

                  {/* Reflexo 3D */}
                  <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/20 to-transparent opacity-60" />
                </div>

                {/* Estatísticas */}
                <div className="flex items-center justify-between text-sm lg:text-base">
                  <span className="text-slate-400 transition-colors duration-300 group-hover/bar:text-[#C2A537]/80">
                    {total > 0 ? Math.round((shift.count / total) * 100) : 0}%
                    do total
                  </span>
                  <span className="text-xs text-slate-500 opacity-0 transition-all duration-300 group-hover/bar:opacity-100">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
