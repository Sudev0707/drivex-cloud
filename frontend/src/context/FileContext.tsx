import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { type MockFile } from "@/data/files";
import { type MockFolder } from "@/data/folders";
import { useAuth } from "@/context/AuthContext";
import { fileService } from "@/services/fileService";
import { folderService } from "@/services/folderService";

interface FileContextValue {
  files: MockFile[];
  folders: MockFolder[];
  loading: boolean;
  isUploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
  uploadFiles: (
    files: File[],
    folderId?: string | null,
    onProgress?: (itemId: string, percent: number) => void,
  ) => Promise<MockFile[]>;
  createFolder: (name: string) => Promise<MockFolder>;
  renameFile: (id: string, name: string) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
  trashFile: (id: string) => Promise<void>;
  restoreFile: (id: string) => Promise<void>;
  deleteFilePermanent: (id: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  toggleShare: (id: string) => Promise<void>;
  totalUsedBytes: number;
}

const FileContext = createContext<FileContextValue | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [files, setFiles] = useState<MockFile[]>([]);
  const [folders, setFolders] = useState<MockFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const refresh = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setFiles([]);
      setFolders([]);
      return;
    }

    setLoading(true);
    try {
      const [nextFiles, nextFolders] = await Promise.all([
        fileService.list(),
        folderService.list(),
      ]);
      setFiles(nextFiles);
      setFolders(nextFolders);
    } catch (error) {
      console.error("Failed to load drive data:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load your drive";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadFiles: FileContextValue["uploadFiles"] = async (fileList, folderId = null, onProgress) => {
    const uploaded: MockFile[] = [];

    for (const [index, file] of fileList.entries()) {
      const itemId = `upload-${index}-${file.name}`;
      const saved = await fileService.upload(file, folderId, (percent) => onProgress?.(itemId, percent));
      uploaded.push(saved);
      setFiles((prev) => [saved, ...prev.filter((f) => f.id !== saved.id)]);
    }

    return uploaded;
  };

  const createFolder: FileContextValue["createFolder"] = async (name) => {
    const folder = await folderService.create(name);
    setFolders((prev) => [folder, ...prev]);
    return folder;
  };

  const renameFile = async (id: string, name: string) => {
    const updated = await fileService.rename(id, name);
    setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const renameFolder = async (id: string, name: string) => {
    const updated = await folderService.rename(id, name);
    setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const trashFile = async (id: string) => {
    const updated = await fileService.trash(id);
    setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const restoreFile = async (id: string) => {
    const updated = await fileService.restore(id);
    setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const deleteFilePermanent = async (id: string) => {
    await fileService.remove(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const deleteFolder = async (id: string) => {
    await folderService.remove(id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setFiles((prev) => prev.map((f) => (f.folderId === id ? { ...f, folderId: null } : f)));
  };

  const toggleShare = async (id: string) => {
    const updated = await fileService.toggleShare(id);
    setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const totalUsedBytes = useMemo(
    () => files.filter((f) => !f.isTrashed).reduce((s, f) => s + f.fileSize, 0),
    [files],
  );

  return (
    <FileContext.Provider
      value={{
        files,
        folders,
        loading,
        isUploadOpen,
        setUploadOpen,
        isSidebarOpen,
        setSidebarOpen,
        refresh,
        uploadFiles,
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
