import { X } from "lucide-react";

interface PaymentWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  paymentInfo: {
    dueDate: number;
    lastPaymentDate: string | null;
    daysOverdue: number;
  };
}

export function PaymentWarningDialog({
  isOpen,
  onClose,
  userName,
  paymentInfo,
}: PaymentWarningDialogProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform">
        <div className="relative rounded-lg border border-red-600 bg-red-900/95 p-6 shadow-2xl backdrop-blur-sm">
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1 text-red-300 hover:bg-red-800/50 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Conteúdo */}
          <div className="text-center">
            {/* Ícone de aviso */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-800">
              <span className="text-3xl">⚠️</span>
            </div>

            {/* Título */}
            <h2 className="mb-2 text-xl font-bold text-red-100">
              Acesso Negado
            </h2>

            {/* Mensagem principal */}
            <p className="mb-4 text-red-200">
              Olá, <strong>{userName}</strong>!
              <br />
              Seu pagamento está em atraso.
            </p>

            {/* Informações de pagamento */}
            <div className="mb-6 rounded-md border border-red-700 bg-red-800/50 p-4 text-left">
              <h3 className="mb-3 font-semibold text-red-100">
                Detalhes do Pagamento:
              </h3>

              <div className="space-y-2 text-sm text-red-200">
                <div className="flex justify-between">
                  <span>Vencimento:</span>
                  <span className="font-medium">
                    Dia {paymentInfo.dueDate} de cada mês
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Último pagamento:</span>
                  <span className="font-medium">
                    {formatDate(paymentInfo.lastPaymentDate)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Dias em atraso:</span>
                  <span className="font-bold text-red-100">
                    {paymentInfo.daysOverdue}{" "}
                    {paymentInfo.daysOverdue === 1 ? "dia" : "dias"}
                  </span>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="mb-6 rounded-md border border-yellow-600 bg-yellow-900/30 p-4">
              <h3 className="mb-2 font-semibold text-yellow-100">
                📋 O que fazer:
              </h3>
              <ul className="space-y-1 text-left text-sm text-yellow-200">
                <li>• Dirija-se à recepção</li>
                <li>• Regularize seu pagamento</li>
                <li>• Após confirmação, o check-in será liberado</li>
              </ul>
            </div>

            {/* Botão de ação */}
            <button
              onClick={onClose}
              className="w-full rounded-md bg-red-600 px-4 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-900 focus:outline-none"
            >
              Entendi - Vou à Recepção
            </button>

            {/* Nota adicional */}
            <p className="mt-4 text-xs text-red-300">
              Em caso de dúvidas, procure nossa equipe na recepção.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
