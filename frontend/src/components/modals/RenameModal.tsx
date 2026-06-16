import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface RenameModalProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
  onRename: (name: string) => void | Promise<void>;
  label?: string;
}

export function RenameModal({ open, onClose, initialName, onRename, label = "New name" }: RenameModalProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setName(initialName); }, [initialName, open]);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      await onRename(trimmed);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rename"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim() || saving}>
            {saving ? "Saving…" : "Rename"}
          </Button>
        </>
      }
    >
      <Input
        autoFocus
        label={label}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
    </Modal>
  );
}
