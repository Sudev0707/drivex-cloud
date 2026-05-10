import { useState } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useFiles } from "@/context/FileContext";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { formatBytes, mbToBytes } from "@/utils/formatBytes";
import { Crown, Check, HardDrive } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [search, setSearch] = useState("");

  return (
    <ProtectedRoute>
      <ProfileInner search={search} onSearchChange={setSearch} />
    </ProtectedRoute>
  );
}

function ProfileInner({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const { user, updateProfile } = useAuth();
  const { totalUsedBytes } = useFiles();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const limit = mbToBytes(user?.storageLimitMb ?? 2048);
  const pct = Math.min(100, Math.round((totalUsedBytes / limit) * 100));

  return (
    <DashboardLayout search={search} onSearchChange={onSearchChange}>
      <div>
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Profile</h1>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 surface-card p-6">
          <div className="flex items-center gap-4">
            <img src={user?.avatar} alt={user?.name ?? "User"} className="h-16 w-16 rounded-full" />
            <div>
              <p className="text-base font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form
            className="mt-6 grid sm:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({ name, email });
              toast.success("Profile updated");
            }}
          >
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setName(user?.name ?? "");
                  setEmail(user?.email ?? "");
                }}
              >
                Reset
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Crown className="h-4 w-4 text-primary" /> Storage plan
          </div>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{user?.plan}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <HardDrive className="h-4 w-4" /> {formatBytes(totalUsedBytes)} of {formatBytes(limit)}
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-foreground">
              <Check className="h-4 w-4 text-success" /> Unlimited folders
            </li>
            <li className="flex items-center gap-2 text-foreground">
              <Check className="h-4 w-4 text-success" /> Sharing &amp; collaboration
            </li>
            <li className="flex items-center gap-2 text-foreground">
              <Check className="h-4 w-4 text-success" /> 30-day file recovery
            </li>
          </ul>
          <Button className="mt-6 w-full" onClick={() => toast.info("Upgrades are demo-only")}>
            Upgrade plan
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

