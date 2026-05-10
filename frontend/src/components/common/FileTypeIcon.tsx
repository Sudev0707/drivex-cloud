import type { FileKind } from "@/data/files";
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Presentation,
  File as FileIcon,
} from "lucide-react";

const map: Record<FileKind, { icon: React.ElementType; bg: string; fg: string; label: string }> = {
  image: { icon: FileImage, bg: "bg-pink-100", fg: "text-pink-600", label: "Image" },
  video: { icon: FileVideo, bg: "bg-violet-100", fg: "text-violet-600", label: "Video" },
  audio: { icon: FileAudio, bg: "bg-amber-100", fg: "text-amber-600", label: "Audio" },
  pdf: { icon: FileText, bg: "bg-red-100", fg: "text-red-600", label: "PDF" },
  doc: { icon: FileText, bg: "bg-blue-100", fg: "text-blue-600", label: "Doc" },
  sheet: { icon: FileSpreadsheet, bg: "bg-emerald-100", fg: "text-emerald-600", label: "Sheet" },
  slide: { icon: Presentation, bg: "bg-orange-100", fg: "text-orange-600", label: "Slides" },
  archive: { icon: FileArchive, bg: "bg-yellow-100", fg: "text-yellow-700", label: "Archive" },
  code: { icon: FileCode, bg: "bg-slate-100", fg: "text-slate-700", label: "Code" },
  other: { icon: FileIcon, bg: "bg-slate-100", fg: "text-slate-600", label: "File" },
};

export function FileTypeIcon({ kind, size = 24 }: { kind: FileKind; size?: number }) {
  const m = map[kind] ?? map.other;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center justify-center rounded-lg ${m.bg} ${m.fg}`} style={{ width: size + 16, height: size + 16 }}>
      <Icon style={{ width: size, height: size }} />
    </span>
  );
}

export function fileKindMeta(kind: FileKind) {
  return map[kind] ?? map.other;
}
