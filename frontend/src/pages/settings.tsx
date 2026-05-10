import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsInner />
    </ProtectedRoute>
  );
}

function SettingsInner() {
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState({ 
    email: true, 
    share: true, 
    marketing: false 
  });
  const [account, setAccount] = useState({ 
    twoFactor: false, 
    autoTrash: true 
  });

  const handleSaveSettings = () => {
    // Here you would typically save to an API/backend
    toast.success("Settings saved successfully");
  };

  return (
    <DashboardLayout search={search} onSearchChange={setSearch}>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Notifications" description="Choose what we email you about.">
          <Toggle
            label="Activity emails"
            desc="Comments, mentions, and file activity."
            checked={notif.email}
            onChange={(v) => setNotif((n) => ({ ...n, email: v }))}
          />
          <Toggle
            label="Sharing requests"
            desc="When someone asks to share a file with you."
            checked={notif.share}
            onChange={(v) => setNotif((n) => ({ ...n, share: v }))}
          />
          <Toggle
            label="Product updates"
            desc="Occasional news and tips. No spam."
            checked={notif.marketing}
            onChange={(v) => setNotif((n) => ({ ...n, marketing: v }))}
          />
        </Section>

        <Section title="Account" description="Manage account security and preferences.">
          <Toggle
            label="Two-factor authentication"
            desc="Add an extra layer of security at sign in."
            checked={account.twoFactor}
            onChange={(v) => setAccount((a) => ({ ...a, twoFactor: v }))}
          />
          <Toggle
            label="Auto-empty trash"
            desc="Permanently remove items after 30 days."
            checked={account.autoTrash}
            onChange={(v) => setAccount((a) => ({ ...a, autoTrash: v }))}
          />
          <div className="pt-2">
            <Button onClick={handleSaveSettings}>
              Save settings
            </Button>
          </div>
        </Section>
      </div>
    </DashboardLayout>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-6 space-y-1">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && (
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}