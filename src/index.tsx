import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SupabaseContextProvider } from "use-supabase";
import "./style.css";
import { supabase } from "./lib/api";

ReactDOM.render(
  <React.StrictMode>
    <SupabaseContextProvider client={supabase}>
      <App />
    </SupabaseContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
