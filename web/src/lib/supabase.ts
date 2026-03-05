import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is missing. Using placeholder for build.');
}

// Singleton instance to prevent "Multiple GoTrueClient instances detected" warning
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
    }
    return supabaseInstance;
})();
