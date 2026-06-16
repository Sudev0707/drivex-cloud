import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete this item?",
  description = "This action can't be undone.",
  confirmLabel = "Delete",
}: DeleteConfirmModalProps) {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={saving}
          >
            {saving ? "Working…" : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground pt-2">{description}</p>
      </div>
    </Modal>
  );
}
