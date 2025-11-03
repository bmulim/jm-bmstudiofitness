import { DollarSign, Heart, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StudentDetailsProps {
  student: {
    name: string;
    createdAt: string;
    isPaymentUpToDate: boolean;
  };
  activeTab: "personal" | "financial" | "health";
  setActiveTab: (tab: "personal" | "financial" | "health") => void;
  children: React.ReactNode;
}

export function StudentDetails({
  student,
  activeTab,
  setActiveTab,
  children,
}: StudentDetailsProps) {
  return (
    <Card className="border-[#C2A537] bg-black/95">
      <CardHeader className="p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#C2A537] lg:text-3xl xl:text-4xl">
              {student.name}
            </CardTitle>
            <CardDescription className="text-base text-slate-300 lg:text-lg">
              Cadastrado em{" "}
              {new Date(student.createdAt).toLocaleDateString("pt-BR")}
            </CardDescription>
          </div>
          <div
            className={`rounded-full px-4 py-2 text-sm font-medium lg:px-6 lg:py-3 lg:text-base ${
              student.isPaymentUpToDate
                ? "bg-green-600 text-green-100"
                : "bg-red-600 text-red-100"
            }`}
          >
            {student.isPaymentUpToDate ? "✅ Em dia" : "❌ Atraso"}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 rounded-lg bg-slate-800 p-2 lg:space-x-3 lg:p-3">
          {[
            { id: "personal" as const, label: "Dados Pessoais", icon: User },
            { id: "financial" as const, label: "Financeiro", icon: DollarSign },
            { id: "health" as const, label: "Saúde", icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-colors lg:gap-3 lg:px-6 lg:py-4 lg:text-base ${
                activeTab === tab.id
                  ? "bg-[#C2A537] text-black"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 lg:p-8">{children}</CardContent>
    </Card>
  );
}
