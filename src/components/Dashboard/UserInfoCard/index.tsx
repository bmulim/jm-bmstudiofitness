import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoCardProps {
  title: string;
  data: Array<{
    label: string;
    value: string;
    className?: string;
  }>;
  icon?: React.ComponentType<{ className?: string }>;
}

export function UserInfoCard({ title, data, icon: Icon }: UserInfoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* Background animado com múltiplas camadas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C2A537]/10 via-black/90 to-black/95" />
      <div className="absolute inset-0 bg-gradient-to-tl from-[#D4B547]/5 via-transparent to-[#C2A537]/5" />

      {/* Efeito de brilho dinâmico */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2A537]/5 to-transparent opacity-0 transition-all duration-700 group-hover:animate-pulse group-hover:opacity-100" />

      {/* Partículas decorativas */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-3 right-3 h-1 w-1 animate-ping rounded-full bg-[#C2A537]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-4 left-4 h-0.5 w-0.5 animate-ping rounded-full bg-[#D4B547]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Card className="relative border-[#C2A537]/40 bg-black/60 shadow-lg shadow-[#C2A537]/10 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-[#C2A537]/60 hover:shadow-xl hover:shadow-[#C2A537]/20">
        <CardHeader className="relative pb-3">
          {/* Header com gradiente */}
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="rounded-full bg-[#C2A537]/20 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C2A537]/30">
                <Icon className="h-5 w-5 text-[#C2A537] transition-transform duration-300 group-hover:rotate-12" />
              </div>
            )}
            <CardTitle className="bg-gradient-to-r from-[#C2A537] to-[#D4B547] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
              {title}
            </CardTitle>
          </div>

          {/* Linha decorativa animada */}
          <div className="mt-2 h-px bg-gradient-to-r from-[#C2A537]/50 via-[#D4B547]/30 to-transparent transition-all duration-500 group-hover:from-[#C2A537] group-hover:via-[#D4B547]/60" />
        </CardHeader>

        <CardContent className="relative space-y-4 pt-0">
          {data.map((item, index) => (
            <div
              key={index}
              className="group/item relative overflow-hidden rounded-md p-2 transition-all duration-300 hover:scale-102 hover:bg-[#C2A537]/5"
            >
              {/* Background do item */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2A537]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />

              <div className="relative flex flex-col gap-1">
                {/* Label com animação */}
                <p className="text-xs font-medium text-slate-400 transition-all duration-300 group-hover/item:text-[#C2A537]/80 lg:text-sm">
                  {item.label}
                </p>

                {/* Valor com efeito hover */}
                <p
                  className={`font-medium transition-all duration-300 group-hover/item:scale-105 ${
                    item.className ||
                    "text-white group-hover/item:text-slate-100"
                  } text-sm lg:text-base`}
                >
                  {item.value}
                </p>
              </div>

              {/* Indicador lateral */}
              <div className="absolute top-1/2 left-0 h-0 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#C2A537] to-[#D4B547] transition-all duration-300 group-hover/item:h-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
