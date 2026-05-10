import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Download, Share2 } from "lucide-react";
import type { MockFile } from "@/data/files";
import { FileTypeIcon, fileKindMeta } from "@/components/common/FileTypeIcon";
import { formatBytes } from "@/utils/formatBytes";
import { formatDate } from "@/utils/formatDate";

interface PreviewModalProps {
  file: MockFile | null;
  onClose: () => void;
  onDownload?: (f: MockFile) => void;
  onShare?: (f: MockFile) => void;
}

export function PreviewModal({ file, onClose, onDownload, onShare }: PreviewModalProps) {
  if (!file) return null;
  const meta = fileKindMeta(file.kind);

  return (
    <Modal
      open={!!file}
      onClose={onClose}
      title={file.fileName}
      description={`${meta.label} · ${formatBytes(file.fileSize)} · uploaded ${formatDate(file.uploadedAt)}`}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {onShare && (
            <Button variant="outline" leftIcon={<Share2 className="h-4 w-4" />} onClick={() => onShare(file)}>
              {file.isShared ? "Unshare" : "Share"}
            </Button>
          )}
          {onDownload && (
            <Button leftIcon={<Download className="h-4 w-4" />} onClick={() => onDownload(file)}>
              Download
            </Button>
          )}
        </>
      }
    >
      <div className="rounded-lg border border-border bg-secondary/40 min-h-[260px] flex items-center justify-center p-6 overflow-hidden">
        {file.previewUrl ? (
          <img src={file.previewUrl} alt={file.fileName} className="max-h-[60vh] w-auto rounded-md" />
        ) : (
          <div className="flex flex-col items-center text-center">
            <FileTypeIcon kind={file.kind} size={48} />
            <p className="mt-3 text-sm text-muted-foreground">No preview available for this file type.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
