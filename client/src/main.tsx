import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register PWA Service Worker for Offline & Home Screen Installation
if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log("✅ Vivah Kar Lo PWA ServiceWorker registered with scope:", registration.scope);
      },
      (err) => {
        console.log("⚠️ Vivah Kar Lo PWA ServiceWorker registration failed:", err);
      }
    );
  });
}

createRoot(document.getElementById("root")!).render(<App />);
