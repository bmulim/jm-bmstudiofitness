"use client";

import { AdminMenu } from "@/components/Admin/AdminMenu";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/card";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <div className="min-h-screen px-2 py-8">
        <div className="mx-auto max-w-screen">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Menu lateral */}
            <div className="lg:col-span-1">
              <Card className="border-[#C2A537] bg-black/95 p-6">
                <AdminMenu />
              </Card>
            </div>

            {/* Conteúdo principal */}
            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
