import { useMemo, useState } from "react";

import { Share2, Download, Eye } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useFiles } from "@/context/FileContext";
import { mockSharedFiles } from "@/data/sharedFiles";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { FileTypeIcon } from "@/components/common/FileTypeIcon";
import { formatBytes } from "@/utils/formatBytes";
import { timeAgo } from "@/utils/formatDate";
import { PreviewModal } from "@/components/modals/PreviewModal";
import type { MockFile } from "@/data/files";
import { toast } from "sonner";

export default function SharedPage() {
  return (
    <ProtectedRoute>
      <SharedInner />
    </ProtectedRoute>
  );
}

function SharedInner() {
  const { files } = useFiles();
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<MockFile | null>(null);

  const items = useMemo(() => {
    const myShared = files
      .filter((f) => f.isShared && !f.isTrashed)
      .map((f) => ({ ...f, sharedBy: "You", sharedAt: f.uploadedAt }));

    return [...myShared, ...mockSharedFiles].filter((f: any) =>
      f.fileName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [files, search]);

  return (
    <DashboardLayout search={search} onSearchChange={setSearch}>
      <div>
        <p className="text-sm text-muted-foreground">Workspace</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Shared with me</h1>
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            icon={<Share2 className="h-7 w-7" />}
            title="Nothing shared yet"
            description="Files shared with you will show up here."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((f: any) => (
              <div key={f.id + f.sharedAt} className="surface-card p-4 hover-lift">
                <div className="flex items-start gap-3">
                  <FileTypeIcon kind={f.kind} size={22} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{f.fileName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Shared by {f.sharedBy} · {timeAgo(f.sharedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatBytes(f.fileSize)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                    onClick={() => setPreview(f)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<Download className="h-3.5 w-3.5" />}
                    onClick={() => toast.info(`Downloading ${f.fileName}…`)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PreviewModal
        file={preview}
        onClose={() => setPreview(null)}
        onDownload={(file) => toast.info(`Downloading ${file.fileName}…`)}
        onShare={(file) => {
          // shared demo: no-op
          toast.info(`Sharing ${file.fileName} (demo)`);
        }}
      />
    </DashboardLayout>
  );
}

