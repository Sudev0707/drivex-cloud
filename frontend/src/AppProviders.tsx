import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { FileProvider } from "@/context/FileContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {

  return (
      <ThemeProvider>
        <AuthProvider>
          <FileProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </FileProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}

