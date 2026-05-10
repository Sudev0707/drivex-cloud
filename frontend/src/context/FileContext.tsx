import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockFiles, type MockFile, type FileKind } from "@/data/files";
import { mockFolders, type MockFolder } from "@/data/folders";

interface FileContextValue {
  files: MockFile[];
  folders: MockFolder[];
  isUploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  uploadFile: (input: { name: string; size: number; type: string; kind: FileKind; previewUrl?: string }) => MockFile;
  createFolder: (name: string) => MockFolder;
  renameFile: (id: string, name: string) => void;
  renameFolder: (id: string, name: string) => void;
  trashFile: (id: string) => void;
  restoreFile: (id: string) => void;
  deleteFilePermanent: (id: string) => void;
  deleteFolder: (id: string) => void;
  toggleShare: (id: string) => void;
  totalUsedBytes: number;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

function detectKind(type: string, name: string): FileKind {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "pdf";
  if (/(zip|rar|7z|tar|gz)$/i.test(name)) return "archive";
  if (/\.(docx?|odt|rtf)$/i.test(name)) return "doc";
  if (/\.(xlsx?|csv|ods)$/i.test(name)) return "sheet";
  if (/\.(pptx?|key|odp)$/i.test(name)) return "slide";
  if (/\.(js|ts|tsx|jsx|py|rb|go|rs|java|cpp|c|json|md)$/i.test(name)) return "code";
  return "other";
}

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<MockFile[]>(mockFiles);
  const [folders, setFolders] = useState<MockFolder[]>(mockFolders);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const uploadFile: FileContextValue["uploadFile"] = (input) => {
    const file: MockFile = {
      id: `fi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fileName: input.name,
      fileType: input.type || "application/octet-stream",
      kind: input.kind ?? detectKind(input.type, input.name),
      fileSize: input.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "You",
      folderId: null,
      isTrashed: false,
      previewUrl: input.previewUrl,
    };
    setFiles((prev) => [file, ...prev]);
    return file;
  };

  const createFolder: FileContextValue["createFolder"] = (name) => {
    const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
    const folder: MockFolder = {
      id: `f-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      color: palette[Math.floor(Math.random() * palette.length)],
    };
    setFolders((prev) => [folder, ...prev]);
    return folder;
  };

  const renameFile = (id: string, name: string) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, fileName: name } : f)));

  const renameFolder = (id: string, name: string) =>
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));

  const trashFile = (id: string) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isTrashed: true } : f)));

  const restoreFile = (id: string) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isTrashed: false } : f)));

  const deleteFilePermanent = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setFiles((prev) => prev.map((f) => (f.folderId === id ? { ...f, folderId: null } : f)));
  };

  const toggleShare = (id: string) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isShared: !f.isShared } : f)));

  const totalUsedBytes = useMemo(
    () => files.filter((f) => !f.isTrashed).reduce((s, f) => s + f.fileSize, 0),
    [files],
  );

  return (
    <FileContext.Provider
      value={{
        files,
        folders,
        isUploadOpen,
        setUploadOpen,
        isSidebarOpen,
        setSidebarOpen,
        uploadFile,
        createFolder,
        renameFile,
        renameFolder,
        trashFile,
        restoreFile,
        deleteFilePermanent,
        deleteFolder,
        toggleShare,
        totalUsedBytes,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFiles must be used within FileProvider");
  return ctx;
}
