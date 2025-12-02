import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossos Planos e Serviços",
  description:
    "Conheça os planos do JM Fitness Studio: treinos personalizados, acompanhamento profissional, funcional e muito mais. Escolha o melhor plano para sua saúde e bem-estar!",
  openGraph: {
    title: "Nossos Planos e Serviços | JM Fitness Studio",
    description:
      "Descubra a variedade de planos e serviços que oferecemos para transformar sua jornada de saúde e bem-estar em uma experiência única e personalizada.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
