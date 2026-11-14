import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project') &&
    supabaseServiceKey &&
    supabaseServiceKey !== 'your-supabase-service-role-key'
  );
};

let _supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!_supabaseClient) {
    if (!isSupabaseConfigured()) {
      // Create a dummy client to avoid null reference if invoked accidentally
      _supabaseClient = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseServiceKey || 'placeholder-anon-key',
        {
          auth: { persistSession: false }
        }
      );
    } else {
      _supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    }
  }
  return _supabaseClient;
};
