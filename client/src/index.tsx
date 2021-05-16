import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SupabaseContextProvider } from "use-supabase";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMTE4NjM2NiwiZXhwIjoxOTM2NzYyMzY2fQ.XgdUqTdAEtAnMhHqV-KgPGc21faeqHRH0kqLBqCN5Nc";
const SUPABASE_URL = "https://lxzwfafkwtwccolpxjre.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

ReactDOM.render(
  <React.StrictMode>
    <SupabaseContextProvider client={supabase}>
      <App />
    </SupabaseContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
