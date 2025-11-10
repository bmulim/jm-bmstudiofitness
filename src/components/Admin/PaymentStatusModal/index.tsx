"use client";

/* eslint-disable simple-import-sort/imports */

import { Download } from "lucide-react";
import { StudentPaymentData } from "@/actions/admin/get-students-payments-action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/payment-utils";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  students: StudentPaymentData[];
  type: "paid" | "pending";
}

export function PaymentStatusModal({
  isOpen,
  onClose,
  title,
  students,
  type,
}: PaymentStatusModalProps) {
  const generatePDF = async () => {
    const reportModule = await import("@/lib/generate-payment-report");
    reportModule.generatePaymentReport(students, type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-slate-900 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">
              Total de alunos: {students.length}
            </p>
            <Button
              onClick={generatePDF}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-[#C2A537] text-[#C2A537] hover:bg-[#C2A537] hover:text-white"
            >
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>

          <div className="divide-y divide-slate-700">
            {students.map((student) => (
              <div key={student.userId} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-white">{student.name}</p>
                    <p className="text-sm text-slate-400">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        type === "paid"
                          ? "font-medium text-green-400"
                          : "font-medium text-red-400"
                      }
                    >
                      {formatCurrency(student.monthlyFeeValueInCents / 100)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Vencimento: Dia {student.dueDate}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p className="text-slate-400">
                    Último pagamento:{" "}
                    {student.lastPaymentDate
                      ? new Date(student.lastPaymentDate).toLocaleDateString(
                          "pt-BR",
                        )
                      : "Nunca"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
