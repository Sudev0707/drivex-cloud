import React from "react";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./routes/AppRoutes";
import "./styles.css";

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}