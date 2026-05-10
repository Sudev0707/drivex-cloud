import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface RenameModalProps {
  open: boolean;
  onClose: () => void;
  initialName: string;
  onRename: (name: string) => void;
  label?: string;
}

export function RenameModal({ open, onClose, initialName, onRename, label = "New name" }: RenameModalProps) {
  const [name, setName] = useState(initialName);
  useEffect(() => { setName(initialName); }, [initialName, open]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onRename(trimmed);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rename"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()}>Rename</Button>
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
