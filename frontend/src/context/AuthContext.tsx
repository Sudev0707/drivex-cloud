import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { mockUsers, type MockUser } from "@/data/users";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: MockUser["plan"];
  storageLimitMb: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "drivex.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user, hydrated]);

  const login: AuthContextValue["login"] = async (email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: "Invalid email or password" };
    }
    const { password: _pw, ...rest } = found;
    setUser(rest);
    return { ok: true };
  };

  const register: AuthContextValue["register"] = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!name || !email || !password) return { ok: false, error: "All fields are required" };
    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3b82f6&textColor=ffffff`,
      plan: "Free",
      storageLimitMb: 2048,
    };
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (patch: Partial<AuthUser>) =>
    setUser((u) => (u ? { ...u, ...patch } : u));

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
