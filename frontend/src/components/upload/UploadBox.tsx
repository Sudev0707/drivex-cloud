import { Plus } from "lucide-react";
import { useFiles } from "@/context/FileContext";
import { Button } from "@/components/common/Button";

export function UploadBox() {
  const { setUploadOpen } = useFiles();
  return (
    <div className="surface-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Add new files</h3>
        <p className="text-sm text-muted-foreground">Upload documents, images, and videos to your drive.</p>
      </div>
      <Button variant="dark" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setUploadOpen(true)}>
        Upload files
      </Button>
    </div>
  );
}
