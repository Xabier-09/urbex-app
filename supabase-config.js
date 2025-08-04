// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://qosgsviqhxwogkywwxdo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvc2dzdmlxaHh3b2dreXd3eGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTA1MDEsImV4cCI6MjA2OTg4NjUwMX0.MeNVskIgqfGsNfvPOak5j_EO3i-LxwjTVgAPhcE9WKU';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
window.supabaseClient = supabaseClient;
