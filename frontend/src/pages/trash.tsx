import { useMemo, useState } from "react";

import { Trash2, RotateCcw } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useFiles } from "@/context/FileContext";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { FileTypeIcon } from "@/components/common/FileTypeIcon";
import { formatBytes } from "@/utils/formatBytes";
import { timeAgo } from "@/utils/formatDate";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { toast } from "sonner";

export default function TrashPage() {
  return (
    <ProtectedRoute>
      <TrashInner />
    </ProtectedRoute>
  );
}

function TrashInner() {
  const { files, restoreFile, deleteFilePermanent } = useFiles();
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);

  const trashed = useMemo(
    () => files.filter((f) => f.isTrashed && f.fileName.toLowerCase().includes(search.toLowerCase())),
    [files, search],
  );

  return (
    <DashboardLayout search={search} onSearchChange={setSearch}>
      <div>
        <p className="text-sm text-muted-foreground">Workspace</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Trash</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Files in trash are recoverable. Permanently deleted files cannot be restored.
        </p>
      </div>

      <div className="mt-6">
        {trashed.length === 0 ? (
          <EmptyState
            icon={<Trash2 className="h-7 w-7" />}
            title="Trash is empty"
            description="Files you delete will appear here for 30 days."
          />
        ) : (
          <div className="surface-card divide-y divide-border">
            {trashed.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-4">
                <FileTypeIcon kind={f.kind} size={20} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{f.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(f.fileSize)} · removed {timeAgo(f.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    onClick={() => {
                      restoreFile(f.id);
                      toast.success(`Restored ${f.fileName}`);
                    }}
                  >
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => setTarget({ id: f.id, name: f.fileName })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={!!target}
        onClose={() => setTarget(null)}
        title="Delete permanently?"
        description={target ? `"${target.name}" will be removed forever. This can't be undone.` : undefined}
        confirmLabel="Delete forever"
        onConfirm={() => {
          if (!target) return;
          deleteFilePermanent(target.id);
          toast.success("Deleted permanently");
        }}
      />
    </DashboardLayout>
  );
}

