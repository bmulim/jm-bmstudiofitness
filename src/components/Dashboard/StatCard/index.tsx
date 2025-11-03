import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "orange" | "purple" | "yellow" | "gold";
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: {
    border: "border-blue-500/40",
    bg: "bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-transparent",
    icon: "text-blue-400",
    text: "text-blue-300",
    subtitle: "text-blue-200/80",
    hover: "hover:border-blue-400/60 hover:shadow-blue-400/20",
    glow: "shadow-blue-400/10",
  },
  green: {
    border: "border-green-500/40",
    bg: "bg-gradient-to-br from-green-900/20 via-green-800/10 to-transparent",
    icon: "text-green-400",
    text: "text-green-300",
    subtitle: "text-green-200/80",
    hover: "hover:border-green-400/60 hover:shadow-green-400/20",
    glow: "shadow-green-400/10",
  },
  red: {
    border: "border-red-500/40",
    bg: "bg-gradient-to-br from-red-900/20 via-red-800/10 to-transparent",
    icon: "text-red-400",
    text: "text-red-300",
    subtitle: "text-red-200/80",
    hover: "hover:border-red-400/60 hover:shadow-red-400/20",
    glow: "shadow-red-400/10",
  },
  orange: {
    border: "border-orange-500/40",
    bg: "bg-gradient-to-br from-orange-900/20 via-orange-800/10 to-transparent",
    icon: "text-orange-400",
    text: "text-orange-300",
    subtitle: "text-orange-200/80",
    hover: "hover:border-orange-400/60 hover:shadow-orange-400/20",
    glow: "shadow-orange-400/10",
  },
  purple: {
    border: "border-purple-500/40",
    bg: "bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent",
    icon: "text-purple-400",
    text: "text-purple-300",
    subtitle: "text-purple-200/80",
    hover: "hover:border-purple-400/60 hover:shadow-purple-400/20",
    glow: "shadow-purple-400/10",
  },
  yellow: {
    border: "border-yellow-500/40",
    bg: "bg-gradient-to-br from-yellow-900/20 via-yellow-800/10 to-transparent",
    icon: "text-yellow-400",
    text: "text-yellow-300",
    subtitle: "text-yellow-200/80",
    hover: "hover:border-yellow-400/60 hover:shadow-yellow-400/20",
    glow: "shadow-yellow-400/10",
  },
  gold: {
    border: "border-[#C2A537]/40",
    bg: "bg-gradient-to-br from-[#C2A537]/20 via-[#D4B547]/10 to-transparent",
    icon: "text-[#C2A537]",
    text: "text-[#D4B547]",
    subtitle: "text-[#C2A537]/80",
    hover: "hover:border-[#C2A537]/60 hover:shadow-[#C2A537]/20",
    glow: "shadow-[#C2A537]/10",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  description,
  trend,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Background gradient animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/90" />
      <div className={`absolute inset-0 ${colors.bg} opacity-80`} />

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <Card
        className={`relative ${colors.border} ${colors.hover} ${colors.glow} bg-transparent backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-lg`}
      >
        <CardContent className="p-4 lg:p-6 xl:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Ícone com animação */}
              <div
                className={`rounded-full bg-black/40 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/60 lg:p-3`}
              >
                <Icon
                  className={`h-6 w-6 ${colors.icon} transition-all duration-300 group-hover:rotate-12 lg:h-8 lg:w-8 xl:h-10 xl:w-10`}
                />
              </div>

              <div className="space-y-1">
                {/* Valor principal */}
                <p
                  className={`text-xl font-bold ${colors.text} transition-all duration-300 group-hover:scale-105 lg:text-2xl xl:text-3xl`}
                >
                  {value}
                </p>
                {/* Título */}
                <p
                  className={`text-xs ${colors.subtitle} transition-colors duration-300 lg:text-sm`}
                >
                  {title}
                </p>
                {/* Descrição opcional */}
                {description && (
                  <p className={`text-xs ${colors.subtitle} opacity-75`}>
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Indicador de tendência */}
            {trend && (
              <div className="flex flex-col items-end space-y-1">
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-all duration-300 ${
                    trend.isPositive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <span className={`${trend.isPositive ? "↗" : "↘"}`}></span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
