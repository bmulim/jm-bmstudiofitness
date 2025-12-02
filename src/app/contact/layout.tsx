import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fale Conosco",
  description:
    "Entre em contato com o JM Fitness Studio. Tire suas dúvidas, conheça nossos planos e agende uma visita. Estamos em Duque de Caxias - RJ. Telefone: (21) 98099-5749",
  openGraph: {
    title: "Fale Conosco | JM Fitness Studio",
    description:
      "Entre em contato conosco e tire todas as suas dúvidas sobre nossos serviços e planos. Estamos prontos para ajudar você a cuidar da sua saúde e bem-estar!",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
