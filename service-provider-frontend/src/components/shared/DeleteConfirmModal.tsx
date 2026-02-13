import { Button } from "@/components/ui/button";

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">
          {description || defaultDescription}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
