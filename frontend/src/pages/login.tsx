import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";
import { Mail, Lock, KeySquare, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const {
    login,
    requestOTP,
    verifyOTP,
    isAuthenticated,
    loading: authLoading,
    googleLogin,
  } = useAuth();

  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@drivex.app");
  const [password, setPassword] = useState("demo1234");
  const [otpCode, setOtpCode] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // google OAuth
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userData = queryParams.get("user");

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Successfully signed in with Google!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to parse Google user data:", error);
        toast.error("Google sign-in failed. Please try again.");
      }
    }
  }, [location, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  //
  const handleGoogleLogin = () => {
    // Open Google OAuth popup or redirect
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "http://localhost:5000/api/auth/google",
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    // Listen for OAuth callback
    window.addEventListener("message", (event) => {
      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        popup?.close();
        const { token, user } = event.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Successfully signed in with Google!");
        navigate("/dashboard");
      }
    });
  };

  //  const handleGoogleLogin = async () => {
  //   const result = await googleLogin();
  //   if (!result.ok) {
  //     toast.error(result.error || "Google login failed");
  //   }
  // };

  const handleGoogleLoginRedirect = () => {
    // window.location.href = "http://localhost:5000/api/auth/google";
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const requestOTPCode = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setOtpError(null);
    const res = await requestOTP(email);
    setLoading(false);

    console.log("otp res:", res);

    if (res.ok) {
      setOtpSent(true);
      toast.success("OTP sent to your email!");
      setError(null);
      setOtpError(null);
    } else {
      setError(res.error ?? "Failed to send OTP");
      setOtpError(res.error ?? "Failed to send OTP");
    }
  };

  const handleOTPSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setError("Please enter the OTP code");
      return;
    }

    setLoading(true);
    setError(null);
    const res = await verifyOTP(email, otpCode);
    setLoading(false);

    if (res.ok) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      setError(res.error ?? "Invalid OTP");
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
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

  // FIXED: Don't call e.preventDefault() twice
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (otpMode && !otpSent) {
      // Just request OTP, don't validate the OTP field
      requestOTPCode();
    } else if (otpMode && otpSent) {
      // Verify OTP
      handleOTPSubmit(e);
    } else {
      // Regular password login
      handlePasswordSubmit(e);
    }
  };

  const toggleOTPMode = () => {
    setOtpMode(!otpMode);
    setOtpSent(false);
    setOtpCode("");
    setError(null);
  };
  const resendOTP = async () => {
    setOtpSent(false);
    setOtpCode("");
    setError(null);
    setOtpError(null);
    await requestOTPCode();
  };

  // const submit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);
  //   const res = await login(email, password);
  //   setLoading(false);
  //   if (!res.ok) {
  //     setError(res.error ?? "Could not sign in");
  //     return;
  //   }
  //   toast.success("Welcome back!");
  //   navigate("/dashboard");
  // };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your DriveX workspace."
      footer={
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <div className="space-y-3">
        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLoginRedirect}
          className="w-full h-10 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground inline-flex items-center justify-center gap-2 transition-colors"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <button
          type="button"
          onClick={toggleOTPMode}
          className="w-full h-10 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground inline-flex items-center justify-center gap-2 transition-colors"
        >
          <KeySquare className="h-4 w-4" /> {otpMode ? "Use password instead" : "Sign in with OTP"}
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            required={!otpMode || (otpMode && !otpSent)} // Only required when sending OTP or regular login
            disabled={otpMode && otpSent}
            error={error && !otpMode ? error : undefined}
          />
          {otpMode && !otpSent && error && (
            <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {otpMode && otpSent ? (
          <div>
            <Input
              label="One-time code"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              leftIcon={<KeySquare className="h-4 w-4" />}
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError(null);
                setError(null);
              }}
              error={otpError ?? undefined}
              required
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={resendOTP}
                className="text-xs text-primary hover:underline"
                disabled={loading}
              >
                Didn't receive code? Resend OTP
              </button>
            </div>
          </div>
        ) : otpMode && !otpSent ? (
          <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            Click "Send OTP" to receive a verification code to your email
          </div>
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

        <Button type="submit" className="w-full" disabled={loading || authLoading}>
          {loading
            ? otpMode && !otpSent
              ? "Sending OTP..."
              : "Verifying..."
            : otpMode
              ? otpSent
                ? "Verify code"
                : "Send OTP"
              : "Sign in"}
        </Button>

        {!otpMode && (
          <p className="text-xs text-muted-foreground">
            Demo: <span className="font-medium text-foreground">sudev97@outlook.com</span> /{" "}
            <span className="font-medium text-foreground">test1234</span>
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.16c-.27 1.42-1.07 2.62-2.28 3.43v2.85h3.69C21.7 18.74 23 15.78 23 12.27z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.08 0 5.66-1.02 7.55-2.77l-3.69-2.85c-1.02.69-2.33 1.1-3.86 1.1-2.97 0-5.49-2-6.39-4.69H1.78v2.95C3.66 20.36 7.5 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.61 13.79A6.95 6.95 0 0 1 5.25 12c0-.62.11-1.22.31-1.79V7.26H1.78A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.43-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.67 0 3.16.57 4.34 1.7l3.25-3.25C17.66 2.05 15.08 1 12 1 7.5 1 3.66 3.64 1.78 7.26l3.83 2.95C6.51 7.38 9.03 5.38 12 5.38z"
      />
    </svg>
  );
}
