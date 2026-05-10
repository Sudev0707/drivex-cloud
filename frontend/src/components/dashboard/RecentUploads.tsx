import { useFiles } from "@/context/FileContext";
import { FileTypeIcon } from "@/components/common/FileTypeIcon";
import { formatBytes } from "@/utils/formatBytes";
import { timeAgo } from "@/utils/formatDate";
import { Link } from "react-router-dom";
export function RecentUploads() {
  const { files } = useFiles();
  const recent = [...files]
    .filter((f) => !f.isTrashed)
    .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
    .slice(0, 6);

  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent uploads</h3>
        <Link to="/my-drive" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground">No uploads yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {recent.map((f) => (
            <li key={f.id} className="flex items-center gap-3 py-3">
              <FileTypeIcon kind={f.kind} size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{f.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(f.fileSize)} · by {f.uploadedBy}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{timeAgo(f.uploadedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
