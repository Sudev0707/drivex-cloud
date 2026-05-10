import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Share2,
  Trash2,
  User,
  Settings,
  HardDrive,
  X,
} from "lucide-react";
import { useFiles } from "@/context/FileContext";
import { useAuth } from "@/context/AuthContext";
import { formatBytes, mbToBytes } from "@/utils/formatBytes";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/my-drive", label: "My Drive", icon: FolderOpen },
  { to: "/shared", label: "Shared", icon: Share2 },
  { to: "/trash", label: "Trash", icon: Trash2 },
] as const;

const accountItems = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen, totalUsedBytes } = useFiles();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const limitBytes = mbToBytes(user?.storageLimitMb ?? 2048);
  const pct = Math.min(100, Math.round((totalUsedBytes / limitBytes) * 100));

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm md:hidden transition-opacity",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={cn(
          "fixed md:sticky top-0 z-40 md:z-0 h-screen md:h-[100dvh] w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground inline-flex items-center justify-center font-bold">D</span>
            <span className="font-semibold text-foreground tracking-tight">DriveX <span className="text-muted-foreground font-normal">Lite</span></span>
          </Link>
          <button
            className="md:hidden rounded-md p-1 hover:bg-muted"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>
          {items.map((it) => {
            const active = currentPath === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-muted hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}

          <p className="mt-4 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</p>
          {accountItems.map((it) => {
            const active = currentPath === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-muted hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 p-4 rounded-xl border border-sidebar-border bg-secondary/60">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Storage</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatBytes(totalUsedBytes)} of {formatBytes(limitBytes)} used
          </p>
        </div>
      </aside>
    </>
  );
}