import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akaehkvcuiznnxraqsah.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrYWVoa3ZjdWl6bm54cmFxc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1OTc2ODEsImV4cCI6MjA1NTE3MzY4MX0.q460X0gNtkZR5O46QOS0xnXAat3WpLrr1o01hBF_PIc"; // Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

