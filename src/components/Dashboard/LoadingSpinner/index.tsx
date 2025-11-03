import { Dumbbell,Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  variant?: "default" | "gym" | "minimal";
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Carregando...",
  variant = "default",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerSizes = {
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-[#C2A537]`}
        />
        <span className="text-sm text-slate-400">{message}</span>
      </div>
    );
  }

  if (variant === "gym") {
    return (
      <div
        className={`flex flex-col items-center justify-center ${containerSizes[size]}`}
      >
        <div className="relative">
          {/* Círculo externo rotativo */}
          <div
            className="absolute inset-0 animate-spin rounded-full border-2 border-[#C2A537]/20"
            style={{ borderTopColor: "#C2A537" }}
          />

          {/* Ícone central */}
          <div className="relative rounded-full bg-gradient-to-br from-[#C2A537] to-[#D4B547] p-4">
            <Dumbbell
              className={`${sizeClasses[size]} animate-pulse text-black`}
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-[#C2A537]">{message}</p>
          <div className="mt-2 flex justify-center gap-1">
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-[#C2A537]"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-[#C2A537]"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-[#C2A537]"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerSizes[size]}`}
    >
      {/* Background animado */}
      <div className="relative">
        <div className="absolute inset-0 animate-pulse rounded-full bg-[#C2A537]/20 blur-xl" />
        <div className="relative rounded-full border border-[#C2A537]/30 bg-gradient-to-br from-black/60 to-black/80 p-6 backdrop-blur-sm">
          <Loader2
            className={`${sizeClasses[size]} animate-spin text-[#C2A537]`}
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-[#C2A537]">{message}</p>
        <div className="mt-2 h-1 w-32 rounded-full bg-slate-800">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-[#C2A537] to-[#D4B547]" />
        </div>
      </div>
    </div>
  );
}
