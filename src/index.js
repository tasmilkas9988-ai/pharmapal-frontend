import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { Toaster } from "@/components/ui/sonner";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" />
  </React.StrictMode>,
);

// Note: Service Worker registration is handled by Firebase Messaging in firebase.js
// to avoid conflicts with Firebase Cloud Messaging
// v1763981161
