import { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { DragDropZone } from "./DragDropZone";
import { Button } from "@/components/common/Button";
import { useFiles } from "@/context/FileContext";
import { formatBytes } from "@/utils/formatBytes";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  done: boolean;
}

export function UploadModal() {
  const { isUploadOpen, setUploadOpen, uploadFile } = useFiles();
  const [items, setItems] = useState<UploadItem[]>([]);

  const handleFiles = (files: File[]) => {
    const newItems = files.map((file) => ({
      id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      progress: 0,
      done: false,
    }));
    setItems((prev) => [...prev, ...newItems]);

    newItems.forEach((it) => {
      const tick = () => {
        setItems((prev) =>
          prev.map((p) => {
            if (p.id !== it.id || p.done) return p;
            const next = Math.min(100, p.progress + 8 + Math.random() * 18);
            const done = next >= 100;
            if (done) {
              const previewUrl = it.file.type.startsWith("image/")
                ? URL.createObjectURL(it.file)
                : undefined;
              uploadFile({
                name: it.file.name,
                size: it.file.size,
                type: it.file.type || "application/octet-stream",
                kind: "other",
                previewUrl,
              });
              toast.success(`Uploaded ${it.file.name}`);
            }
            return { ...p, progress: next, done };
          }),
        );
      };
      const interval = setInterval(() => {
        tick();
      }, 200);
      setTimeout(() => clearInterval(interval), 4000);
    });
  };

  const close = () => {
    setUploadOpen(false);
    setTimeout(() => setItems([]), 300);
  };

  return (
    <Modal
      open={isUploadOpen}
      onClose={close}
      title="Upload files"
      description="Drag files into the zone or click to browse."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={close}>Close</Button>
        </>
      }
    >
      <DragDropZone onFiles={handleFiles} />
      {items.length > 0 && (
        <div className="mt-5 space-y-3 max-h-72 overflow-y-auto">
          {items.map((it) => (
            <div key={it.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{it.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(it.file.size)}</p>
                </div>
                {it.done ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" /> Done
                  </span>
                ) : (
                  <button
                    onClick={() => setItems((prev) => prev.filter((p) => p.id !== it.id))}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${it.done ? "bg-success" : "bg-primary"}`}
                  style={{ width: `${it.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
