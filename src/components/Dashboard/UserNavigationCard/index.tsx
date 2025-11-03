import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

interface UserNavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  colorClass: string;
  onClick?: () => void;
}

const colorMapping = {
  blue: {
    gradient: "from-blue-600/20 via-blue-500/10 to-blue-400/5",
    border: "border-blue-500/40",
    icon: "text-blue-400",
    title: "text-blue-300",
    description: "text-blue-200/80",
    hover: "hover:border-blue-400/60 hover:shadow-blue-400/30",
    glow: "shadow-blue-400/20",
  },
  green: {
    gradient: "from-green-600/20 via-green-500/10 to-green-400/5",
    border: "border-green-500/40",
    icon: "text-green-400",
    title: "text-green-300",
    description: "text-green-200/80",
    hover: "hover:border-green-400/60 hover:shadow-green-400/30",
    glow: "shadow-green-400/20",
  },
  orange: {
    gradient: "from-orange-600/20 via-orange-500/10 to-orange-400/5",
    border: "border-orange-500/40",
    icon: "text-orange-400",
    title: "text-orange-300",
    description: "text-orange-200/80",
    hover: "hover:border-orange-400/60 hover:shadow-orange-400/30",
    glow: "shadow-orange-400/20",
  },
  purple: {
    gradient: "from-purple-600/20 via-purple-500/10 to-purple-400/5",
    border: "border-purple-500/40",
    icon: "text-purple-400",
    title: "text-purple-300",
    description: "text-purple-200/80",
    hover: "hover:border-purple-400/60 hover:shadow-purple-400/30",
    glow: "shadow-purple-400/20",
  },
};

function getColorStyles(colorClass: string) {
  const colorKey = Object.keys(colorMapping).find((key) =>
    colorClass.includes(key),
  );
  return colorKey
    ? colorMapping[colorKey as keyof typeof colorMapping]
    : colorMapping.blue;
}

export function UserNavigationCard({
  icon: Icon,
  title,
  description,
  href,
  colorClass,
  onClick,
}: UserNavigationCardProps) {
  const colors = getColorStyles(colorClass);

  const cardContent = (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Background com múltiplas camadas */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/90" />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}
      />

      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-500 group-hover:animate-pulse group-hover:opacity-100" />

      {/* Partículas flutuantes */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute top-2 right-2 h-1 w-1 rounded-full ${colors.icon} animate-ping`}
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className={`absolute bottom-3 left-3 h-0.5 w-0.5 rounded-full ${colors.icon} animate-ping`}
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Card
        className={`relative ${colors.border} ${colors.hover} ${colors.glow} bg-transparent backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl ${href || onClick ? "cursor-pointer" : ""}`}
      >
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center gap-4">
            {/* Ícone com efeito 3D */}
            <div className="relative">
              {/* Sombra do ícone */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} blur-sm transition-all duration-300 group-hover:scale-110 group-hover:blur-md`}
              />

              {/* Container do ícone */}
              <div className="relative rounded-full bg-black/50 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-black/70 lg:p-4">
                <Icon
                  className={`h-6 w-6 ${colors.icon} transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 lg:h-8 lg:w-8`}
                />
              </div>
            </div>

            {/* Conteúdo textual */}
            <div className="flex-1 space-y-1">
              <h3
                className={`font-semibold transition-all duration-300 group-hover:scale-105 ${colors.title} text-sm lg:text-base`}
              >
                {title}
              </h3>
              <p
                className={`text-xs transition-colors duration-300 ${colors.description} lg:text-sm`}
              >
                {description}
              </p>
            </div>

            {/* Indicador de ação */}
            <div className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              <svg
                className={`h-4 w-4 ${colors.icon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-transform duration-300 hover:scale-[1.02]"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className="transition-transform duration-300 hover:scale-[1.02]"
    >
      {cardContent}
    </div>
  );
}
