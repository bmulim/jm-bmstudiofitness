import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de Espera",
  description:
    "Entre na lista de espera do JM Fitness Studio e garanta sua vaga nas próximas turmas. Cadastre-se agora e receba prioridade para matrículas!",
  openGraph: {
    title: "Lista de Espera | JM Fitness Studio",
    description:
      "Ainda dá tempo! Entre na lista de espera e garanta sua vaga. Logo abriremos novas turmas e entraremos em contato.",
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
