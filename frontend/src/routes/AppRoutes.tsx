

import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import DashboardPage from "../pages/dashboard";
import MyDrivePage from "../pages/my-drive";
import ProfilePage from "../pages/profile";
import SettingsPage from "../pages/settings";
import SharedPage from "../pages/shared";
import TrashPage from "../pages/trash";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/my-drive" element={<MyDrivePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/shared" element={<SharedPage />} />
      <Route path="/trash" element={<TrashPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}