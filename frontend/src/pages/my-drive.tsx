import { useMemo, useState } from "react";

import { FolderPlus, Plus, FolderOpen } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useFiles } from "@/context/FileContext";
import { FileCard } from "@/components/dashboard/FileCard";
import { FolderCard } from "@/components/dashboard/FolderCard";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { CreateFolderModal } from "@/components/modals/CreateFolderModal";
import { RenameModal } from "@/components/modals/RenameModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { PreviewModal } from "@/components/modals/PreviewModal";
import type { MockFile } from "@/data/files";
import type { MockFolder } from "@/data/folders";
import { toast } from "sonner";

export default function MyDrivePage() {
  return (
    <ProtectedRoute>
      <Inner />
    </ProtectedRoute>
  );
}

function Inner() {
  const {
    files,
    folders,
    createFolder,
    renameFile,
    renameFolder,
    trashFile,
    deleteFolder,
    toggleShare,
    setUploadOpen,
  } = useFiles();
  const [search, setSearch] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    kind: "file" | "folder";
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "file" | "folder";
    id: string;
    name: string;
  } | null>(null);
  const [previewTarget, setPreviewTarget] = useState<MockFile | null>(null);

  const visibleFiles = useMemo(() => {
    return files.filter(
      (f) => !f.isTrashed && f.fileName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [files, search]);

  const visibleFolders = useMemo(
    () => folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    [folders, search],
  );

  return (
    <DashboardLayout search={search} onSearchChange={setSearch}>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Workspace</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">My Drive</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<FolderPlus className="h-4 w-4" />} onClick={() => setFolderOpen(true)}>
            New folder
          </Button>
          <Button variant="dark" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
            Upload
          </Button>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Folders</h2>
        {visibleFolders.length === 0 ? (
          <EmptyState
            title="No folders yet"
            description="Create folders to keep your work organized."
            action={
              <Button leftIcon={<FolderPlus className="h-4 w-4" />} onClick={() => setFolderOpen(true)}>
                New folder
              </Button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                fileCount={files.filter((f) => f.folderId === folder.id && !f.isTrashed).length}
                onRename={(f: MockFolder) => setRenameTarget({ kind: "folder", id: f.id, name: f.name })}
                onDelete={(f: MockFolder) => setDeleteTarget({ kind: "folder", id: f.id, name: f.name })}
                onOpen={(f) => toast.info(`Folder "${f.name}" — preview only in this demo`)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Files</h2>
        {visibleFiles.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-7 w-7" />}
            title="No files match your search"
            description="Try a different keyword, or upload something new."
            action={<Button onClick={() => setUploadOpen(true)}>Upload files</Button>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleFiles.map((f) => (
              <FileCard
                key={f.id}
                file={f}
                onPreview={(file) => setPreviewTarget(file)}
                onRename={(file) => setRenameTarget({ kind: "file", id: file.id, name: file.fileName })}
                onDelete={(file) => setDeleteTarget({ kind: "file", id: file.id, name: file.fileName })}
                onShare={(file) => {
                  toggleShare(file.id);
                  toast.success(file.isShared ? "Stopped sharing" : "File shared");
                }}
                onDownload={(file) => toast.info(`Downloading ${file.fileName}…`)}
              />
            ))}
          </div>
        )}
      </section>

      <CreateFolderModal
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
        onCreate={(name) => {
          createFolder(name);
          toast.success(`Created folder "${name}"`);
        }}
      />
      <RenameModal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        initialName={renameTarget?.name ?? ""}
        onRename={(name) => {
          if (!renameTarget) return;
          if (renameTarget.kind === "file") renameFile(renameTarget.id, name);
          else renameFolder(renameTarget.id, name);
          toast.success("Renamed");
        }}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={deleteTarget?.kind === "folder" ? "Delete this folder?" : "Move to trash?"}
        description={
          deleteTarget?.kind === "folder"
            ? `"${deleteTarget?.name}" will be permanently removed. Files inside it will move to your drive root.`
            : `"${deleteTarget?.name}" will be moved to Trash. You can restore it from there.`
        }
        confirmLabel={deleteTarget?.kind === "folder" ? "Delete folder" : "Move to trash"}
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.kind === "folder") {
            deleteFolder(deleteTarget.id);
            toast.success("Folder deleted");
          } else {
            trashFile(deleteTarget.id);
            toast.success("Moved to trash");
          }
        }}
      />
      <PreviewModal
        file={previewTarget}
        onClose={() => setPreviewTarget(null)}
        onShare={(file) => {
          toggleShare(file.id);
          toast.success(file.isShared ? "Stopped sharing" : "File shared");
        }}
        onDownload={(file) => toast.info(`Downloading ${file.fileName}…`)}
      />
    </DashboardLayout>
  );
}

