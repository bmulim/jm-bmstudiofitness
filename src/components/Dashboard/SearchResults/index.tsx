import { CheckCircle, User, XCircle } from "lucide-react";

interface Student {
  userId: string;
  name: string;
  email: string;
  isPaymentUpToDate: boolean;
}

// Tipo genérico para permitir diferentes tipos de student
interface SearchResultsProps<T = Student> {
  students: T[];
  onSelect: (student: T) => void;
  onClear: () => void;
  selectedStudentId?: string;
}

export function SearchResults<
  T extends {
    userId: string;
    name: string;
    email: string;
    isPaymentUpToDate: boolean;
  },
>({ students, onSelect, onClear, selectedStudentId }: SearchResultsProps<T>) {
  if (students.length === 0) return null;

  return (
    <div className="animate-fade-in-up mt-4">
      {/* Header dos resultados */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-[#C2A537]">
          {students.length}{" "}
          {students.length === 1
            ? "resultado encontrado"
            : "resultados encontrados"}
        </p>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 transition-colors duration-300 hover:text-[#C2A537]"
        >
          Limpar busca
        </button>
      </div>

      {/* Lista de resultados */}
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-[#C2A537]/30 bg-black/60 p-3 backdrop-blur-sm lg:max-h-80">
        {students.map((student, index) => (
          <div
            key={student.userId}
            onClick={() => {
              onSelect(student);
              onClear();
            }}
            className={`group relative cursor-pointer overflow-hidden rounded-lg border p-3 transition-all duration-300 hover:scale-102 ${
              selectedStudentId === student.userId
                ? "border-[#C2A537] bg-[#C2A537]/15 shadow-lg shadow-[#C2A537]/20"
                : "border-slate-700/50 bg-slate-800/40 hover:border-[#C2A537]/50 hover:bg-[#C2A537]/10"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2A537]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center gap-3">
              {/* Avatar com status */}
              <div className="relative">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
                    student.isPaymentUpToDate
                      ? "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30"
                  }`}
                >
                  <User className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
                </div>

                {/* Indicador de status */}
                <div className="absolute -right-1 -bottom-1">
                  {student.isPaymentUpToDate ? (
                    <CheckCircle className="h-4 w-4 text-green-400 transition-all duration-300 group-hover:scale-125" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 transition-all duration-300 group-hover:scale-125" />
                  )}
                </div>
              </div>

              {/* Informações do estudante */}
              <div className="flex-1 space-y-1">
                <p className="font-medium text-white transition-all duration-300 group-hover:text-[#C2A537]">
                  {student.name}
                </p>
                <p className="text-xs text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {student.email}
                </p>
              </div>

              {/* Status de pagamento */}
              <div className="flex flex-col items-end gap-1">
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium transition-all duration-300 ${
                    student.isPaymentUpToDate
                      ? "bg-green-500/20 text-green-400 group-hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 group-hover:bg-red-500/30"
                  }`}
                >
                  {student.isPaymentUpToDate ? "Em dia" : "Pendente"}
                </div>

                {/* Seta indicadora */}
                <div className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <svg
                    className="h-4 w-4 text-[#C2A537]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Linha de destaque */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#C2A537] to-[#D4B547] transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
