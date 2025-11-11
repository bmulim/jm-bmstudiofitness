import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Administrador | JM Fitness Studio",
  description: "Criar novo usuário administrador",
};

export default function CreateAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900">
      {children}
    </div>
  );
}
