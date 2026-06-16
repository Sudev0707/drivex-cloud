export type FileKind = "image" | "video" | "audio" | "pdf" | "doc" | "sheet" | "slide" | "archive" | "code" | "other";

export interface MockFile {
  id: string;
  fileName: string;
  fileType: string; // mime-ish, e.g. "image/png"
  kind: FileKind;
  fileSize: number; // bytes
  uploadedAt: string; // ISO
  uploadedBy: string;
  folderId: string | null;
  isTrashed: boolean;
  isShared?: boolean;
  previewUrl?: string;
}

export const mockFiles: MockFile[] = [];
