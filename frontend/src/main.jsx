import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/athixwear-ecommerce">
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
