import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { MockFolder } from "@/data/folders";
import { cn } from "@/lib/utils";

interface FolderCardProps {
  folder: MockFolder;
  fileCount?: number;
  onRename?: (f: MockFolder) => void;
  onDelete?: (f: MockFolder) => void;
  onOpen?: (f: MockFolder) => void;
}

export function FolderCard({ folder, fileCount = 0, onRename, onDelete, onOpen }: FolderCardProps) {
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
      onClick={() => onOpen?.(folder)}
      className="surface-card hover-lift p-4 flex items-center gap-3 cursor-pointer group"
    >
      <div
        className="h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: folder.color }}
      >
        <Folder className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{folder.name}</p>
        <p className="text-xs text-muted-foreground">{fileCount} {fileCount === 1 ? "item" : "items"}</p>
      </div>
      <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-opacity",
            !open && "opacity-0 group-hover:opacity-100",
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 surface-pop p-1 z-10 text-sm">
            <button
              onClick={() => { setOpen(false); onRename?.(folder); }}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted text-foreground"
            >
              <Pencil className="h-4 w-4" /> Rename
            </button>
            <button
              onClick={() => { setOpen(false); onDelete?.(folder); }}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-md hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
