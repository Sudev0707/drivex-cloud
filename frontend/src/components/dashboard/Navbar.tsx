import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Plus, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/common/Button";
import { useFiles } from "@/context/FileContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface NavbarProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export function Navbar({ search, onSearchChange }: NavbarProps) {
  const { setSidebarOpen, setUploadOpen } = useFiles();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur border-b border-border">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button
          className="md:hidden rounded-md p-2 hover:bg-muted text-foreground"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 flex items-center">
          <SearchBar value={search} onChange={onSearchChange} />
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setUploadOpen(true)}
          className="hidden sm:inline-flex"
        >
          Upload
        </Button>

        <button
          className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 h-10 rounded-lg hover:bg-muted transition-colors"
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover bg-muted"
            />
            <span className="hidden md:block text-sm font-medium text-foreground">{user?.name}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 surface-pop p-2 z-30">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground"
              >
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground"
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-destructive"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}