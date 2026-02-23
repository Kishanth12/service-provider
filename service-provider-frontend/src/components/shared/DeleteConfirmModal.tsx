import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete Item",
  description,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const defaultDescription = itemName
    ? `Are you sure you want to delete ${itemName}? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 dark:border-slate-800/60 dark:bg-slate-950/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient top line */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-600" />

        {/* Icon */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {description || defaultDescription}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl"
          >
            {cancelText}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl shadow-sm hover:shadow-md transition"
          >
            {isDeleting ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
