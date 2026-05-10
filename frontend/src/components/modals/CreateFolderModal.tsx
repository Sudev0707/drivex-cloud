import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateFolderModal({ open, onClose, onCreate }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  useEffect(() => { if (!open) setName(""); }, [open]);

  const submit = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New folder"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()}>Create folder</Button>
        </>
      }
    >
      <Input
        autoFocus
        label="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Untitled folder"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
    </Modal>
  );
}
