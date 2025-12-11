import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
