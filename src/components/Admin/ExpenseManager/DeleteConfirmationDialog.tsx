import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-slate-700 bg-slate-800">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2 text-center sm:text-left">
            <AlertDialogTitle className="text-slate-200">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Tem certeza que deseja excluir esta despesa? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <AlertDialogCancel className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-slate-200">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-900/30 text-red-400 hover:bg-red-900/50"
            >
              Excluir
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
