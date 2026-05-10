import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { UploadModal } from "@/components/upload/UploadModal";

interface DashboardLayoutProps {
  children: ReactNode;
  search: string;
  onSearchChange: (v: string) => void;
}

export function DashboardLayout({ children, search, onSearchChange }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar search={search} onSearchChange={onSearchChange} />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>
      </div>
      <UploadModal />
    </div>
  );
}
