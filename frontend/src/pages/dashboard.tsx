import { useState } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StorageCard } from "@/components/dashboard/StorageCard";
import { RecentUploads } from "@/components/dashboard/RecentUploads";
import { UploadBox } from "@/components/upload/UploadBox";
import { FolderCard } from "@/components/dashboard/FolderCard";
import { useAuth } from "@/context/AuthContext";
import { useFiles } from "@/context/FileContext";
import { Button } from "@/components/common/Button";
import { ArrowRight, FolderPlus } from "lucide-react";
import { CreateFolderModal } from "@/components/modals/CreateFolderModal";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Inner />
    </ProtectedRoute>
  );
}

function Inner() {
  const { user } = useAuth();
  const { folders, files, createFolder } = useFiles();
  const [search, setSearch] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);

  return (
    <DashboardLayout search={search} onSearchChange={setSearch}>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Hi, {user?.name?.split(" ")[0]}
          </h1>
        </div>
        <Button
          leftIcon={<FolderPlus className="h-4 w-4" />}
          variant="outline"
          onClick={() => setFolderOpen(true)}
        >
          New folder
        </Button>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <StorageCard />
          <UploadBox />
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">Folders</h2>
              <Link
                to="/my-drive"
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                Open My Drive <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {folders.slice(0, 6).map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  fileCount={files.filter((f) => f.folderId === folder.id && !f.isTrashed).length}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <RecentUploads />
        </div>
      </div>

      <CreateFolderModal
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
        onCreate={(name) => {
          createFolder(name);
          toast.success(`Created folder "${name}"`);
        }}
      />
    </DashboardLayout>
  );
}

