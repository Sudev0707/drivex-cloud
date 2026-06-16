import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { TOKEN_KEY, USER_KEY } from "@/constants/auth";
import { apiClient } from "@/services/apiClient";
import { BASE_URL } from "@/services/client";

function persistToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

interface AuthUser {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan?: "Free" | "Pro" | "Enterprise";
  storageLimitMb?: number;
  token?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  requestOTP: (email: string) => Promise<{ ok: boolean; error?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ ok: boolean; error?: string }>;
  googleLogin: () => Promise<{ ok: boolean; error?: string }>;
  completeGoogleAuth: (token: string, userData: Record<string, unknown>) => void;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildAuthUser(userData: Record<string, unknown>, token: string): AuthUser {
  const name = String(userData.name ?? "User");
  return {
    ...(userData as AuthUser),
    id: String(userData._id ?? userData.id),
    token,
    avatar:
      (userData.avatar as string | undefined) ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3b82f6&textColor=ffffff`,
    plan: (userData.plan as AuthUser["plan"]) || "Free",
    storageLimitMb: (userData.storageLimitMb as number) || 2048,
  };
}

function readGoogleAuthFromUrl(): { token: string; user: Record<string, unknown> } | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userData = params.get("user");
  if (!token || !userData) return null;

  try {
    return { token, user: JSON.parse(decodeURIComponent(userData)) as Record<string, unknown> };
  } catch {
    return null;
  }
}

function readStoredUser(): AuthUser | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    return { ...parsed, token };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Restore token before auth hydration completes
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) persistToken(token);
    setHydrated(true);
  }, []);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    if (!hydrated) return;

    const loadUser = async () => {
      const googleAuth = readGoogleAuthFromUrl();
      if (googleAuth) {
        const authUser = buildAuthUser(googleAuth.user, googleAuth.token);
        setUser(authUser);
        persistToken(googleAuth.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        window.history.replaceState({}, "", "/dashboard");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      // Try to fetch fresh user data from backend
      try {
        persistToken(token);
        const response = await apiClient.get("/auth/profile");

        const userData = {
          ...response.data,
          id: response.data._id,
          token: token,
        };
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [hydrated]);

  // Persist user to localStorage when it changes (never clear here — logout handles that)
  useEffect(() => {
    if (!hydrated || !user) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.token) persistToken(user.token);
  }, [user, hydrated]);

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { token, ...userData } = response.data;
      persistToken(token);

      const authUser: AuthUser = {
        ...userData,
        id: userData._id,
        token: token,
        avatar:
          userData.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=3b82f6&textColor=ffffff`,
        plan: userData.plan || "Free",
        storageLimitMb: userData.storageLimitMb || 2048,
      };

      setUser(authUser);
      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register: AuthContextValue["register"] = async (name, email, password) => {
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token, ...userData } = response.data;
      persistToken(token);

      const authUser: AuthUser = {
        ...userData,
        id: userData._id,
        token: token,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3b82f6&textColor=ffffff`,
        plan: "Free",
        storageLimitMb: 2048,
      };

      setUser(authUser);
      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  };

  const requestOTP: AuthContextValue["requestOTP"] = async (email) => {
    try {
      await apiClient.post("/otp/request", { email });
      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.message || "Failed to send OTP. Please try again.",
      };
    }
  };

  const verifyOTP: AuthContextValue["verifyOTP"] = async (email, otp) => {
    try {
      const response = await apiClient.post("/otp/verify", { email, otp });

      const { token, ...userData } = response.data;
      persistToken(token);

      const authUser: AuthUser = {
        ...userData,
        id: userData._id,
        token: token,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}&backgroundColor=3b82f6&textColor=ffffff`,
        plan: userData.plan || "Free",
        storageLimitMb: userData.storageLimitMb || 2048,
      };

      setUser(authUser);
      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.message || "OTP verification failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.clear();

    console.log("User logged out, all auth data cleared");
  };

  const updateProfile = async (patch: Partial<AuthUser>) => {
    try {
      const response = await apiClient.put("/auth/profile", patch);

      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...response.data,
          ...patch,
        };
      });

      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error: error.response?.data?.message || "Failed to update profile.",
      };
    }
  };

  const completeGoogleAuth = (token: string, userData: Record<string, unknown>) => {
    const authUser = buildAuthUser(userData, token);
    setUser(authUser);
    persistToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  };

  const googleLogin = async () => {
    try {
      // Use BASE_URL here (not API_URL) to avoid double /api
      window.location.href = `${BASE_URL}/api/auth/google`;
      return { ok: true };
    } catch (error: any) {
      console.error("Google login error:", error);
      return { ok: false, error: error.message };
    }
  };

  // Or if you want to handle it without redirect (popup method):
  const googleLoginPopup = async () => {
    try {
      // Open Google OAuth in popup
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        `${BASE_URL}/api/auth/google`,
        "Google Login",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      // Listen for callback
      return new Promise((resolve) => {
        window.addEventListener("message", (event) => {
          if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
            popup?.close();
            const { token, user } = event.data;
            localStorage.setItem(TOKEN_KEY, token);
            persistToken(token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            setUser(user);
            resolve({ ok: true });
          }
        });
      });
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        requestOTP,
        verifyOTP,
        googleLogin,
        completeGoogleAuth,
        logout,
        updateProfile,
      }}
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
