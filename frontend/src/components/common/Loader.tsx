import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-muted-foreground", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="surface-card p-4 animate-pulse">
      <div className="h-24 rounded-md bg-muted" />
      <div className="mt-3 h-3 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
    </div>
  );
}
