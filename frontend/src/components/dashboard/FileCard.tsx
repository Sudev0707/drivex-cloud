import { useState, useRef, useEffect } from "react";
import { MoreVertical, Download, Pencil, Share2, Trash2, Eye, Star } from "lucide-react";
import type { MockFile } from "@/data/files";
import { FileTypeIcon } from "@/components/common/FileTypeIcon";
import { formatBytes } from "@/utils/formatBytes";
import { timeAgo } from "@/utils/formatDate";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: MockFile;
  onPreview?: (f: MockFile) => void;
  onRename?: (f: MockFile) => void;
  onDelete?: (f: MockFile) => void;
  onShare?: (f: MockFile) => void;
  onDownload?: (f: MockFile) => void;
}

export function FileCard({ file, onPreview, onRename, onDelete, onShare, onDownload }: FileCardProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div
      className="surface-card hover-lift overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => onPreview?.(file)}
    >
      <div className="relative h-32 bg-secondary flex items-center justify-center overflow-hidden">
        {file.previewUrl ? (
          <img
            src={file.previewUrl}
            alt={file.fileName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <FileTypeIcon kind={file.kind} size={32} />
        )}
        {file.isShared && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-card/90 backdrop-blur px-2 py-0.5 text-xs font-medium text-foreground border border-border">
            <Share2 className="h-3 w-3" /> Shared
          </span>
        )}
        <div className="absolute top-2 right-2" ref={ref} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "h-8 w-8 inline-flex items-center justify-center rounded-md bg-card/90 backdrop-blur border border-border text-muted-foreground hover:text-foreground transition-opacity",
              !open && "opacity-0 group-hover:opacity-100",
            )}
            aria-label="More"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 surface-pop p-1 z-10 text-sm">
              <MenuItem icon={Eye} label="Preview" onClick={() => { setOpen(false); onPreview?.(file); }} />
              <MenuItem icon={Download} label="Download" onClick={() => { setOpen(false); onDownload?.(file); }} />
              <MenuItem icon={Share2} label={file.isShared ? "Unshare" : "Share"} onClick={() => { setOpen(false); onShare?.(file); }} />
              <MenuItem icon={Pencil} label="Rename" onClick={() => { setOpen(false); onRename?.(file); }} />
              <div className="my-1 h-px bg-border" />
              <MenuItem icon={Trash2} label="Delete" destructive onClick={() => { setOpen(false); onDelete?.(file); }} />
            </div>
          )}
        </div>
      </div>
      <div className="p-3 flex items-start gap-3">
        <FileTypeIcon kind={file.kind} size={18} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{file.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.fileSize)} · {timeAgo(file.uploadedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted text-foreground",
        destructive && "text-destructive hover:bg-destructive/10",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
