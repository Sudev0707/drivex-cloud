import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-lg bg-primary text-primary-foreground inline-flex items-center justify-center font-bold">D</span>
          <span className="font-semibold text-foreground tracking-tight">DriveX <span className="text-muted-foreground font-normal">Lite</span></span>
        </Link>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-primary-soft via-card to-secondary p-10">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="relative max-w-md">
          <div className="surface-card p-6">
            <p className="text-sm font-medium text-muted-foreground">Today</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">Your files, beautifully organized</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"].map((c, i) => (
                <div key={i} className="aspect-square rounded-lg" style={{ backgroundColor: `${c}22` }}>
                  <div className="m-3 h-6 w-6 rounded-md" style={{ backgroundColor: c }} />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            One workspace for documents, images, videos, and everything you create.
          </p>
        </div>
      </div>
    </div>
  );
}
