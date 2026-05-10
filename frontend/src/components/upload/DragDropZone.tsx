import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragDropZoneProps {
  onFiles: (files: File[]) => void;
  className?: string;
}

export function DragDropZone({ onFiles, className }: DragDropZoneProps) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(Array.from(list));
    },
    [onFiles],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors bg-secondary/40",
        over ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50 hover:bg-secondary",
        className,
      )}
    >
      <div className="mx-auto h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">
        Drop files here, or <span className="text-primary">browse</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Any file type, up to 100MB each (demo)</p>
      <input ref={inputRef} type="file" multiple onChange={onChange} className="hidden" />
    </div>
  );
}
