import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";

// API configuration
const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.withCredentials = true;

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
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "drivex.auth.token";
const USER_KEY = "drivex.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setHydrated(true);
  }, []);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    if (!hydrated) return;

    const loadUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      // Try to fetch fresh user data from backend
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/auth/profile`);

        const userData = {
          ...response.data,
          id: response.data._id,
          token: token,
        };
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } catch (error) {
        // If token is invalid, clear storage
        console.error("Failed to load user:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [hydrated]);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (user.token) {
        localStorage.setItem(TOKEN_KEY, user.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      }
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user, hydrated]);

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, ...userData } = response.data;

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
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, ...userData } = response.data;

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
      await axios.post(`${API_URL}/otp/request`, { email });
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
      const response = await axios.post(`${API_URL}/otp/verify`, { email, otp });

      const { token, ...userData } = response.data;

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
  };

  const updateProfile = async (patch: Partial<AuthUser>) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, patch);

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
        `${API_URL}/auth/google`,
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
