import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "orange" | "purple" | "yellow";
  href?: string;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    border: "border-blue-600",
    bg: "bg-blue-900/30",
    icon: "text-blue-400",
    title: "text-blue-400",
    subtitle: "text-blue-300",
  },
  green: {
    border: "border-green-600",
    bg: "bg-green-900/30",
    icon: "text-green-400",
    title: "text-green-400",
    subtitle: "text-green-300",
  },
  red: {
    border: "border-red-600",
    bg: "bg-red-900/30",
    icon: "text-red-400",
    title: "text-red-400",
    subtitle: "text-red-300",
  },
  orange: {
    border: "border-orange-600",
    bg: "bg-orange-900/30",
    icon: "text-orange-400",
    title: "text-orange-400",
    subtitle: "text-orange-300",
  },
  purple: {
    border: "border-purple-600",
    bg: "bg-purple-900/30",
    icon: "text-purple-400",
    title: "text-purple-400",
    subtitle: "text-purple-300",
  },
  yellow: {
    border: "border-yellow-600",
    bg: "bg-yellow-900/30",
    icon: "text-yellow-400",
    title: "text-yellow-400",
    subtitle: "text-yellow-300",
  },
};

export function NavigationCard({
  title,
  description,
  icon: Icon,
  color,
  href,
  onClick,
}: NavigationCardProps) {
  const colors = colorClasses[color];

  const content = (
    <Card
      className={`${colors.border} ${colors.bg} ${href || onClick ? "cursor-pointer" : ""} transition-transform hover:scale-105`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Icon className={`h-10 w-10 ${colors.icon}`} />
          <div>
            <h3 className={`font-semibold ${colors.title}`}>{title}</h3>
            <p className={`text-sm ${colors.subtitle}`}>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
}
