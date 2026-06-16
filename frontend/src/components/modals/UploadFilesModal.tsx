import { useEffect, useState } from "react";
import { Modal } from "@/components/common/Modal";
import { DragDropZone } from "@/components/upload/DragDropZone";
import { Button } from "@/components/common/Button";
import { useFiles } from "@/context/FileContext";
import { formatBytes } from "@/utils/formatBytes";
import { CheckCircle2, Folder, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  done: boolean;
  error?: string;
}

interface UploadFilesModalProps {
  open?: boolean;
  onClose?: () => void;
  defaultFolderId?: string | null;
}

export function UploadFilesModal({ open, onClose, defaultFolderId = null }: UploadFilesModalProps) {
  const { isUploadOpen, setUploadOpen, uploadFiles, folders } = useFiles();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [folderId, setFolderId] = useState<string | null>(defaultFolderId);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : isUploadOpen;

  useEffect(() => {
    if (isOpen) setFolderId(defaultFolderId);
  }, [isOpen, defaultFolderId]);

  const close = () => {
    if (items.some((it) => !it.done && !it.error)) return;
    if (isControlled) onClose?.();
    else setUploadOpen(false);
    setTimeout(() => setItems([]), 300);
  };

  const handleFiles = (files: File[]) => {
    const newItems: UploadItem[] = files.map((file) => ({
      id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      progress: 0,
      done: false,
    }));
    setItems((prev) => [...prev, ...newItems]);

    newItems.forEach(async (item) => {
      try {
        await uploadFiles([item.file], folderId, (_itemId, percent) => {
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, progress: percent } : p)),
          );
        });
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, progress: 100, done: true } : p)),
        );
        toast.success(`Uploaded ${item.file.name}`);
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Upload failed";
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, error: message } : p)),
        );
        toast.error(message);
      }
    });
  };

  const uploading = items.some((it) => !it.done && !it.error);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title="Upload files"
      description="Drag files into the zone or click to browse."
      size="lg"
      footer={
        <Button variant="ghost" onClick={close} disabled={uploading}>
          {uploading ? "Uploading…" : "Close"}
        </Button>
      }
    >
      {folders.length > 0 && (
        <div className="mb-4">
          <label htmlFor="upload-folder" className="block text-sm font-medium text-foreground mb-1.5">
            Destination folder
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              id="upload-folder"
              value={folderId ?? ""}
              onChange={(e) => setFolderId(e.target.value || null)}
              disabled={uploading}
              className={cn(
                "w-full h-10 rounded-lg border border-input bg-card pl-10 pr-3 text-sm text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <option value="">My Drive (root)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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
                ) : it.error ? (
                  <span className="text-xs font-medium text-destructive">{it.error}</span>
                ) : (
                  <button
                    onClick={() => setItems((prev) => prev.filter((p) => p.id !== it.id))}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${it.done ? "bg-success" : it.error ? "bg-destructive" : "bg-primary"}`}
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
