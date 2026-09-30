import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastHost, installToastAlert } from "./components/common/Toast";

installToastAlert();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ToastHost />
  </React.StrictMode>
);
