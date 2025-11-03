import { User } from "lucide-react";

interface SelectedStudentProps {
  student: {
    userId: string;
    name: string;
    email: string;
    isPaymentUpToDate: boolean;
  };
  onClear: () => void;
}

export function SelectedStudent({ student, onClear }: SelectedStudentProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-[#C2A537] bg-[#C2A537]/20 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            student.isPaymentUpToDate ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-[#C2A537] lg:text-lg">{student.name}</p>
          <p className="text-sm text-slate-300">{student.email}</p>
        </div>
      </div>
      <button
        onClick={onClear}
        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
      >
        Limpar
      </button>
    </div>
  );
}
