import { useEffect, useState } from "react";
import Icon from "./Icon";
import "./Toast.css";

// Native alert() messages are routed here so existing feedback keeps its exact
// wording but appears as a toast instead of a blocking browser dialog.
// confirm() and prompt() are intentionally left alone - they are decisions,
// not notifications.

const listeners = new Set();
let nextId = 1;

const TONE_ICON = { info: "info", warning: "alert", success: "check" };

function inferTone(message) {
  return /required|please|invalid|unable|could not|failed/i.test(message)
    ? "warning"
    : "info";
}

export function notify(message, tone) {
  const toast = {
    id: nextId++,
    message: String(message),
    tone: tone || inferTone(String(message)),
  };
  listeners.forEach((listener) => listener(toast));
}

export function installToastAlert() {
  if (typeof window === "undefined" || window.__ocToastInstalled) return;

  const nativeAlert = window.alert.bind(window);
  window.__ocToastInstalled = true;

  window.alert = (message) => {
    // Until the host has mounted, fall back to the browser's own dialog so a
    // message is never silently lost.
    if (listeners.size === 0) return nativeAlert(message);
    notify(message);
    return undefined;
  };
}

export function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = new Map();

    function dismiss(id) {
      clearTimeout(timers.get(id));
      timers.delete(id);
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }

    function add(toast) {
      setToasts((current) => [...current.slice(-3), toast]);
      timers.set(toast.id, setTimeout(() => dismiss(toast.id), 5200));
    }

    listeners.add(add);
    return () => {
      listeners.delete(add);
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="toast-region" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.tone}`}
          role={toast.tone === "warning" ? "alert" : "status"}
        >
          <Icon name={TONE_ICON[toast.tone] || "info"} size={18} />
          <p>{toast.message}</p>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss"
            onClick={() =>
              setToasts((current) => current.filter((t) => t.id !== toast.id))
            }
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
