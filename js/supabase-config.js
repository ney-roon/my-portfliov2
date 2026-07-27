// Shared Supabase client, used by index.html, admin-login.html, and admin.html.
//
// The "anon" key below is meant to be public - it's safe to commit. Real
// security comes from the Row Level Security (RLS) policies set up in
// supabase/setup.sql, not from hiding this key. Never put the separate
// "service_role" key here or anywhere in this project - it bypasses RLS
// entirely and must stay private.

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// TODO: paste your Project URL and anon public key here.
// Find them in your Supabase project: Settings > API.
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isConfigured) {
  console.warn("Supabase isn't set up yet - add your URL and anon key in js/supabase-config.js");
}

// Everything that uses this client checks for null first, so the site keeps
// working (just without the Supabase-powered features) until keys are added.
export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
