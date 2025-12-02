import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login de Aluno",
  description:
    "Acesse sua área do aluno no JM Fitness Studio. Veja seu histórico de check-ins, dados de saúde e informações de pagamento.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
