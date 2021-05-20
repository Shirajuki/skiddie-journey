import { createClient } from "@supabase/supabase-js";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMTE4NjM2NiwiZXhwIjoxOTM2NzYyMzY2fQ.XgdUqTdAEtAnMhHqV-KgPGc21faeqHRH0kqLBqCN5Nc";
const SUPABASE_URL = "https://lxzwfafkwtwccolpxjre.supabase.co";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
