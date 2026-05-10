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

export const mockFiles: MockFile[] = [
  {
    id: "fi-1",
    fileName: "Brand-guidelines.pdf",
    fileType: "application/pdf",
    kind: "pdf",
    fileSize: 2_540_000,
    uploadedAt: "2025-05-06T10:14:00Z",
    uploadedBy: "Alex Morgan",
    folderId: "f-1",
    isTrashed: false,
    previewUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=70",
  },
  {
    id: "fi-2",
    fileName: "Hero-shot.png",
    fileType: "image/png",
    kind: "image",
    fileSize: 4_120_000,
    uploadedAt: "2025-05-07T08:42:00Z",
    uploadedBy: "Alex Morgan",
    folderId: "f-2",
    isTrashed: false,
    isShared: true,
    previewUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=70",
  },
  {
    id: "fi-3",
    fileName: "Q2-roadmap.docx",
    fileType: "application/msword",
    kind: "doc",
    fileSize: 320_000,
    uploadedAt: "2025-05-05T15:00:00Z",
    uploadedBy: "Alex Morgan",
    folderId: "f-3",
    isTrashed: false,
  },
  {
    id: "fi-4",
    fileName: "Sales-2025.xlsx",
    fileType: "application/vnd.ms-excel",
    kind: "sheet",
    fileSize: 880_000,
    uploadedAt: "2025-05-04T13:10:00Z",
    uploadedBy: "Alex Morgan",
    folderId: "f-3",
    isTrashed: false,
    isShared: true,
  },
  {
    id: "fi-5",
    fileName: "Pitch-deck.pptx",
    fileType: "application/vnd.ms-powerpoint",
    kind: "slide",
    fileSize: 6_750_000,
    uploadedAt: "2025-05-03T19:25:00Z",
    uploadedBy: "Alex Morgan",
    folderId: null,
    isTrashed: false,
  },
  {
    id: "fi-6",
    fileName: "Team-offsite.mp4",
    fileType: "video/mp4",
    kind: "video",
    fileSize: 124_000_000,
    uploadedAt: "2025-04-29T20:50:00Z",
    uploadedBy: "Alex Morgan",
    folderId: "f-2",
    isTrashed: false,
    previewUrl: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=70",
  },
  {
    id: "fi-7",
    fileName: "old-report.pdf",
    fileType: "application/pdf",
    kind: "pdf",
    fileSize: 1_120_000,
    uploadedAt: "2025-03-12T11:00:00Z",
    uploadedBy: "Alex Morgan",
    folderId: "f-1",
    isTrashed: true,
  },
  {
    id: "fi-8",
    fileName: "logo-archive.zip",
    fileType: "application/zip",
    kind: "archive",
    fileSize: 18_400_000,
    uploadedAt: "2025-04-22T09:30:00Z",
    uploadedBy: "Alex Morgan",
    folderId: null,
    isTrashed: false,
  },
];
