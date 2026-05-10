import { Link, Navigate, useNavigate } from "react-router-dom";

import { useState, type FormEvent } from "react";
import { Mail, Lock, KeySquare } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@drivex.app");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpMode, setOtpMode] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Could not sign in");
      return;
    }
    toast.success("Welcome back!");
    navigate("/dashboard");

  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your DriveX Lite workspace."
      footer={
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
        </p>
      }
    >
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toast.info("Google sign-in is a UI demo only.")}
          className="w-full h-10 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground inline-flex items-center justify-center gap-2"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <button
          type="button"
          onClick={() => setOtpMode((v) => !v)}
          className="w-full h-10 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground inline-flex items-center justify-center gap-2"
        >
          <KeySquare className="h-4 w-4" /> {otpMode ? "Use password instead" : "Sign in with OTP"}
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />
        {otpMode ? (
          <Input
            label="One-time code"
            inputMode="numeric"
            placeholder="123 456"
            leftIcon={<KeySquare className="h-4 w-4" />}
          />
        ) : (
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            error={error ?? undefined}
            required
          />
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : otpMode ? "Verify code" : "Sign in"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo: <span className="font-medium text-foreground">alex@drivex.app</span> / <span className="font-medium text-foreground">demo1234</span>
        </p>
      </form>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.16c-.27 1.42-1.07 2.62-2.28 3.43v2.85h3.69C21.7 18.74 23 15.78 23 12.27z" />
      <path fill="#34A853" d="M12 23c3.08 0 5.66-1.02 7.55-2.77l-3.69-2.85c-1.02.69-2.33 1.1-3.86 1.1-2.97 0-5.49-2-6.39-4.69H1.78v2.95C3.66 20.36 7.5 23 12 23z" />
      <path fill="#FBBC05" d="M5.61 13.79A6.95 6.95 0 0 1 5.25 12c0-.62.11-1.22.31-1.79V7.26H1.78A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.43-3.15z" />
      <path fill="#EA4335" d="M12 5.38c1.67 0 3.16.57 4.34 1.7l3.25-3.25C17.66 2.05 15.08 1 12 1 7.5 1 3.66 3.64 1.78 7.26l3.83 2.95C6.51 7.38 9.03 5.38 12 5.38z" />
    </svg>
  );
}
