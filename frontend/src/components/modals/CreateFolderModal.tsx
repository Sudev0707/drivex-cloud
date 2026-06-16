import { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void | Promise<void>;
}

export function CreateFolderModal({ open, onClose, onCreate }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (!open) setName(""); }, [open]);

  const submit = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onCreate(name.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New folder"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="dark" onClick={submit} disabled={!name.trim() || saving}>
            {saving ? "Creating…" : "Create folder"}
          </Button>
        </>
      }
    >
      <Input
        autoFocus
        label="Folder name"
        leftIcon={<Folder className="h-4 w-4" />}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Untitled folder"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
    </Modal>
  );
}
