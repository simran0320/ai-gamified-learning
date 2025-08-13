// src/main.jsx
// Import React and ReactDOM for rendering the app
import React from "react";
import ReactDOM from "react-dom/client";
// Import global CSS (Tailwind + custom tokens)
import "./index.css";
// Import the root App component
import App from "./App.jsx";

// Render <App /> into #root in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode helps catch problems in dev; safe to keep
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
