import { HardDrive, FileText, FileImage, FileVideo, FileArchive } from "lucide-react";
import { useFiles } from "@/context/FileContext";
import { useAuth } from "@/context/AuthContext";
import { formatBytes, mbToBytes } from "@/utils/formatBytes";

export function StorageCard() {
  const { files, totalUsedBytes } = useFiles();
  const { user } = useAuth();

  const limit = mbToBytes(user?.storageLimitMb ?? 2048);
  const pct = Math.min(100, Math.round((totalUsedBytes / limit) * 100));

  const groups = [
    { label: "Documents", color: "bg-blue-500", icon: FileText, kinds: ["pdf", "doc", "sheet", "slide"] },
    { label: "Images", color: "bg-pink-500", icon: FileImage, kinds: ["image"] },
    { label: "Videos", color: "bg-violet-500", icon: FileVideo, kinds: ["video", "audio"] },
    { label: "Other", color: "bg-amber-500", icon: FileArchive, kinds: ["archive", "code", "other"] },
  ];

  const breakdown = groups.map((g) => {
    const sum = files
      .filter((f) => !f.isTrashed && g.kinds.includes(f.kind))
      .reduce((s, f) => s + f.fileSize, 0);
    return { ...g, sum, pct: Math.round((sum / limit) * 100) };
  });

  return (
    <div className="surface-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <HardDrive className="h-4 w-4" /> Storage usage
          </div>
          <p className="mt-1 text-2xl font-semibold text-foreground tracking-tight">
            {formatBytes(totalUsedBytes)} <span className="text-base text-muted-foreground font-normal">/ {formatBytes(limit)}</span>
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary-soft text-accent-foreground px-2.5 py-1 text-xs font-medium">
          {user?.plan ?? "Free"} plan
        </span>
      </div>

      <div className="mt-5 h-2.5 rounded-full bg-muted overflow-hidden flex">
        {breakdown.map((b) => (
          <div key={b.label} className={b.color} style={{ width: `${b.pct}%` }} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{pct}% of your plan used</p>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {breakdown.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.label} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span className={`h-2 w-2 rounded-full ${b.color}`} />
                <Icon className="h-3.5 w-3.5" />
                {b.label}
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{formatBytes(b.sum)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
